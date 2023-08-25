import Button from 'src/components/Button';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ButtonDefault: Story = {
  args: {
    children: 'Button 1',
    className: 'flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
  },
};

export const ButtonIsLoading: Story = {
  args: {
    children: 'Button is loading',
    isLoading: true,
    className: 'flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
  },
};

export const ButtonDisabled: Story = {
  args: {
    children: 'Button is disabled',
    disabled: true,
    className: 'flex w-full items-center justify-center bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'
  },
};