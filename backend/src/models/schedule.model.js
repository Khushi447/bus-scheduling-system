import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
	{
		route: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Route",
			required: true,
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
		startTime: {
			type: String,
			required: true,
			trim: true,
		},
		endTime: {
			type: String,
			required: true,
			trim: true,
		},
		busNumber: {
			type: String,
			trim: true,
			default: "",
		},
		status: {
			type: String,
			enum: ["Draft", "Published", "Completed", "Cancelled"],
			default: "Draft",
		},
		notes: {
			type: String,
			trim: true,
			maxlength: 500,
			default: "",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

scheduleSchema.index({ route: 1, serviceDate: 1, shift: 1 }, { unique: true });

export const Schedule = mongoose.model("Schedule", scheduleSchema);
