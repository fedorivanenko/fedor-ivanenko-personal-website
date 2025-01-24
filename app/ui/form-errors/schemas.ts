import z from 'zod'

export const formSchema = z.object({
    firstName: z.string().trim().min(1, { message: "Required" }),
    lastName: z.string().trim().min(1, { message: "Required" }),
    email: z.string().trim().min(
        1,
        { message: "Please provide your email" }
    )
        .email({
            message: "Email should be like name@domain.com",
        })
});


export const formSchemaBetterMessages = z.object({
    firstName: z.string().trim().min(1, { message: "First name is required" }),
    lastName: z.string().trim().min(1, { message: "Last name is required" }),
    email: z.string().trim().min(
        1,
        { message: "Email is required" }
    )
        .email({
            message: "Email should be like name@domain.com",
        })
});

const BLOCKED_EMAILS = ['john@doe.me'];

export const formSchemaAsyncExample = z.object({
    email: z.string().trim().min(
        1,
        { message: "Email is required" }
    )
        .email({
            message: "Email should be like name@domain.com",
        })
        .refine(async (email) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return !BLOCKED_EMAILS.includes(email);
          }, { message: 'This email is already registered' })
});