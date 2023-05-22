import { Inter } from 'next/font/google'
import React from 'react';
import { Providers } from '@/app/providers';

const inter = Inter({
  subsets: ['latin']
})

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = (props) => {
  const { children } = props

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
