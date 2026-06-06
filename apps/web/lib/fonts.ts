import localFont from 'next/font/local'

export const commit = localFont({
  src: [
    {
      path: '../app/fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-commit',
  display: 'block',
})

export const akzidenz = localFont({
  src: [
    {
      path: '../app/fonts/AkzidenzGroteskBE-Regular.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-akzidenz',
  display: 'block',
})

export const sonne = localFont({
  src: [
    {
      path: '../app/fonts/TestSohne-Buch.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-sonne',
  display: 'block',
})

export const thie = localFont({
  src: [
    {
      path: '../app/fonts/theinhardt-regular.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-thie',
  display: 'block',
})
