const { sendEmail } = require('./send-email');

const sendEmailConfirmationEmail = (data: { to: string; uniqueCode: string }) => {
	const { to, uniqueCode } = data;
	console.log('here');

	const emailWasSent = sendEmail({
		to: to,
		subject: "Confirmation de l'adresse mail. ",
		text: 'Veuillez confirmer votre adresse mail en cliquant sur ce lien.',
		html: `<div><b>Bien ou quoi?</b><a href="${
			process.env.FRONT_END_URL
		}/profil/confirmation/${encodeURI(to)}/${encodeURI(
			uniqueCode
		)}"> Cliquez ici pour confirmer votre adresse mail.</a></div>`,
	});

	return emailWasSent;
};

exports.sendEmailConfirmationEmail = sendEmailConfirmationEmail;
