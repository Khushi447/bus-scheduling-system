import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true, maxlength: 100 },
		email: { type: String, required: true, trim: true, lowercase: true },
		message: { type: String, required: true, trim: true, maxlength: 2000 },
		status: { type: String, enum: ["New", "In Progress", "Resolved"], default: "New" },
	},
	{ timestamps: true },
);

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
