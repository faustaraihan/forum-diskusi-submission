import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { createAppStore } from '../app/store';
import { authenticatedState, thread } from '../test/fixtures';
import api from '../services/api';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import NewThreadPage from './NewThreadPage';
import CommentForm from '../components/CommentForm';

function LocationCapture() {
  const location = useLocation();
  return <p>{location.pathname}</p>;
}

function mount(element, authenticated = false) {
  const store = createAppStore(authenticated ? { auth: authenticatedState() } : undefined);
  render(<Provider store={store}><MemoryRouter><Routes><Route path="/" element={element} /><Route path="*" element={<LocationCapture />} /></Routes></MemoryRouter></Provider>);
  return store;
}

it('rejects a short registration password without sending a request', () => {
  const request = vi.spyOn(api, 'register');
  mount(<RegisterPage />);
  fireEvent.change(screen.getByLabelText('Nama'), { target: { value: 'Ayu' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ayu@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'abc' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Buat akun' }).closest('form'));
  expect(screen.getByRole('alert')).toHaveTextContent('6 karakter');
  expect(request).not.toHaveBeenCalled();
});

it('keeps the email and allows retry when login fails', async () => {
  vi.spyOn(api, 'login').mockRejectedValue(new Error('Login gagal'));
  mount(<LoginPage />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ayu@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
  fireEvent.click(screen.getByRole('button', { name: 'Masuk ke ruang' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Login gagal');
  expect(screen.getByLabelText('Email')).toHaveValue('ayu@example.com');
  expect(screen.getByRole('button', { name: 'Masuk ke ruang' })).toBeEnabled();
});

it('does not allow whitespace-only thread content', () => {
  const request = vi.spyOn(api, 'createThread');
  mount(<NewThreadPage />, true);
  fireEvent.change(screen.getByLabelText('Judul'), { target: { value: 'Judul' } });
  fireEvent.change(screen.getByLabelText('Isi diskusi'), { target: { value: '   ' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Terbitkan diskusi' }).closest('form'));
  expect(screen.getByRole('alert')).toHaveTextContent('isi');
  expect(request).not.toHaveBeenCalled();
});

it('opens the server-created thread and prevents a duplicate pending submit', async () => {
  let resolveThread;
  const request = vi.spyOn(api, 'createThread').mockImplementation(() => new Promise((resolve) => { resolveThread = resolve; }));
  mount(<NewThreadPage />, true);
  fireEvent.change(screen.getByLabelText('Judul'), { target: { value: 'Judul' } });
  fireEvent.change(screen.getByLabelText('Isi diskusi'), { target: { value: 'Konten' } });
  const submit = screen.getByRole('button', { name: 'Terbitkan diskusi' });
  fireEvent.click(submit);
  expect(submit).toBeDisabled();
  fireEvent.submit(submit.closest('form'));
  expect(request).toHaveBeenCalledTimes(1);
  resolveThread(thread('server-id'));
  expect(await screen.findByText('/threads/server-id')).toBeInTheDocument();
});

it('keeps thread contents after a failed submission', async () => {
  vi.spyOn(api, 'createThread').mockRejectedValue(new Error('Offline'));
  mount(<NewThreadPage />, true);
  fireEvent.change(screen.getByLabelText('Judul'), { target: { value: 'Judul' } });
  fireEvent.change(screen.getByLabelText('Isi diskusi'), { target: { value: 'Konten' } });
  fireEvent.click(screen.getByRole('button', { name: 'Terbitkan diskusi' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Offline');
  expect(screen.getByLabelText('Isi diskusi')).toHaveValue('Konten');
});

it('keeps a failed comment and clears it only after a successful retry', async () => {
  vi.spyOn(api, 'createComment').mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce({ id: 'c1', content: 'Komentar', owner: { id: 'me', name: 'Ayu' }, upVotesBy: [], downVotesBy: [] });
  mount(<CommentForm threadId="t1" />, true);
  fireEvent.change(screen.getByLabelText('Tanggapanmu'), { target: { value: 'Komentar' } });
  fireEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Offline');
  expect(screen.getByLabelText('Tanggapanmu')).toHaveValue('Komentar');
  fireEvent.click(screen.getByRole('button', { name: 'Kirim komentar' }));
  await waitFor(() => expect(screen.getByLabelText('Tanggapanmu')).toHaveValue(''));
});
