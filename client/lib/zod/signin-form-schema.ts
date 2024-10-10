import { z } from "zod"

export const signInFormSchema = z.object({
	userName: z.string({ required_error: "username is requred" }),
	password: z.string({ required_error: "password is requred" }),
})
