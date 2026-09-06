import express from "express";

import {
	createSchedule,
	deleteSchedule,
	getScheduleById,
	getSchedules,
	updateSchedule,
} from "../controllers/schedule.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

const objectIdRule = (field) => (value) => {
	return /^[a-f\d]{24}$/i.test(value || "")
		? true
		: `${field} must be a valid ID`;
};

const dateRule = (value) => {
	return !Number.isNaN(new Date(value).getTime())
		? true
		: "A valid service date is required";
};

const timeRule = (field) => (value) => {
	return /^([01]\d|2[0-3]):[0-5]\d$/.test(value || "")
		? true
		: `${field} must use HH:mm format`;
};

const shiftRule = (value) => {
	return ["Morning", "Afternoon", "Evening", "Night"].includes(value)
		? true
		: "Shift must be Morning, Afternoon, Evening, or Night";
};

const required = (field) => (value) => {
	return value !== undefined && value !== null && value !== ""
		? true
		: `${field} is required`;
};

const createScheduleRules = {
	route: [required("Route"), objectIdRule("Route")],
	serviceDate: [required("Service date"), dateRule],
	shift: [required("Shift"), shiftRule],
	startTime: [required("Start time"), timeRule("Start time")],
	endTime: [required("End time"), timeRule("End time")],
};

const updateScheduleRules = {
	route: (value, body) =>
		body.route === undefined ? true : objectIdRule("Route")(value),
	serviceDate: (value, body) =>
		body.serviceDate === undefined ? true : dateRule(value),
	shift: (value, body) =>
		body.shift === undefined ? true : shiftRule(value),
	startTime: (value, body) =>
		body.startTime === undefined ? true : timeRule("Start time")(value),
	endTime: (value, body) =>
		body.endTime === undefined ? true : timeRule("End time")(value),
};

router.get("/", verifyJWT, getSchedules);
router.get("/:id", verifyJWT, getScheduleById);

router.post(
	"/",
	verifyJWT,
	authorizeRoles("Scheduler"),
	validate(createScheduleRules),
	createSchedule,
);

router.patch(
	"/:id",
	verifyJWT,
	authorizeRoles("Scheduler"),
	validate(updateScheduleRules),
	updateSchedule,
);

router.delete(
	"/:id",
	verifyJWT,
	authorizeRoles("Scheduler"),
	deleteSchedule,
);

export default router;
