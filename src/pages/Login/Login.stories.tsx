import { Meta, StoryObj } from '@storybook/react'
import Login from './Login'
import path from 'src/constants/path'
import RegisterLayout from 'src/Layout/ResisterLayout'

const meta = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const LoginPage: Story = {
  parameters: {
    reactRouter: {
      routePath: path.login
    }
  }
}

export const LoginPageWithLayout: Story = {
  parameters: {
    reactRouter: {
      routePath: path.login
    }
  },
  decorators: [
    (Story) => (
      <RegisterLayout>
        <Story />
      </RegisterLayout>
    )
  ]
}
