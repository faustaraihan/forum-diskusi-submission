/**
 * Skenario AsyncState:
 * - Loading menyajikan status dan menyembunyikan konten.
 * - Kegagalan menampilkan pesan error serta menyediakan retry.
 * - Hasil kosong menjelaskan bahwa belum ada diskusi.
 * - Hasil sukses menyajikan konten tanpa indikator loading/error.
 */
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AsyncState from './AsyncState';

it('shows a loading status instead of stale content', () => {
  render(<AsyncState status="loading">Konten diskusi</AsyncState>);
  expect(screen.getByRole('status')).toHaveTextContent('Memuat');
  expect(screen.queryByText('Konten diskusi')).not.toBeInTheDocument();
});

it('shows the error and allows retry', () => {
  const onRetry = vi.fn();
  render(<AsyncState status="failed" error="Koneksi terputus" onRetry={onRetry} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Koneksi terputus');
  fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

it('explains an empty successful result', () => {
  render(<AsyncState status="succeeded" isEmpty>Konten diskusi</AsyncState>);
  expect(screen.getByRole('heading', { name: 'Belum ada diskusi' })).toBeInTheDocument();
  expect(screen.queryByText('Konten diskusi')).not.toBeInTheDocument();
});

it('renders successful content without an error or loading indicator', () => {
  render(<AsyncState status="succeeded"><h2>Diskusi React</h2></AsyncState>);
  expect(screen.getByRole('heading', { name: 'Diskusi React' })).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
