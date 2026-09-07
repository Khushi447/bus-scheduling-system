import { ContactMessage } from "../models/contactMessage.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createContactMessage = asyncHandler(async (req, res) => {
	const message = await ContactMessage.create(req.body);
	res.status(201).json({
		success: true,
		message: "Message sent successfully",
		data: { id: message._id },
	});
});

const getContactMessages = asyncHandler(async (req, res) => {
	const messages = await ContactMessage.find().sort({ createdAt: -1 });
	res.status(200).json({
		success: true,
		message: "Contact messages fetched successfully",
		data: messages,
	});
});

export { createContactMessage, getContactMessages };
