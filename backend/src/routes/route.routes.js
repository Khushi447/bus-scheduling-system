import express from "express";

import {
	createRoute,
	deleteRoute,
	getRouteById,
	getRoutes,
	updateRoute,
} from "../controllers/route.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

const requiredText = (field) => (value) => {
	return typeof value === "string" && value.trim().length > 0
		? true
		: `${field} is required`;
};

const codeRule = (value) => {
	return /^[A-Za-z0-9-]+$/.test(value || "")
		? true
		: "Code may contain only letters, numbers, and hyphens";
};

const stopsRule = (value) => {
	return Array.isArray(value) &&
		value.every(
			(stop) =>
				typeof stop?.name === "string" &&
				stop.name.trim().length > 0 &&
				Number.isInteger(stop.sequence) &&
				stop.sequence > 0 &&
				(stop.latitude === undefined || (typeof stop.latitude === "number" && stop.latitude >= -90 && stop.latitude <= 90)) &&
				(stop.longitude === undefined || (typeof stop.longitude === "number" && stop.longitude >= -180 && stop.longitude <= 180)),
		)
		? true
		: "Stops must contain names and positive integer sequences";
};

const nonNegativeNumber = (field) => (value) => {
	return typeof value === "number" && value >= 0
		? true
		: `${field} must be a non-negative number`;
};

const durationRule = (value) => {
	return typeof value === "number" && value >= 1
		? true
		: "Estimated duration must be at least 1 minute";
};

const createRouteRules = {
	name: requiredText("Name"),
	code: [requiredText("Code"), codeRule],
	origin: requiredText("Origin"),
	destination: requiredText("Destination"),
	stops: (value, body) => (body.stops === undefined ? true : stopsRule(value)),
	distanceKm: (value, body) =>
		body.distanceKm === undefined ? true : nonNegativeNumber("Distance")(value),
	estimatedDurationMinutes: (value, body) =>
		body.estimatedDurationMinutes === undefined
			? true
			: durationRule(value),
};

const updateRouteRules = {
	name: (value, body) =>
		body.name === undefined ? true : requiredText("Name")(value),
	code: (value, body) =>
		body.code === undefined ? true : codeRule(value),
	origin: (value, body) =>
		body.origin === undefined ? true : requiredText("Origin")(value),
	destination: (value, body) =>
		body.destination === undefined ? true : requiredText("Destination")(value),
	stops: (value, body) => (body.stops === undefined ? true : stopsRule(value)),
	distanceKm: (value, body) =>
		body.distanceKm === undefined ? true : nonNegativeNumber("Distance")(value),
	estimatedDurationMinutes: (value, body) =>
		body.estimatedDurationMinutes === undefined
			? true
			: durationRule(value),
	isActive: (value, body) =>
		body.isActive === undefined || typeof value === "boolean"
			? true
			: "isActive must be a boolean",
};

router.get("/", verifyJWT, getRoutes);
router.get("/:id", verifyJWT, getRouteById);

router.post(
	"/",
	verifyJWT,
	authorizeRoles("Scheduler"),
	validate(createRouteRules),
	createRoute,
);

router.patch(
	"/:id",
	verifyJWT,
	authorizeRoles("Scheduler"),
	validate(updateRouteRules),
	updateRoute,
);

router.delete(
	"/:id",
	verifyJWT,
	authorizeRoles("Scheduler"),
	deleteRoute,
);

export default router;
