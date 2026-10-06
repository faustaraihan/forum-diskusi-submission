import { fn } from 'storybook/test';
import AsyncState from './AsyncState';

export default {
  title: 'Forum/AsyncState',
  component: AsyncState,
  tags: ['autodocs'],
  args: { status: 'loading', onRetry: fn(), isEmpty: false },
  argTypes: {
    status: { control: 'select', options: ['idle', 'loading', 'failed', 'succeeded'] },
    children: { control: false },
  },
};

export const Memuat = {};
export const Gagal = { args: { status: 'failed', error: 'Tidak dapat terhubung. Periksa koneksi internet.' } };
export const Kosong = { args: { status: 'succeeded', isEmpty: true } };
export const Berhasil = {
  args: { status: 'succeeded', children: <article className="state-panel"><h2>Diskusi siap dibaca</h2><p>Konten muncul setelah permintaan berhasil.</p></article> },
};
