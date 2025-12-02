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