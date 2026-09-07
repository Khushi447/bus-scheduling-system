import { Duty } from "../models/duty.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDuties = asyncHandler(async (req, res) => {
	const { date, shift, depot, search, assignedTo } = req.query;
	const filter = {};

	if (date) {
		const start = new Date(date);
		if (Number.isNaN(start.getTime())) throw new ApiError(400, "Invalid duty date");
		const end = new Date(start);
		end.setDate(end.getDate() + 1);
		filter.serviceDate = { $gte: start, $lt: end };
	}
	if (shift) filter.shift = shift;
	if (depot) filter.depot = depot;
	if (search?.trim()) {
		filter.$or = [
			{ dutyId: new RegExp(search.trim(), "i") },
			{ vehicle: new RegExp(search.trim(), "i") },
			{ depot: new RegExp(search.trim(), "i") },
		];
	}
	if (assignedTo === "me") filter.assignedCrew = req.user._id;

	const duties = await Duty.find(filter)
		.populate("requestedBy", "name email role")
		.populate("assignedCrew", "name email phone role depot")
		.sort({ serviceDate: 1, startTime: 1 });
	res.status(200).json({ success: true, message: "Duties fetched successfully", data: duties });
});

const createDuty = asyncHandler(async (req, res) => {
	const duty = await Duty.create(req.body);
	res.status(201).json({ success: true, message: "Duty created successfully", data: duty });
});

const requestDuty = asyncHandler(async (req, res) => {
	const duty = await Duty.findById(req.params.id);
	if (!duty) throw new ApiError(404, "Duty not found");
	if (duty.status !== "Unassigned") throw new ApiError(400, "This duty is no longer available");

	duty.status = "Requested";
	duty.requestedBy = req.user._id;
	await duty.save();

	res.status(200).json({ success: true, message: "Duty requested successfully", data: duty });
});

const updateDutyStatus = asyncHandler(async (req, res) => {
	const { status } = req.body;
	if (!["Approved", "Rejected"].includes(status)) {
		throw new ApiError(400, "Status must be Approved or Rejected");
	}

	const duty = await Duty.findById(req.params.id);
	if (!duty) throw new ApiError(404, "Duty not found");
	if (duty.status !== "Requested") {
		throw new ApiError(400, "Only requested duties can be approved or rejected");
	}

	duty.status = status;
	await duty.save();

	res.status(200).json({
		success: true,
		message: `Duty ${status.toLowerCase()} successfully`,
		data: duty,
	});
});

export { getDuties, createDuty, requestDuty, updateDutyStatus };
