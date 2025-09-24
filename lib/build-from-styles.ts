export type FromVals = Record<string, number | string>;

/**
 * All outputs are strings so they satisfy Tailwind's CssInJs.
*/
export function buildFromStyles(from: FromVals): Record<string, string> {
  const rules: Record<string, string> = {};
  const transforms: string[] = [];

  const TRANSFORM_MAP: Record<string,string> = {
    x:       'translateX',
    y:       'translateY',
    scale:   'scale',
    rotate:  'rotate',
    skewX:   'skewX',
    skewY:   'skewY',
  };

  for (const [key, raw] of Object.entries(from)) {
    if (raw == null) continue;

    if (key in TRANSFORM_MAP) {
      // build up transform list
      const val =
        typeof raw === 'number'
          ? key === 'rotate'
            ? `${raw}deg`
            : `${raw}px`
          : raw.toString();
      transforms.push(`${TRANSFORM_MAP[key]}(${val})`);
    } else {
      // everything else becomes a string
      rules[key] = raw.toString();
    }
  }

  if (transforms.length) {
    rules.transform = transforms.join(' ');
  }

  return rules;
}
