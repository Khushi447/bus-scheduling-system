import { CrewAssignment } from "../models/crewAssignment.model.js";
import { Duty } from "../models/duty.model.js";
import { Schedule } from "../models/schedule.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateAssignment = (query) => {
	return query
		.populate({
			path: "schedule",
			populate: {
				path: "route",
				select: "name code origin destination",
			},
		})
		.populate("duty")
		.populate("crewMember", "name email phone role depot")
		.populate("assignedBy", "name email role");
};

const assignCrewMember = asyncHandler(async (req, res) => {
	const { schedule, duty, crewMember, role, notes } = req.body;
	if (!schedule && !duty) {
		throw new ApiError(400, "Schedule or duty is required");
	}
	const [scheduleDocument, dutyDocument, crewMemberDocument] = await Promise.all([
		schedule ? Schedule.findById(schedule) : null,
		duty ? Duty.findById(duty) : null,
		User.findById(crewMember),
	]);

	if (schedule && !scheduleDocument) {
		throw new ApiError(404, "Schedule not found");
	}
	if (duty && !dutyDocument) throw new ApiError(404, "Duty not found");

	if (scheduleDocument?.status === "Cancelled") {
		throw new ApiError(400, "Cannot assign crew to a cancelled schedule");
	}
	if (dutyDocument && !["Approved", "Assigned"].includes(dutyDocument.status)) {
		throw new ApiError(400, "Approve the duty before assigning crew");
	}

	if (!crewMemberDocument) {
		throw new ApiError(404, "Crew member not found");
	}

	if (crewMemberDocument.role !== role) {
		throw new ApiError(400, "Assignment role does not match the crew member role");
	}

	const assignment = await CrewAssignment.create({
		schedule,
		duty,
		crewMember,
		role,
		notes,
		assignedBy: req.user._id,
	});

	if (dutyDocument) {
		dutyDocument.assignedCrew = crewMember;
		dutyDocument.status = "Assigned";
		await dutyDocument.save();
	}

	const createdAssignment = await populateAssignment(
		CrewAssignment.findById(assignment._id),
	);

	res.status(201).json({
		success: true,
		message: "Crew member assigned successfully",
		data: createdAssignment,
	});
});

const getAssignments = asyncHandler(async (req, res) => {
	const { schedule, crewMember, status } = req.query;
	const filter = {};

	if (schedule) filter.schedule = schedule;
	if (crewMember) filter.crewMember = crewMember;
	if (status) filter.status = status;

	const assignments = await populateAssignment(
		CrewAssignment.find(filter).sort({ createdAt: -1 }),
	);

	res.status(200).json({
		success: true,
		message: "Crew assignments fetched successfully",
		data: assignments,
	});
});

const getAssignmentById = asyncHandler(async (req, res) => {
	const assignment = await populateAssignment(
		CrewAssignment.findById(req.params.id),
	);

	if (!assignment) {
		throw new ApiError(404, "Crew assignment not found");
	}

	res.status(200).json({
		success: true,
		message: "Crew assignment fetched successfully",
		data: assignment,
	});
});

const updateAssignment = asyncHandler(async (req, res) => {
	const updates = {};

	if (req.body.status !== undefined) updates.status = req.body.status;
	if (req.body.notes !== undefined) updates.notes = req.body.notes;

	const assignment = await populateAssignment(
		CrewAssignment.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true,
		}),
	);

	if (!assignment) {
		throw new ApiError(404, "Crew assignment not found");
	}

	res.status(200).json({
		success: true,
		message: "Crew assignment updated successfully",
		data: assignment,
	});
});

const removeAssignment = asyncHandler(async (req, res) => {
	const assignment = await CrewAssignment.findByIdAndDelete(req.params.id);

	if (!assignment) {
		throw new ApiError(404, "Crew assignment not found");
	}

	res.status(200).json({
		success: true,
		message: "Crew assignment removed successfully",
		data: null,
	});
});

export {
	assignCrewMember,
	getAssignments,
	getAssignmentById,
	updateAssignment,
	removeAssignment,
};
