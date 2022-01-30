import express, { RequestHandler } from 'express';
const crypto = require('crypto');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const database = require('../util/db-connect');
const { createNodemailerTransporter } = require('../util/nodemailer-transporter');

const sendEmailForgotPassword: RequestHandler = async (req, res, next) => {
	const reqEmail = req.params.email;

	console.log(reqEmail);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.status(404).json({
			error: 'Cette adresse mail introuvable, veuillez créer un compte.',
		});
		return;
	}

	if (!user.confirmation.confirmed) {
		res.status(403).json({
			error: "Cette adresse mail n'est pas confirmée. Envoi de mail impossible.",
		});
		return;
	}

	const generatedForgotPasswordCode = crypto.randomBytes(20).toString('hex');

	console.log(generatedForgotPasswordCode);

	await databaseConnect.updateOne(
		{ email: reqEmail },
		{ $set: { forgotPasswordCode: generatedForgotPasswordCode } }
	);

	const transporter = createNodemailerTransporter();

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
		console.log(encodeURI(reqEmail));
		console.log(encodeURI(generatedForgotPasswordCode));
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

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({
		email: reqEmail,
		forgotPasswordCode: reqUniqueId,
	});

	if (!user) {
		res.status(403).json({ error: 'Non autorisé' });
		return;
	}

	res.status(200).json({ success: 'Autorisé !', id: user._id });
};

const changePassword: RequestHandler = async (req, res, next) => {
	console.log('---CHANGE_PASSWORDS');
	const { id: reqIdStr, newPassword: reqNewPassword } = req.body;
	console.log({ reqIdStr, reqNewPassword });

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	const newPasswordIsValid = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	if (!newPasswordIsValid) {
		res.status(400).json({ error: 'Nouveau Mot de Passe Invalide.' });
		return;
	}

	const hashedNewPassword = await bcrypt.hash(reqNewPassword, 10);
	console.log(hashedNewPassword);

	await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				password: hashedNewPassword,
			},
		}
	);

	res.status(200).json({ success: 'Mot de passe modifié.' });

	console.log('CHANGE_PASSWORDS---');
};

const changeName: RequestHandler = async (req, res, next) => {
	const { id: reqIdStr, newName: reqNewName } = req.body;
	const reqId = new ObjectId(reqIdStr);

	let validateNewName = false;

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

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

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
	console.log('---COMPARE_PASSWORDS');
	const reqId = new ObjectId(req.params.id);
	const reqPassword = req.params.password;

	console.log({ reqPassword });

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.status(404).json({ fatal: true });
		return;
	}

	console.log(reqPassword);
	console.log(user.password);

	const matchingPasswords = await bcrypt.compare(reqPassword, user.password);
	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.status(400).json({ error: 'Mots de passe non identiques' });
		return;
	}

	res.status(200).json({ success: 'Mots de passe identiques' });

	console.log('COMPARE_PASSWORDS---');
};

exports.changeName = changeName;
exports.comparePasswords = comparePasswords;
exports.changePassword = changePassword;
exports.sendEmailForgotPassword = sendEmailForgotPassword;
exports.checkForgotPasswordAuth = checkForgotPasswordAuth;
