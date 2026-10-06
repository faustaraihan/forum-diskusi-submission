/**
 * Skenario pengujian:
 * - Navigasi mengembalikan scroll dan fokus ke main content.
 * - Retry pemulihan sesi tidak memperlakukan auth belum pulih sebagai guest.
 */
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createAppStore } from '../app/store';
import AppLayout from './AppLayout';
import api, { ApiError } from '../services/api';
import { setToken, getToken } from '../services/token';
import { bootstrapAuth } from '../states/auth/thunks';
import VoteButtons from './VoteButtons';
import CommentForm from './CommentForm';

it('starts the next page at the top and moves keyboard focus to its main content', () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(
    <Provider store={createAppStore()}>
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<h1>Beranda</h1>} />
            <Route path="/leaderboards" element={<h1>Kontributor</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  fireEvent.click(screen.getByRole('link', { name: 'Peringkat' }));
  expect(screen.getByRole('heading', { name: 'Kontributor' })).toBeInTheDocument();
  expect(scroll).toHaveBeenLastCalledWith(0, 0);
  expect(document.activeElement).toBe(screen.getByRole('main'));
});

it('offers public-page session retry and does not treat unresolved authentication as a guest', async () => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  setToken('saved');
  vi.spyOn(api, 'getMe')
    .mockRejectedValueOnce(new ApiError('Offline', 0))
    .mockResolvedValueOnce({ id: 'me', name: 'Ayu', avatar: '' });
  const store = createAppStore();
  await store.dispatch(bootstrapAuth());
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <>
                  <h1>Diskusi publik</h1>
                  <VoteButtons threadId="t1" upVotesBy={[]} downVotesBy={[]} />
                  <CommentForm threadId="t1" />
                </>
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole('button', { name: 'Up-vote diskusi' })).toBeDisabled();
  expect(
    screen.queryByRole('link', { name: 'Masuk untuk ikut berdiskusi' })
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Coba lagi sesi' }));
  await waitFor(() => expect(screen.getByText('Ayu')).toBeInTheDocument());
  expect(getToken()).toBe('saved');
  expect(screen.getByRole('button', { name: 'Up-vote diskusi' })).toBeEnabled();
  expect(screen.getByLabelText('Tanggapanmu')).toBeInTheDocument();
});
