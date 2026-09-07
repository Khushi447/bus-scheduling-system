import mongoose from "mongoose";

const dutySchema = new mongoose.Schema(
	{
		dutyId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			uppercase: true,
		},
		serviceDate: {
			type: Date,
			required: true,
		},
		shift: {
			type: String,
			enum: ["Morning", "Afternoon", "Evening", "Night"],
			required: true,
		},
		startTime: { type: String, required: true, trim: true },
		endTime: { type: String, required: true, trim: true },
		depot: { type: String, required: true, trim: true },
		vehicle: { type: String, required: true, trim: true },
		status: {
			type: String,
			enum: ["Unassigned", "Requested", "Approved", "Assigned", "Rejected"],
			default: "Unassigned",
		},
		requestedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		assignedCrew: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true },
);

dutySchema.index({ serviceDate: 1, shift: 1, depot: 1 });

export const Duty = mongoose.model("Duty", dutySchema);
