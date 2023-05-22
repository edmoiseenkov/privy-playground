'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient()

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = (props) => {
  const { children } = props

  return (
    <CacheProvider>
      <ChakraProvider>
        <PrivyProvider appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}