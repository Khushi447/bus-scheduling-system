import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
	const { name, email, phone, password, role, depot } = req.body;
	const normalizedRole = role
		? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
		: role;

	const existingUser = await User.findOne({ email: email?.toLowerCase() });

	if (existingUser) {
		throw new ApiError(409, "An account with this email already exists");
	}

	const user = await User.create({
		name,
		email,
		phone,
		password,
		role: normalizedRole,
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

export {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	updateProfile,
};
