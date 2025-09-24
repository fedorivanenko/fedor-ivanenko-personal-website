import plugin from 'tailwindcss/plugin';
import type { Config } from 'tailwindcss';
import { animations } from './lib/animations';
import { buildFromStyles } from './lib/build-from-styles';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [
    plugin(({ addBase }) => {

      const animationStyles = Object.fromEntries(
        Object.entries(animations).map(([key, { from }]) => [
          `[data-animation="${key}"]`,
          buildFromStyles(from),
        ])
      );
      addBase({
        ...animationStyles,
      });
    }),
  ],
};

export default config;
