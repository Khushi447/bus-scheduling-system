import multer from "multer";

const uploadProfileImage = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, callback) => {
		if (file.mimetype.startsWith("image/")) {
			callback(null, true);
			return;
		}

		callback(new Error("Only image files are allowed"));
	},
}).single("profileImage");

export { uploadProfileImage };
