import { ApiError } from "../utils/ApiError.js";

const errorHandler = (error, req, res, next) => {
	console.error("Request failed:", error);
	let statusCode = error instanceof ApiError ? error.statusCode : 500;
	let message = error instanceof ApiError ? error.message : "Internal server error";
	let errors = error instanceof ApiError ? error.errors : [];

	if (error?.name === "ValidationError") {
		statusCode = 400;
		message = "Validation failed";
		errors = Object.values(error.errors).map((validationError) => ({
			field: validationError.path,
			message: validationError.message,
		}));
	}

	if (error?.name === "CastError") {
		statusCode = 400;
		message = "Invalid value provided";
	}

	if (error?.code === 11000) {
		statusCode = 409;
		message = "A record with that value already exists";
		errors = Object.keys(error.keyPattern || error.keyValue || {}).map((field) => ({
			field,
			message: `${field} must be unique`,
		}));
	}

	if (error?.name === "MulterError") {
		statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
		message = error.code === "LIMIT_FILE_SIZE"
			? "Profile image must be 5 MB or smaller"
			: error.message;
	}

	if (error?.http_code && error?.name === "Error") {
		statusCode = 502;
		message = `Cloudinary upload failed: ${error.message}`;
	}

	const response = {
		success: false,
		message,
		errors,
		data: null,
	};

	if (process.env.NODE_ENV === "development") {
		response.stack = error.stack;
	}

	res.status(statusCode).json(response);
};

export { errorHandler };
