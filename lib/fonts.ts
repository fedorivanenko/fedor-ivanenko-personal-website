import { Barlow } from 'next/font/google'
import localFont from 'next/font/local'

export const iosevka = localFont({
  src: [
    {
      path: '../app/fonts/Iosevka-Aile-01.woff2',
      weight: '400',
      style: 'normal'
    }
  ],
    variable: '--font-iosevka-aile',
    display: 'swap',
})


export const commit = localFont({
  src: [
    {
      path: '../app/fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-commit-mono',
  display: 'swap',
})

export const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-barlow-sans',
  display: 'swap',
})