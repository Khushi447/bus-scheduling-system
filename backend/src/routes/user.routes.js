import express from "express";

import {
	getCurrentUser,
	getCrewMembers,
	loginUser,
	logoutUser,
	registerUser,
	updateProfile,
	uploadProfileImage,
	getUsersForAdmin,
	updateUserRole,
	updatePreferences,
	changePassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { uploadProfileImage as uploadProfileImageMiddleware } from "../middlewares/upload.middleware.js";

const router = express.Router();

const requiredText = (field) => (value) => {
	return typeof value === "string" && value.trim().length > 0
		? true
		: `${field} is required`;
};

const emailRule = (value) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
		? true
		: "A valid email is required";
};

const passwordRule = (value) => {
	return typeof value === "string" && value.length >= 8
		? true
		: "Password must be at least 8 characters";
};

const registerRules = {
	name: requiredText("Name"),
	email: [requiredText("Email"), emailRule],
	phone: requiredText("Phone"),
	password: passwordRule,
};

const loginRules = {
	email: [requiredText("Email"), emailRule],
	password: requiredText("Password"),
};

const profileRules = {
	name: (value, body) => {
		if (body.name === undefined) return true;
		return requiredText("Name")(value);
	},
	phone: (value, body) => {
		if (body.phone === undefined) return true;
		return requiredText("Phone")(value);
	},
};

router.post("/register", validate(registerRules), registerUser);
router.post("/login", validate(loginRules), loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/crew", verifyJWT, authorizeRoles("Scheduler"), getCrewMembers);
router.patch("/profile", verifyJWT, validate(profileRules), updateProfile);
router.patch("/preferences", verifyJWT, updatePreferences);
router.patch("/password", verifyJWT, changePassword);
router.post("/profile/image", verifyJWT, uploadProfileImageMiddleware, uploadProfileImage);
router.get("/admin/users", verifyJWT, authorizeRoles("Admin"), getUsersForAdmin);
router.patch("/admin/users/:id/role", verifyJWT, authorizeRoles("Admin"), updateUserRole);

export default router;
