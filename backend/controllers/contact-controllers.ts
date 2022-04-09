import { RequestHandler } from 'express';

const database = require('../util/db-connect');
const sendEmail = require('../util/send-email');

const sendMessage: RequestHandler = async (req, res, next) => {
	const { name: reqName, email: reqEmail, message: reqMessage } = req.body;

	console.log(reqName, reqEmail, reqMessage);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({ fatal: true });
	}

	if (reqMessage.trim().length < 10) {
		res.status(404).json({ error: true, message: '10 caractères minimum.' });
		return;
	}

	const confirmationEmail = await sendEmail({
		to: reqEmail,
		subject: 'Prise de contact',
		text: `Merci ${reqName} pour votre message envoyé, nous ferons notre maximum afin de répondre à votre message rapidement.`,
	});

	const emailToUs = await sendEmail({
		to: process.env.CONTACT_EMAIL,
		subject: `Message via le site de ${reqName}: ${reqEmail}`,
		text: `${reqMessage}`,
	});

	if (!confirmationEmail || !emailToUs) {
		res.status(400).json({
			error: true,
			message: `Erreur lors de l'envoi des mails`,
		});
		return;
	}

	res.status(200).json({ success: true, message: 'Email envoyés.' });
};

exports.sendMessage = sendMessage;
