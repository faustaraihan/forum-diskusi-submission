import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createAppStore } from '../app/store';
import AppLayout from './AppLayout';

it('starts the next page at the top and moves keyboard focus to its main content', () => {
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  render(<Provider store={createAppStore()}><MemoryRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<h1>Beranda</h1>} /><Route path="/leaderboards" element={<h1>Kontributor</h1>} /></Route></Routes></MemoryRouter></Provider>);
  fireEvent.click(screen.getByRole('link', { name: 'Peringkat' }));
  expect(screen.getByRole('heading', { name: 'Kontributor' })).toBeInTheDocument();
  expect(scroll).toHaveBeenLastCalledWith(0, 0);
  expect(document.activeElement).toBe(screen.getByRole('main'));
});
