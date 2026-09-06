import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const verifyJWT = async (req, res, next) => {
	try {
		const authorizationHeader = req.header("Authorization");
		const bearerToken = authorizationHeader?.startsWith("Bearer ")
			? authorizationHeader.slice(7)
			: null;
		const token = req.cookies?.accessToken || bearerToken;

		if (!token) {
			throw new ApiError(401, "Authentication required");
		}

		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const userId = decodedToken._id || decodedToken.id;

		if (!userId) {
			throw new ApiError(401, "Invalid access token");
		}

		const user = await User.findById(userId).select("-password");

		if (!user) {
			throw new ApiError(401, "User not found");
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof ApiError) {
			next(error);
			return;
		}

		next(new ApiError(401, "Invalid or expired access token"));
	}
};

export { verifyJWT };
