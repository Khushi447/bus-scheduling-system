import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 100,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		phone: {
			type: String,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 8,
			select: false,
		},
		role: {
			type: String,
			enum: ["Driver", "Conductor", "Scheduler"],
			default: "Driver",
			required: true,
		},
		depot: {
			type: String,
			trim: true,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function savePassword() {
	if (!this.isModified("password")) {
		return;
	}

	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.isPasswordCorrect = function isPasswordCorrect(password) {
	return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
