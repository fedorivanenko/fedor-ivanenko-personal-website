import plugin from 'tailwindcss/plugin';
import { animationConfigs } from './animations';
import { convertGSAPtoCSS } from './build-tailwind-from-gsap';

export const buildInitialStyles = plugin(({ addBase }) => {
    const animationBaseStyles = Object.entries(animationConfigs).reduce(
        (styles, [animationName, animationConfig]) => {
            styles[`[data-animation="${animationName}"]`] = convertGSAPtoCSS(animationConfig.from);
            return styles;
        },
        {} as Record<string, Record<string, string>>
    );

    addBase(animationBaseStyles);
});