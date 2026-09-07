import express from "express";

import { createDuty, getDuties, requestDuty, updateDutyStatus } from "../controllers/duty.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();
const required = (field) => (value) => value ? true : `${field} is required`;
const timeRule = (field) => (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || "") ? true : `${field} must use HH:mm format`;
const dateRule = (value) => !Number.isNaN(new Date(value).getTime()) ? true : "A valid service date is required";
const shiftRule = (value) => ["Morning", "Afternoon", "Evening", "Night"].includes(value) ? true : "Invalid shift";

const createDutyRules = {
	dutyId: required("Duty ID"),
	serviceDate: [required("Service date"), dateRule],
	shift: shiftRule,
	startTime: [required("Start time"), timeRule("Start time")],
	endTime: [required("End time"), timeRule("End time")],
	depot: required("Depot"),
	vehicle: required("Vehicle"),
};

router.get("/", verifyJWT, getDuties);
router.post("/", verifyJWT, authorizeRoles("Scheduler"), validate(createDutyRules), createDuty);
router.post("/:id/request", verifyJWT, authorizeRoles("Driver", "Conductor"), requestDuty);
router.patch("/:id/status", verifyJWT, authorizeRoles("Scheduler"), updateDutyStatus);

export default router;
