import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const { addMinutes, isBefore } = require('date-fns');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const database = require('../util/db-connect');
const { createNodemailerTransporter } = require('../util/nodemailer-transporter');

const changeEmail: RequestHandler = async (req, res, next) => {};

const changeName: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, newName: reqNewName } = req.body;
	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	let validateNewName = false;

	// CHECKS IF THE NAME IS VALID
	if (
		reqNewName.trim().length >= 2 &&
		reqNewName.trim().match(/^['’\p{L}\p{M}]*-?['’\p{L}\p{M}]*$/giu)
	) {
		validateNewName = true;
	}

	if (!validateNewName) {
		res.status(400).json({ error: 'Nouveau Nom Invalide !' });
		return;
	}

	// UPDATES THE NAME
	await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				name: reqNewName,
			},
		}
	);

	res.status(200).json({ success: 'Nom modifié !', name: reqNewName });
};

const changePassword: RequestHandler = async (req, res, next) => {
	const {
		id: reqIdStr,
		oldPassword: reqOldPassword,
		newPassword: reqNewPassword,
		newPasswordConfirmation: reqNewPasswordConfirmation,
	} = req.body;

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	let validInputs = {
		oldPassword: false,
		newPassword: {
			differentThanOld: false,
			format: false,
		},
		newPasswordConfirmation: false,
	};

	// CHECKS IF THE PASSWORD MATCHES THE USER'S HASHED PASSWORD
	validInputs.oldPassword = await bcrypt.compare(reqOldPassword, user.password);

	if (!validInputs.oldPassword) {
		res.status(400).json({
			error: 'Veuillez corriger les erreurs.',
			validInputs: validInputs.oldPassword,
		});
	}

	// COMPARES THE NEW PASSWORD TO THE OLD ONE
	const newPasswordIsSameAsOld = await bcrypt.compare(reqNewPassword, user.password);
	validInputs.newPassword.differentThanOld = !newPasswordIsSameAsOld;

	// CHECKS IF THE PASSWORD IS IN THE CORRECT FORMAT
	validInputs.newPassword.format = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	// CHECKS IF THE NEW PASSWORDS ARE IDENTICAL
	validInputs.newPasswordConfirmation = reqNewPassword === reqNewPasswordConfirmation;

	if (
		!validInputs.oldPassword ||
		!validInputs.newPassword.differentThanOld ||
		!validInputs.newPassword.format ||
		!validInputs.newPasswordConfirmation
	) {
		res.status(400).json({
			error: 'Veuillez corriger les erreurs.',
			validInputs,
		});
		return;
	}

	// CREATES A NEW HASHED PASSWORD
	const hashedNewPassword = await bcrypt.hash(reqNewPassword, 10);

	// UPDATES THE USER'S PASSWORD
	await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				password: hashedNewPassword,
				'forgotPassword.code': null,
			},
		}
	);

	res.status(200).json({ success: 'Mot de passe modifié.' });
};

const sendEmailForgotPassword: RequestHandler = async (req, res, next) => {
	const reqEmail = req.params.email;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({
			error: 'Cette adresse mail introuvable, veuillez créer un compte.',
		});
		return;
	}

	// CHECKS IF THE USER CONFIRMED HIS ACCOUNT
	if (!user.confirmation.confirmed) {
		res.status(403).json({
			error: "Cette adresse mail n'est pas confirmée. Envoi de mail impossible.",
		});
		return;
	}

	// CHECKS IF THE LAST EMAIL WAS SENT IN THE LAST 5 MINUTES
	if (
		user.forgotPassword.nextEmail &&
		!isBefore(user.forgotPassword.nextEmail, new Date())
	) {
		res.status(403).json({
			error: 'Veuillez attendre 5 minutes entre chaque envoi de mail.',
		});
		return;
	}

	// GENERATES AN UNIQUE CODE
	const generatedForgotPasswordCode = crypto.randomBytes(20).toString('hex');

	const nextEmail = addMinutes(new Date(), 5);

	// ADDS THE NEW TIME INTERVAL IN THE DB
	await databaseConnect.updateOne(
		{ email: reqEmail },
		{
			$set: {
				forgotPassword: {
					code: generatedForgotPasswordCode,
					nextEmail: nextEmail,
				},
			},
		}
	);

	const transporter = createNodemailerTransporter();

	// SEND THE NEW ACCOUNT CONFIRMATION EMAIL
	try {
		const info = await transporter.sendMail({
			from: '"Six App" <contact@michel-lamarliere.com>',
			to: 'lamarliere.michel@icloud.com',
			subject: 'Modification de votre mot de passe',
			text: 'Pour modifier votre mot de passe, cliquez sur ce lien.',
			html: `<div><b>Mot de passe oublié?</b><a href="http://localhost:3000/modify/password/${encodeURI(
				reqEmail
			)}/${encodeURI(generatedForgotPasswordCode)}">Cliquez ici !</a></div>`,
		});

		console.log('Message sent: %s', info.messageId);
	} catch (error) {
		console.log(error);
	}

	res.status(200).json({
		success: 'Email envoyé, veuillez consulter votre boite de réception.',
	});
};

const checkForgotPasswordAuth: RequestHandler = async (req, res, next) => {
	const reqEmail = req.params.email;
	const reqUniqueId = req.params.uniqueId;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS AND
	// IF THE UNIQUE ID MATCHES THE USER'S ONE FROM THE DB
	const user = await databaseConnect.findOne({
		email: reqEmail,
		'forgotPassword.code': reqUniqueId,
	});

	if (!user) {
		res.status(403).json({ error: 'Non autorisé' });
		return;
	}

	res.status(200).json({ success: 'Autorisé !', id: user._id });
};

exports.changeName = changeName;
exports.changeEmail = changeEmail;
exports.changePassword = changePassword;
exports.sendEmailForgotPassword = sendEmailForgotPassword;
exports.checkForgotPasswordAuth = checkForgotPasswordAuth;
