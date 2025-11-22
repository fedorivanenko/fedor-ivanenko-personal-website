import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const etBook = localFont({
  src: [
    {
      path: '../app/fonts/et-book-roman-line-figures.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../app/fonts/et-book-semi-bold-old-style-figures.woff',
      weight: '600',
      style: 'normal'
    },
    {
      path: '../app/fonts/et-book-bold-line-figures.woff',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../app/fonts/et-book-display-italic-old-style-figures.woff',
      weight: '400',
      style: 'italic'
    },
    
  ],
  variable: '--font-et-book',
  display: 'swap',
})

export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})