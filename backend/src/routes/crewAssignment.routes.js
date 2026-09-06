import express from "express";

import {
	assignCrewMember,
	getAssignmentById,
	getAssignments,
	removeAssignment,
	updateAssignment,
} from "../controllers/crewAssigment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

const objectIdRule = (field) => (value) => {
	return /^[a-f\d]{24}$/i.test(value || "")
		? true
		: `${field} must be a valid ID`;
};

const roleRule = (value) => {
	return ["Driver", "Conductor", "Scheduler"].includes(value)
		? true
		: "Role must be Driver, Conductor, or Scheduler";
};

const statusRule = (value) => {
	return ["Assigned", "Accepted", "Declined", "Completed"].includes(value)
		? true
		: "Invalid assignment status";
};

const notesRule = (value) => {
	return typeof value === "string" && value.length <= 500
		? true
		: "Notes cannot exceed 500 characters";
};

const createAssignmentRules = {
	schedule: objectIdRule("Schedule"),
	crewMember: objectIdRule("Crew member"),
	role: roleRule,
	notes: (value, body) =>
		body.notes === undefined ? true : notesRule(value),
};

const updateAssignmentRules = {
	status: (value, body) =>
		body.status === undefined ? true : statusRule(value),
	notes: (value, body) =>
		body.notes === undefined ? true : notesRule(value),
};

const schedulerOnly = [verifyJWT, authorizeRoles("Scheduler")];

router.get("/", ...schedulerOnly, getAssignments);
router.get("/:id", ...schedulerOnly, getAssignmentById);

router.post(
	"/",
	...schedulerOnly,
	validate(createAssignmentRules),
	assignCrewMember,
);

router.patch(
	"/:id",
	...schedulerOnly,
	validate(updateAssignmentRules),
	updateAssignment,
);

router.delete("/:id", ...schedulerOnly, removeAssignment);

export default router;
