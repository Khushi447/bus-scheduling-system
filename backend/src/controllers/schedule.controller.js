import { Route } from "../models/route.model.js";
import { Schedule } from "../models/schedule.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const scheduleFields = [
	"route",
	"serviceDate",
	"shift",
	"startTime",
	"endTime",
	"busNumber",
	"status",
	"notes",
];

const populateSchedule = (query) => {
	return query
		.populate("route", "name code origin destination")
		.populate("createdBy", "name email role");
};

const ensureActiveRoute = async (routeId) => {
	const route = await Route.findById(routeId);

	if (!route) {
		throw new ApiError(404, "Route not found");
	}

	if (!route.isActive) {
		throw new ApiError(400, "Cannot schedule an inactive route");
	}
};

const getDateFilter = (dateValue, fieldName) => {
	if (!dateValue) return undefined;

	const date = new Date(dateValue);

	if (Number.isNaN(date.getTime())) {
		throw new ApiError(400, `Invalid ${fieldName} date`);
	}

	return date;
};

const createSchedule = asyncHandler(async (req, res) => {
	const {
		route,
		serviceDate,
		shift,
		startTime,
		endTime,
		busNumber,
		status,
		notes,
	} = req.body;

	await ensureActiveRoute(route);

	const schedule = await Schedule.create({
		route,
		serviceDate,
		shift,
		startTime,
		endTime,
		busNumber,
		status,
		notes,
		createdBy: req.user._id,
	});

	const createdSchedule = await populateSchedule(
		Schedule.findById(schedule._id),
	);

	res.status(201).json({
		success: true,
		message: "Schedule created successfully",
		data: createdSchedule,
	});
});

const getSchedules = asyncHandler(async (req, res) => {
	const { route, status, serviceDate, from, to } = req.query;
	const filter = {};
	const exactDate = getDateFilter(serviceDate, "service");
	const fromDate = getDateFilter(from, "from");
	const toDate = getDateFilter(to, "to");

	if (route) filter.route = route;
	if (status) filter.status = status;

	if (exactDate) {
		const nextDate = new Date(exactDate);
		nextDate.setDate(nextDate.getDate() + 1);
		filter.serviceDate = { $gte: exactDate, $lt: nextDate };
	} else if (fromDate || toDate) {
		filter.serviceDate = {};
		if (fromDate) filter.serviceDate.$gte = fromDate;
		if (toDate) filter.serviceDate.$lte = toDate;
	}

	const schedules = await populateSchedule(
		Schedule.find(filter).sort({ serviceDate: 1, startTime: 1 }),
	);

	res.status(200).json({
		success: true,
		message: "Schedules fetched successfully",
		data: schedules,
	});
});

const getScheduleById = asyncHandler(async (req, res) => {
	const schedule = await populateSchedule(Schedule.findById(req.params.id));

	if (!schedule) {
		throw new ApiError(404, "Schedule not found");
	}

	res.status(200).json({
		success: true,
		message: "Schedule fetched successfully",
		data: schedule,
	});
});

const updateSchedule = asyncHandler(async (req, res) => {
	const updates = {};

	for (const field of scheduleFields) {
		if (req.body[field] !== undefined) {
			updates[field] = req.body[field];
		}
	}

	if (updates.route) {
		await ensureActiveRoute(updates.route);
	}

	const schedule = await populateSchedule(
		Schedule.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}),
	);

	if (!schedule) {
		throw new ApiError(404, "Schedule not found");
	}

	res.status(200).json({
		success: true,
		message: "Schedule updated successfully",
		data: schedule,
	});
});

const deleteSchedule = asyncHandler(async (req, res) => {
	const schedule = await Schedule.findByIdAndDelete(req.params.id);

	if (!schedule) {
		throw new ApiError(404, "Schedule not found");
	}

	res.status(200).json({
		success: true,
		message: "Schedule deleted successfully",
		data: null,
	});
});

export {
	createSchedule,
	getSchedules,
	getScheduleById,
	updateSchedule,
	deleteSchedule,
};
