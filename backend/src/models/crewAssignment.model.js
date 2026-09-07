import mongoose from "mongoose";

const crewAssignmentSchema = new mongoose.Schema(
	{
		schedule: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Schedule",
			default: null,
		},
		duty: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Duty",
			default: null,
		},
		crewMember: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		role: {
			type: String,
			enum: ["Driver", "Conductor", "Scheduler"],
			required: true,
		},
		status: {
			type: String,
			enum: ["Assigned", "Accepted", "Declined", "Completed"],
			default: "Assigned",
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
			default: "",
		},
		assignedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

crewAssignmentSchema.index(
	{ schedule: 1, crewMember: 1, role: 1 },
	{ unique: true, sparse: true },
);

crewAssignmentSchema.index(
	{ duty: 1, crewMember: 1, role: 1 },
	{ unique: true, sparse: true },
);

export const CrewAssignment = mongoose.model(
	"CrewAssignment",
	crewAssignmentSchema,
);
