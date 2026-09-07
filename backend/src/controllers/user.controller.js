import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadImage } from "../utils/cloudinary.js";

const accessTokenCookieName = "accessToken";

const getJwtSecret = () => {
	if (!process.env.JWT_SECRET) {
		throw new ApiError(500, "JWT_SECRET is not configured");
	}

	return process.env.JWT_SECRET;
};

const createAccessToken = (userId) => {
	return jwt.sign({ _id: userId }, getJwtSecret(), {
		expiresIn: process.env.JWT_ACCESS_EXPIRY || "1d",
	});
};

const getCookieOptions = () => ({
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	maxAge: 24 * 60 * 60 * 1000,
});

const sanitizeUser = (user) => {
	const userData = user.toObject ? user.toObject() : { ...user };
	delete userData.password;
	return userData;
};

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, phone, password, depot } = req.body;

	const existingUser = await User.findOne({ email: email?.toLowerCase() });

	if (existingUser) {
		throw new ApiError(409, "An account with this email already exists");
	}

	const user = await User.create({
		name,
		email,
		phone,
		password,
		role: "Driver",
		depot,
	});

	const accessToken = createAccessToken(user._id.toString());

	res
		.status(201)
		.cookie(accessTokenCookieName, accessToken, getCookieOptions())
		.json({
			success: true,
			message: "Account created successfully",
			data: {
				user: sanitizeUser(user),
				accessToken,
			},
		});
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email?.toLowerCase() }).select(
		"+password",
	);

	if (!user || !(await user.isPasswordCorrect(password))) {
		throw new ApiError(401, "Invalid email or password");
	}

	const accessToken = createAccessToken(user._id.toString());

	res
		.status(200)
		.cookie(accessTokenCookieName, accessToken, getCookieOptions())
		.json({
			success: true,
			message: "Logged in successfully",
			data: {
				user: sanitizeUser(user),
				accessToken,
			},
		});
});

const logoutUser = asyncHandler(async (req, res) => {
	res
		.clearCookie(accessTokenCookieName, getCookieOptions())
		.status(200)
		.json({
			success: true,
			message: "Logged out successfully",
			data: null,
		});
});

const getCurrentUser = asyncHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		message: "Current user fetched successfully",
		data: req.user,
	});
});

const getCrewMembers = asyncHandler(async (req, res) => {
	const filter = { role: { $in: ["Driver", "Conductor"] } };

	if (req.query.role && ["Driver", "Conductor"].includes(req.query.role)) {
		filter.role = req.query.role;
	}

	const users = await User.find(filter)
		.select("name email phone role depot")
		.sort({ name: 1 });

	res.status(200).json({
		success: true,
		message: "Crew members fetched successfully",
		data: users,
	});
});

const uploadProfileImage = asyncHandler(async (req, res) => {
	if (!req.file) throw new ApiError(400, "Profile image is required");

	let result;
	try {
		result = await uploadImage(req.file.buffer);
	} catch (error) {
		console.error("Cloudinary upload failed:", error);
		throw new ApiError(502, `Cloudinary upload failed: ${error.message}`);
	}
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{ profileImage: result.secure_url },
		{ new: true, runValidators: true },
	);

	res.status(200).json({
		success: true,
		message: "Profile image uploaded successfully",
		data: sanitizeUser(user),
	});
});

const getUsersForAdmin = asyncHandler(async (req, res) => {
	const users = await User.find().select("name email phone role depot profileImage createdAt").sort({ name: 1 });
	res.status(200).json({ success: true, message: "Users fetched successfully", data: users });
});

const updateUserRole = asyncHandler(async (req, res) => {
	const { role } = req.body;
	if (!["Driver", "Conductor", "Scheduler", "Admin"].includes(role)) {
		throw new ApiError(400, "Invalid user role");
	}
	if (req.params.id === req.user._id.toString() && role !== "Admin") {
		throw new ApiError(400, "You cannot remove your own Admin role");
	}

	const user = await User.findByIdAndUpdate(
		req.params.id,
		{ role },
		{ new: true, runValidators: true },
	);
	if (!user) throw new ApiError(404, "User not found");

	res.status(200).json({ success: true, message: "User role updated successfully", data: sanitizeUser(user) });
});

const updateProfile = asyncHandler(async (req, res) => {
	const { name, phone, depot } = req.body;
	const user = await User.findById(req.user._id);

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	if (name !== undefined) user.name = name;
	if (phone !== undefined) user.phone = phone;
	if (depot !== undefined) user.depot = depot;

	await user.save();

	res.status(200).json({
		success: true,
		message: "Profile updated successfully",
		data: sanitizeUser(user),
	});
});

const updatePreferences = asyncHandler(async (req, res) => {
	const { theme, language, emailAlerts, smsAlerts } = req.body;
	const user = await User.findById(req.user._id);

	if (!user) throw new ApiError(404, "User not found");
	if (theme !== undefined && !["light", "dark"].includes(theme)) {
		throw new ApiError(400, "Invalid theme");
	}
	if (language !== undefined && !["en", "hi"].includes(language)) {
		throw new ApiError(400, "Invalid language");
	}
	if (theme !== undefined) user.preferences.theme = theme;
	if (language !== undefined) user.preferences.language = language;
	if (emailAlerts !== undefined) user.preferences.emailAlerts = Boolean(emailAlerts);
	if (smsAlerts !== undefined) user.preferences.smsAlerts = Boolean(smsAlerts);

	await user.save();
	res.status(200).json({ success: true, message: "Preferences updated successfully", data: sanitizeUser(user) });
});

const changePassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword } = req.body;
	if (!currentPassword || !newPassword) throw new ApiError(400, "Current and new passwords are required");
	if (newPassword.length < 8) throw new ApiError(400, "New password must be at least 8 characters");

	const user = await User.findById(req.user._id).select("+password");
	if (!(await user.isPasswordCorrect(currentPassword))) {
		throw new ApiError(401, "Current password is incorrect");
	}
	user.password = newPassword;
	await user.save();

	res.status(200).json({ success: true, message: "Password changed successfully", data: null });
});

export {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	getCrewMembers,
	uploadProfileImage,
	getUsersForAdmin,
	updateUserRole,
	updateProfile,
	updatePreferences,
	changePassword,
};
