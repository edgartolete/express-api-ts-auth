import multer, { FileFilterCallback, Multer, MulterError } from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();

const fileFilterAudio = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (file.mimetype.split('/')[0] == 'audio') {
		cb(null, true);
	} else {
		cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
	}
};

const fileFilterPhoto = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (file.mimetype.split('/')[0] == 'image') {
		cb(null, true);
	} else {
		cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
	}
};

//** This Multer middleware allows to attach files to the req: Request that you can use on controller*/
export const uploadAudio = multer({
	storage,
	fileFilter: fileFilterAudio,
	limits: { fileSize: 1000000000, files: 1 }
});

export const uploadPhoto = multer({
	storage,
	fileFilter: fileFilterPhoto,
	limits: { fileSize: 1000000000, files: 1 }
});
