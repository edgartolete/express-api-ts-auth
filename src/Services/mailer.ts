import nodemailer, { Transporter } from 'nodemailer';
import { Signs } from '../Utils/constants';

export const sendEmail = ({ to, subject, body }: EmailRequestPayload) => {
	var transporter: Transporter = nodemailer.createTransport({
		host: process.env.MAILER_HOST,
		port: parseInt(process.env.MAILER_HOST!),
		secure: true,
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_PASS
		}
	});
	var mailOptions = {
		from: process.env.MAILER_EMAIL,
		to: to,
		subject: subject,
		text: body
	};
	console.log('Sending email for verification code in progress...');
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`${Signs.okay} Email sent to: ' + info.response`);
		}
	});
};
