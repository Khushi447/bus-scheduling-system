import express from "express";

import { createContactMessage, getContactMessages } from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();
const requiredText = (field, maxLength) => (value) =>
	typeof value === "string" && value.trim().length > 0 && value.length <= maxLength
		? true
		: `${field} is required and must be at most ${maxLength} characters`;
const emailRule = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "") ? true : "A valid email is required";

router.post(
	"/",
	validate({
		name: requiredText("Name", 100),
		email: [requiredText("Email", 254), emailRule],
		message: requiredText("Message", 2000),
	}),
	createContactMessage,
);
router.get("/", verifyJWT, authorizeRoles("Admin"), getContactMessages);

export default router;
