import { useArgs } from 'storybook/preview-api';
import CategoryFilter from './CategoryFilter';

export default {
  title: 'Forum/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  args: { categories: ['react', 'redux', 'testing'], value: '' },
  argTypes: {
    value: { control: 'select', options: ['', 'react', 'redux', 'testing'] },
    onChange: { control: false },
  },
  render: function Render(args) {
    const [{ value }, updateArgs] = useArgs();
    return <CategoryFilter {...args} value={value} onChange={(category) => updateArgs({ value: category })} />;
  },
};

export const SemuaTopik = {};
export const KategoriTerpilih = { args: { value: 'react' } };
export const TanpaKategori = { args: { categories: [] } };
