import { AuthApiError } from "@/lib/types"
import { toast } from "sonner"

export function handleAuthApiError(error: AuthApiError) {
	if (error.errors) {
		Object.entries(error.errors).map(([key, messages]) => {
			toast.error(`${key}: ${messages.join(",")}`, { description: error.status })
		})
	} else {
		toast.error(`${error.title}: ${error.detail}`, { description: `${error.status}` })
	}
}
