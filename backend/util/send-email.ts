import { createNodemailerTransporter } from './create-nodemailer-transporter';

const sendEmail = async (data: any) => {
	const { to, subject, text, html } = data;

	const transporter = createNodemailerTransporter();

	// REMOVE WHEN DEPLOYING
	let toTemp = 'lamarliere.michel@icloud.com';

	let emailWasSent = false;

	emailWasSent = await transporter.sendMail({
		// REPLACE BY TO WHEN DEPLOYING
		to: toTemp,
		from: '"Six App" <contact@michel-lamarliere.com>',
		subject: subject,
		text: text,
		html: html,
	});

	return emailWasSent;
};

module.exports = sendEmail;
