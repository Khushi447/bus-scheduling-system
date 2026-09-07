import { v2 as cloudinary } from "cloudinary";

const requiredCloudinaryConfig = [
	"CLOUDINARY_CLOUD_NAME",
	"CLOUDINARY_API_KEY",
	"CLOUDINARY_API_SECRET",
];

const getCloudinary = () => {
	for (const key of requiredCloudinaryConfig) {
		if (!process.env[key]) throw new Error(`${key} is not configured`);
	}

	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	return cloudinary;
};

const uploadImage = (fileBuffer) => {
	return new Promise((resolve, reject) => {
		getCloudinary().uploader.upload_stream(
			{ folder: "bus-scheduler/profiles", resource_type: "image" },
			(error, result) => (error ? reject(error) : resolve(result)),
		).end(fileBuffer);
	});
};

export { uploadImage };
