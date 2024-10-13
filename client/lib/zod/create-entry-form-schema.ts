import { z } from "zod"

export const createEntryFormSchema = z.object({
	content: z.string().min(1, "content must contain at least one character"),
})
