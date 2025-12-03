import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin'
//import { buildInitialStyles } from './lib/build-initial-styles';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@fedor/wheel-picker/**/*.{tsx,ts,mjs}',
  ],
  plugins: [
    //buildInitialStyles
    plugin(function({ addUtilities }) {
      addUtilities(
        Object.fromEntries(
          Array.from({ length: 20 }, (_, i) => [
            `.animation-container .stagger:nth-child(${i + 1})`,
            { '--stagger': `${i}` }
          ])
        )
      );
    })
  ],
};

export default config;
