import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		sequence: {
			type: Number,
			required: true,
			min: 1,
		},
		latitude: { type: Number, min: -90, max: 90 },
		longitude: { type: Number, min: -180, max: 180 },
	},
	{ _id: false },
);

const routeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
			maxlength: 20,
		},
		origin: {
			type: String,
			required: true,
			trim: true,
		},
		destination: {
			type: String,
			required: true,
			trim: true,
		},
		stops: {
			type: [stopSchema],
			default: [],
		},
		distanceKm: {
			type: Number,
			min: 0,
			default: 0,
		},
		estimatedDurationMinutes: {
			type: Number,
			min: 1,
			default: 30,
		},
		isActive: {
			type: Boolean,
			default: true,
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

routeSchema.index({ name: 1 });

export const Route = mongoose.model("Route", routeSchema);
