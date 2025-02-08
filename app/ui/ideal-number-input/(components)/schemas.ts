import z from 'zod'

export const articleNumberInputSchema = z.object({
    width: z.string(),//.transform((v) => Number(v)||0), 
    height: z.string()
    //z.number().multipleOf(0.01, { message: "Must have at most 2 decimal places" })
});
