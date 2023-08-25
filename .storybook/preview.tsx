import type { Preview } from '@storybook/react'
import '../src/index.css'
import { withRouter } from 'storybook-addon-react-router-v6'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '../src/contexts/app.context'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from '../src/components/ErrorBoundary'
import React from 'react'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  },
  logger: {
    log: console.log,
    warn: console.warn,
    // no more errors on the console
    error: () => null
  }
})

export const decorators = [
  withRouter,
  (Story) => (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <HelmetProvider>
          <ErrorBoundary>
            <Story />
          </ErrorBoundary>
        </HelmetProvider>
      </AppProvider>
    </QueryClientProvider>
  )
]

export default preview
