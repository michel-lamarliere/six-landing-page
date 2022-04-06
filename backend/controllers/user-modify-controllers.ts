import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const { addMinutes, isBefore } = require('date-fns');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const database = require('../util/db-connect');
const { createNodemailerTransporter } = require('../util/nodemailer-transporter');

const changeImage: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, icon: reqIcon } = req.body;
	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const updated = await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				icon: parseInt(reqIcon),
			},
		}
	);

	res.status(200).json({ success: true, message: 'Icône modifié.' });
};

const changeEmail: RequestHandler = async (req, res, next) => {
	const { oldEmail: reqOldEmail, newEmail: reqNewEmail } = req.body;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqOldEmail });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const existingUserWithNewEmail = await databaseConnect.findOne({
		email: reqNewEmail,
	});

	if (existingUserWithNewEmail) {
		res.json({ used: true, error: 'Email adresse déjà utilisée.' });
	}

	const transporter = createNodemailerTransporter();

	const oldEmailWasSent = await transporter.sendMail({
		from: '"Six App" <contact@michel-lamarliere.com>',
		to: 'lamarliere.michel@icloud.com',
		subject: "Demande de changement d'adresse mail",
		// text: 'Cliquez',
		html: `<div>Une demande a été faite pour changer d'adresse mail. Un mail a également été envoyé sur la nouvelle ${reqNewEmail}. </div>`,
	});

	const newEmailWasSent = await transporter.sendMail({
		from: '"Six App" <contact@michel-lamarliere.com>',
		to: 'lamarliere.michel@icloud.com',
		subject: "Demande de changement d'adresse mail",
		// text: 'Cliquez',
		html: `<div>Une demande a été faite pour changer d'adresse mail. Un mail a également été envoyé sur l'ancienne ${reqOldEmail}. Cliquez <a href=${process.env.FRONT_END_URL}/modifier-email/confirmation/${reqOldEmail}/${reqNewEmail} >ici</a> pour confirmer le changement. </div>`,
	});

	if (!oldEmailWasSent || !newEmailWasSent) {
		res.status(400).json({
			error: "Une erreur est survenue lors de l'envoi des mail",
		});
		return;
	}

	res.status(200).json({
		success: true,
		message:
			'Email envoyé, veuillez vérifier la boite email de votre nouvelle adresse mail.',
	});
};

const changeEmailConfirmation: RequestHandler = async (req, res, next) => {
	const { oldEmail: reqOldEmail, newEmail: reqNewEmail } = req.body;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqOldEmail });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const newEmailExists = await databaseConnect.findOne({ email: reqNewEmail });

	if (newEmailExists) {
		res.status(400).json({
			error: 'Un compte avec votre nouvelle adresse email existe déjà.',
		});
		return;
	}

	await databaseConnect.updateOne(
		{ email: reqOldEmail },
		{ $set: { email: reqNewEmail } }
	);

	res.status(200).json({
		success: true,
		message:
			'Adresse mail modifiée, veuillez vous connecter avec votre nouvelle adresse email.',
	});

	console.log('done');
};

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

	console.log(validInputs.oldPassword);

	if (!validInputs.oldPassword) {
		res.status(400).json({
			error: 'Veuillez corriger les erreurs.',
			validInputs: {
				oldPassword: false,
				newPassword: {
					differentThanOld: true,
					format: true,
				},
				newPasswordConfirmation: true,
			},
		});
		console.log('here');
		return;
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
		console.log(validInputs);
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
	// if (!user.confirmation.confirmed) {
	// 	res.status(403).json({
	// 		error: "Cette adresse mail n'est pas confirmée. Envoi de mail impossible.",
	// 	});
	// 	return;
	// }

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
			text: `Pour modifier votre mot de passe, cliquez sur ce lien.  ${reqEmail}`,
			html: `<div><b>Mot de passe oublié?</b><a href="${
				process.env.FRONT_END_URL
			}/modifier/mot-de-passe/${encodeURI(reqEmail)}/${encodeURI(
				generatedForgotPasswordCode
			)}">Cliquez ici !</a></div>`,
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

const changeForgottenPassword: RequestHandler = async (req, res, next) => {
	const {
		id: reqIdStr,
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
		newPassword: false,
		newPasswordConfirmation: false,
	};

	validInputs.newPassword = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	validInputs.newPasswordConfirmation = reqNewPassword === reqNewPasswordConfirmation;

	console.log(validInputs.newPasswordConfirmation);

	if (!validInputs.newPassword || !validInputs.newPasswordConfirmation) {
		res.status(400).json({ error: true, message: 'Champs invalides', validInputs });
		return;
	}

	const hashedNewPassword = await bcrypt.hash(reqNewPassword, 10);

	await databaseConnect.updateOne(
		{ _id: reqId },
		{ $set: { password: hashedNewPassword } }
	);

	res.status(200).json({ success: true, message: 'Mot de passe modifié.' });
};

const deleteAccountEmail: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr } = req.body;

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	console.log(user);

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const generatedForgotPasswordCode = crypto.randomBytes(20).toString('hex');

	await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				deleteCode: generatedForgotPasswordCode,
			},
		}
	);

	const transporter = createNodemailerTransporter();

	const emailWasSent = await transporter.sendMail({
		from: '"Six App" <contact@michel-lamarliere.com>',
		to: 'lamarliere.michel@icloud.com',
		subject: 'Suppression de votre compte',
		// text: 'Cliquez',
		html: `<div>Cliquez <a href="${
			process.env.FRONT_END_URL
		}/supprimer-compte/confirmation/${encodeURI(user.email)}/${encodeURI(
			generatedForgotPasswordCode
		)}">ici</a> pour supprimer votre compte, cliquez sur ce lien</div>`,
	});

	if (emailWasSent) {
		res.status(200).json({ success: true, message: 'Email envoyé !' });
	} else {
		res.status(400).json({ error: true, message: "Erreur lors de l'envoi de mail" });
	}
};

const deleteAccountConfirm: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, code: reqCode } = req.body;

	// const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	if (reqCode !== user.deleteCode) {
		res.status(400).json({
			error: 'Erreur lors de la suppression de votre compte. Veuillez nous contacter',
		});
		return;
	}

	await databaseConnect.deleteOne({ email: reqEmail });

	const transporter = createNodemailerTransporter();

	await transporter.sendMail({
		from: '"Six App" <contact@michel-lamarliere.com>',
		to: 'lamarliere.michel@icloud.com',
		subject: 'Compte supprimé',
		// text: 'Cliquez',
		html: `Nous sommes tristes de vous voir partir.`,
	});

	res.json({ success: true, message: 'Compte supprimé.' });
};

exports.changeImage = changeImage;
exports.changeName = changeName;
exports.changeEmail = changeEmail;
exports.changeEmailConfirmation = changeEmailConfirmation;
exports.changePassword = changePassword;
exports.sendEmailForgotPassword = sendEmailForgotPassword;
exports.checkForgotPasswordAuth = checkForgotPasswordAuth;
exports.changeForgottenPassword = changeForgottenPassword;
exports.deleteAccountEmail = deleteAccountEmail;
exports.deleteAccountConfirm = deleteAccountConfirm;
