import localFont from 'next/font/local'

export const iosevka = localFont({
  src: [
    {
      path: '../app/fonts/Iosevka-LatinOnly-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../app/fonts/Iosevka-LatinOnly-Bold.woff2',
      weight: '600',
      style: 'semibold'
    }
  ],
    variable: '--font-iosevka',
    display: 'block',
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
  display: 'block',
})