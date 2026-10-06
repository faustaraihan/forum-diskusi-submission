/**
 * Skenario CategoryFilter:
 * - Semua topik terpilih ketika tidak ada kategori aktif.
 * - Klik kategori memanggil perubahan dengan kategori yang benar.
 * - Klik semua topik mengosongkan filter aktif.
 * - Kategori terpilih memiliki aria-pressed untuk teknologi bantu.
 */
import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

it('selects all topics when no category is active', () => {
  render(<CategoryFilter categories={['react', 'redux']} value="" onChange={() => {}} />);
  expect(screen.getByRole('button', { name: 'Semua topik' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: /react/ })).toHaveAttribute('aria-pressed', 'false');
});

it('requests the clicked category', () => {
  const onChange = vi.fn();
  render(<CategoryFilter categories={['react', 'redux']} value="" onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: /redux/ }));
  expect(onChange).toHaveBeenCalledWith('redux');
});

it('clears the category when all topics is clicked', () => {
  const onChange = vi.fn();
  render(<CategoryFilter categories={['react']} value="react" onChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Semua topik' }));
  expect(onChange).toHaveBeenCalledWith('');
});

it('reflects a changed selection in its accessible button state', () => {
  const { rerender } = render(<CategoryFilter categories={['react', 'redux']} value="react" onChange={() => {}} />);
  rerender(<CategoryFilter categories={['react', 'redux']} value="redux" onChange={() => {}} />);
  expect(screen.getByRole('button', { name: /react/ })).toHaveAttribute('aria-pressed', 'false');
  expect(screen.getByRole('button', { name: /redux/ })).toHaveAttribute('aria-pressed', 'true');
});
