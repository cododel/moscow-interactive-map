import { cn } from '@/utilities/cn'
import { Inter, Montserrat } from 'next/font/google'
import React from 'react'
import './styles.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: 'Интерактивная карта Москвы',
  description: 'Премиальная интерактивная карта Москвы, созданная на PayloadCMS.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cn(inter.variable, montserrat.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  )
}
