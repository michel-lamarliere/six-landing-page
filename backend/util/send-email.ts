import { createNodemailerTransporter } from './nodemailer-transporter';

const sendEmail = async (data: any): Promise<any> => {
	const { to, subject, text, html } = data;

	const transporter = createNodemailerTransporter();

	// REMOVE WHEN DEPLOYING
	let toTemp = 'lamarliere.michel@icloud.com';

	await transporter.sendMail({
		// REPLACE BY TO WHEN DEPLOYING
		to: toTemp,
		from: '"Six App" <contact@michel-lamarliere.com>',
		subject: subject,
		text: text,
		html: html,
	});
};

exports.default = sendEmail;
