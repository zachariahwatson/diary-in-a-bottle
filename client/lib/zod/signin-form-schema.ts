import { z } from "zod"

export const signInFormSchema = z.object({
	userName: z.string({ required_error: "username is requred" }).min(1, "username must not be empty"),
	password: z.string({ required_error: "password is requred" }).min(1, "password must not be empty"),
})
