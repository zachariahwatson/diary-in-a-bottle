import { z } from "zod"

export const signUpFormSchema = z
	.object({
		userName: z.string(),
		password: z
			.string({ required_error: "password is required" })
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
				"password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character."
			),
		confirmPassword: z.string({ required_error: "comfirm password is required" }),
		acceptTerms: z
			.boolean({ required_error: "you must accept the terms and conditions." })
			.refine((val) => val === true, {
				message: "you must accept the terms and conditions.",
			}),
		acceptCredentialsSaved: z
			.boolean({ required_error: "you must acknowledge that you've stored your credentials in a safe place." })
			.refine((val) => val === true, {
				message: "you must acknowledge that you've stored your credentials in a safe place.",
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "passwords don't match",
		path: ["confirmPassword"],
	})
