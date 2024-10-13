/**
 * the error type that returns from the .NET Identity API endpoints
 * @example
 * {
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "PasswordRequiresNonAlphanumeric": [
      "Passwords must have at least one non alphanumeric character."
    ],
    "PasswordRequiresDigit": [
      "Passwords must have at least one digit ('0'-'9')."
    ],
    "PasswordRequiresUpper": [
      "Passwords must have at least one uppercase ('A'-'Z')."
    ]
  }
}
 */
export type AuthApiError = {
	name?: string
	message?: string
	type: string
	title: string
	status: number
	detail: string
	instance: string
	errors: {
		[key: string]: string[]
	}
}
