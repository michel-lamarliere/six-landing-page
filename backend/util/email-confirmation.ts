const { createNodemailerTransporter } = require('./nodemailer-transporter');

export const emailConfirmationEmail = async (email: string, code: string) => {
	const transporter = createNodemailerTransporter();

	await transporter.sendMail({
		from: '"Six App" <contact@michel-lamarliere.com>',
		to: 'lamarliere.michel@icloud.com',
		subject: "Confirmation de l'adresse mail. ",
		text: 'Veuillez confirmer votre adresse mail en cliquant sur ce lien.',
		html: `<div><b>Bien ou quoi?</b><a href="http://localhost:3000/profil/confirmation/${encodeURI(
			email
		)}/${encodeURI(code)}"> Cliquez ici pour confirmer votre adresse mail.</a></div>`,
	});
};
