const { S3 } = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const uuid = require('uuid').v4;
import dotenv from 'dotenv';
dotenv.config();

type s3Upload = {
	dir: string;
	file: Express.Multer.File;
};

const s3UploadV2 = async ({ dir, file }: s3Upload) => {
	try {
		const s3 = new S3();
		const param = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: `${dir}/${uuid()}-${file.originalname}`,
			Body: file.buffer
		};
		return await s3.upload(param).promise();
	} catch (err) {
		console.error('s2UploadV2 Error: ', err);
		throw err;
	}
};

const s3DeleteV2 = async (key: string) => {
	try {
		const s3 = new S3();
		s3.config.update({ region: process.env.AWS_BUCKET_REGION });
		const param = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: key
		};
		return await s3.deleteObject(param).promise();
	} catch (err) {
		console.error('s3DeleteV2 Error:', err);
		throw err;
	}
};
module.exports = { s3UploadV2, s3DeleteV2 };
