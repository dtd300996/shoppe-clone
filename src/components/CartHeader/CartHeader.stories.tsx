import { StoryObj, Meta } from '@storybook/react'
import CartHeader from './CartHeader'

const meta = {
  title: 'Components/CartHeader',
  component: CartHeader,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof CartHeader>

export default meta

type Story = StoryObj<typeof meta>

export const CartHeaderDefault: Story = { args: {} }
