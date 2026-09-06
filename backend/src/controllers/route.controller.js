import { Route } from "../models/route.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const routeFields = [
	"name",
	"code",
	"origin",
	"destination",
	"stops",
	"distanceKm",
	"estimatedDurationMinutes",
	"isActive",
];

const escapeRegex = (value) => {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const populateRoute = (query) => {
	return query.populate("createdBy", "name email role");
};

const createRoute = asyncHandler(async (req, res) => {
	const {
		name,
		code,
		origin,
		destination,
		stops,
		distanceKm,
		estimatedDurationMinutes,
	} = req.body;

	const route = await Route.create({
		name,
		code,
		origin,
		destination,
		stops,
		distanceKm,
		estimatedDurationMinutes,
		createdBy: req.user._id,
	});

	const createdRoute = await populateRoute(Route.findById(route._id));

	res.status(201).json({
		success: true,
		message: "Route created successfully",
		data: createdRoute,
	});
});

const getRoutes = asyncHandler(async (req, res) => {
	const { search, isActive } = req.query;
	const filter = {};

	if (isActive !== undefined) {
		filter.isActive = isActive === "true";
	}

	if (search?.trim()) {
		const searchPattern = new RegExp(escapeRegex(search.trim()), "i");
		filter.$or = [
			{ name: searchPattern },
			{ code: searchPattern },
			{ origin: searchPattern },
			{ destination: searchPattern },
		];
	}

	const routes = await populateRoute(Route.find(filter).sort({ name: 1 }));

	res.status(200).json({
		success: true,
		message: "Routes fetched successfully",
		data: routes,
	});
});

const getRouteById = asyncHandler(async (req, res) => {
	const route = await populateRoute(Route.findById(req.params.id));

	if (!route) {
		throw new ApiError(404, "Route not found");
	}

	res.status(200).json({
		success: true,
		message: "Route fetched successfully",
		data: route,
	});
});

const updateRoute = asyncHandler(async (req, res) => {
	const updates = {};

	for (const field of routeFields) {
		if (req.body[field] !== undefined) {
			updates[field] = req.body[field];
		}
	}

	const route = await populateRoute(
		Route.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}),
	);

	if (!route) {
		throw new ApiError(404, "Route not found");
	}

	res.status(200).json({
		success: true,
		message: "Route updated successfully",
		data: route,
	});
});

const deleteRoute = asyncHandler(async (req, res) => {
	const route = await Route.findByIdAndUpdate(
		req.params.id,
		{ isActive: false },
		{ new: true, runValidators: true },
	);

	if (!route) {
		throw new ApiError(404, "Route not found");
	}

	res.status(200).json({
		success: true,
		message: "Route deactivated successfully",
		data: route,
	});
});

export {
	createRoute,
	getRoutes,
	getRouteById,
	updateRoute,
	deleteRoute,
};
