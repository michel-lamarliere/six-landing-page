import { RequestHandler } from 'express';
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { addMinutes, isBefore } = require('date-fns');

const database = require('../util/db-connect');
const { createNodemailerTransporter } = require('../util/nodemailer-transporter');

const checkEmail: RequestHandler = async (req, res, next) => {
	const reqEmail = req.params.email;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({
			error: 'Adresse mail non trouvée, veuillez créer un compte.',
		});
		return;
	}

	res.status(200).json({ success: true });
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
		reqNewName.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/)
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

const comparePasswords: RequestHandler = async (req, res, next) => {
	const reqId = new ObjectId(req.params.id);
	const reqPassword = req.params.password;

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	// CHECKS IF THE PASSWORD MATCHES THE USER'S HASHED PASSWORD
	const matchingPasswords = await bcrypt.compare(reqPassword, user.password);

	if (!matchingPasswords) {
		res.status(400).json({ error: 'Mots de passe non identiques' });
		return;
	}

	res.status(200).json({ success: 'Mots de passe identiques' });
};

const changePassword: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, newPassword: reqNewPassword } = req.body;

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('users');

	// CHECKS IF THE USER EXISTS
	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

<<<<<<< HEAD
	// COMPARES THE NEW PASSWORD TO THE OLD ONE
=======
>>>>>>> 5d04898eab352cd2805621f875a3f53affdaef51
	const samePasswords = await bcrypt.compare(user.password, reqNewPassword);

	if (samePasswords) {
		res.json({
			error: "Le nouveau mot de passe ne peut pas être identique à l'ancien.",
		});
		return;
	}

	// CHECKS IF THE PASSWORD IS IN THE CORRECT FORMAT
	const newPasswordIsValid = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	if (!newPasswordIsValid) {
		res.status(400).json({ error: 'Nouveau Mot de Passe Invalide.' });
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

exports.checkEmail = checkEmail;
exports.changeName = changeName;
exports.comparePasswords = comparePasswords;
exports.changePassword = changePassword;
exports.sendEmailForgotPassword = sendEmailForgotPassword;
exports.checkForgotPasswordAuth = checkForgotPasswordAuth;
