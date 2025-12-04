// Standard-normal → scaled to [low, high]
function gaussianArray(
    N: number,
    low: number,
    high: number
): number[] {
    const out = new Array(N);

    for (let i = 0; i < N; i++) {
        // Box–Muller transform: standard normal (mean 0, sd 1)
        const u = Math.random() || 1e-12;
        const v = Math.random() || 1e-12;
        const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

        // Map z∈(-∞,∞) to [low, high] by normalization
        // Typical ±3σ → clamp
        const norm = (z + 3) / 6; // maps ~[-3,3] → [0,1]
        const clamped = Math.min(1, Math.max(0, norm));

        out[i] = low + clamped * (high - low);
    }

    return out;
}

export { gaussianArray }


export const data = [
    { x: 0, y: 5.839116384273172 },
    { x: 1, y: 2.8881046412090368 },
    { x: 2, y: 6.7189317145179785 },
    { x: 3, y: 5.849860796525438 },
    { x: 4, y: 6.098782992145488 },
    { x: 5, y: 8.184987970071036 },
    { x: 6, y: 6.911620732220497 },
    { x: 7, y: 3.545599107599997 },
    { x: 8, y: 6.9454313012921745 },
    { x: 9, y: 3.023813444190458 },
    { x: 10, y: 6.710550244356881 },
    { x: 11, y: 5.125049747241689 },
    { x: 12, y: 4.5712565213301755 },
    { x: 13, y: 6.203423302242906 },
    { x: 14, y: 7.0355694014706325 },
    { x: 15, y: 4.34671909881186 },
    { x: 16, y: 5.780487364740237 },
    { x: 17, y: 6.9031789295825785 },
    { x: 18, y: 0.9813843353408891 },
    { x: 19, y: 2.9837108661092793 },
    { x: 20, y: 5.39411163161041 },
    { x: 21, y: 5.326856310194788 },
    { x: 22, y: 9.1643541347729 },
    { x: 23, y: 3.1026131694369283 }
]