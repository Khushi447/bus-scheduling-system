import { ApiError } from "../utils/ApiError.js";

const validate = (rules, source = "body") => {
	return (req, res, next) => {
		const data = req[source] || {};
		const validationErrors = [];

		for (const [field, fieldRules] of Object.entries(rules)) {
			const rulesToApply = Array.isArray(fieldRules) ? fieldRules : [fieldRules];

			for (const rule of rulesToApply) {
				const result = rule(data[field], data, req);

				if (result === true || result === undefined || result === null) {
					continue;
				}

				validationErrors.push({
					field,
					message: typeof result === "string" ? result : `Invalid ${field}`,
				});
				break;
			}
		}

		if (validationErrors.length > 0) {
			next(new ApiError(400, "Validation failed", validationErrors));
			return;
		}

		next();
	};
};

export { validate, validate as validateRequest };
