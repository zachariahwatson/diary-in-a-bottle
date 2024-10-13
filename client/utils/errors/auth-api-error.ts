import type { AuthApiError as AuthApiErrorType } from "@/lib/types"

export class AuthApiError extends Error {
	constructor(body: AuthApiErrorType) {
		// Call the parent constructor (Error) with the message
		super(body.title)

		Object.assign(this, body)

		this.name = "AuthApiError"

		// Maintains proper stack trace for where the error was thrown (only available in V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AuthApiError)
		}
	}
}
