import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const database = require('../util/db-connect');
const nodemailer = require('nodemailer');
const { v5: uuidv5 } = require('uuid');

const signUp: RequestHandler = async (req, res, next) => {
	const { name: reqName, email: reqEmail, password: reqPassword } = await req.body;

	const databaseConnect = await database.getDb('six-dev').collection('test');

	let inputsAreValid = {
		all: false,
		name: false,
		email: false,
		password: false,
	};

	// VALIDATION
	if (reqName.trim().length >= 2 && reqName.trim().match(/^[-'a-zA-ZÀ-ÖØ-öø-ÿ]+$/))
		inputsAreValid.name = true;
	if (
		reqEmail.match(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
	)
		inputsAreValid.email = true;

	if (
		reqPassword.match(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
		)
	)
		inputsAreValid.password = true;

	if (inputsAreValid.name && inputsAreValid.email && inputsAreValid.password) {
		inputsAreValid.all = true;
	}

	if (!inputsAreValid.all) {
		res.json({ error: 'Erreur lors de la création de compte.' });
		return;
	}

	let existingUser = await databaseConnect.findOne({ email: reqEmail });

	if (existingUser) {
		res.json({
			error: 'Adresse email déjà utilisée, veuillez en choisir une autre ou vous connecter.',
		});
		return;
	}

	// HASHING PASSWORD
	const hashedPassword = await bcrypt.hash(reqPassword, 10);
	const hashedConfirmationCode = uuidv5(reqEmail, process.env.UUID_NAMESPACE);
	console.log(hashedConfirmationCode);

	const newUser = {
		name: reqName,
		email: reqEmail,
		password: hashedPassword,
		confirmation: {
			confirmed: false,
			code: hashedConfirmationCode,
		},
		log: [],
	};

	// CREATES NEW USER
	await databaseConnect.insertOne(newUser);

	// GETS THE ID
	let findingNewUser = await databaseConnect.findOne({ email: reqEmail });

	if (!findingNewUser) {
		res.json({ error: 'Erreur, veuillez réessayer plus tard.' });
		return;
	}

	// CREATES THE TOKEN
	let token = await jwt.sign(
		{ id: findingNewUser._id, email: findingNewUser.email },
		'je_mange_du_pain_blanc_enola',
		{ expiresIn: '1h' }
	);

	const transporter = nodemailer.createTransport({
		host: 'smtp.hostinger.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.NODEMAILER_EMAIL,
			pass: process.env.NODEMAILER_PASSWORD,
		},
	});

	try {
		const info = await transporter.sendMail({
			from: '"Six App" <contact@michel-lamarliere.com>',
			to: 'lamarliere.michel@icloud.com',
			subject: "Confirmation de l'adresse mail. ",
			text: 'Veuillez confirmer votre adresse mail en cliquant sur ce lien.',
			html: `<div><b>Bien ou quoi?</b><a href="http://localhost:3000/profile/confirm/${findingNewUser.email}/${findingNewUser.confirmation.code}"> Cliquez ici pour confirmer votre adresse mail.</a></div>`,
		});
		console.log('Message sent: %s', info.messageId);
	} catch (error) {
		console.log(error);
	}

	res.json({
		success: 'Compte créé !',
		token: token,
		id: findingNewUser._id,
		name: findingNewUser.name,
		email: findingNewUser.email,
		confirmedEmail: findingNewUser.confirmation.confirmed,
	});
};

const signIn: RequestHandler = async (req, res, next) => {
	const { email: reqEmail, password: reqPassword } = req.body;
	console.log('---SIGN-IN');
	console.log({ reqEmail, reqPassword });

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({ email: reqEmail });

	if (!result) {
		res.json({
			error: 'Adresse email non trouvée, veuillez créer un compte.',
		});
		return;
	}

	console.log(result.password);

	const matchingPasswords = await bcrypt.compare(reqPassword, result.password);

	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.json({ error: 'Mot de passe incorrect.' });
		return;
	}

	const token = await jwt.sign(
		{ userId: result._id, email: result.email },
		'je_mange_du_pain_blanc_enola',
		{ expiresIn: '1h' }
	);

	res.json({
		token,
		id: result._id,
		name: result.name,
		email: result.email,
		confirmedEmail: result.confirmation.confirmed,
	});
	console.log('SIGN-IN---');
};

const confirmEmailAddress: RequestHandler = async (req, res, next) => {
	const email = req.body.email;
	const code = req.body.code;

	console.log(email, code);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({
		email: email,
		'confirmation.code': code,
	});

	if (!user) {
		res.json({ error: 'Code invalide' });
		return;
	}

	await databaseConnect.updateOne(
		{ email: email },
		{
			$set: {
				'confirmation.confirmed': true,
			},
		}
	);

	res.json({ success: 'Compte confirmé.' });
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
		res.json({ error: 'Nouveau Nom Invalide !' });
		return;
	}

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const filter = { _id: reqId };

	const result = await databaseConnect.findOne(filter);

	if (!result) {
		res.json({ error: 'Erreur' });
		return;
	}

	await databaseConnect.updateOne(filter, {
		$set: {
			name: reqNewName,
		},
	});

	res.json({ success: 'Nom modifié !', name: reqNewName });
};

const comparePasswords: RequestHandler = async (req, res, next) => {
	console.log('---COMPARE_PASSWORDS');
	const reqId = new ObjectId(req.params.id);
	const reqPassword = req.params.password;

	console.log({ reqPassword });

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const result = await databaseConnect.findOne({ _id: reqId });

	if (!result) {
		res.json({ error: 'Un problème est survenu.' });
		console.log('error');
		return;
	}

	console.log(reqPassword);
	console.log(result.password);

	const matchingPasswordsjs = await bcryptjs.compare(reqPassword, result.password);
	console.log({ matchingPasswordsjs });

	const matchingPasswords = await bcrypt.compare(reqPassword, result.password);
	console.log({ matchingPasswords });

	if (!matchingPasswords) {
		res.json({ error: 'Mots de passe non identiques' });
		return;
	}

	res.json({ success: 'Mots de passe identiques' });

	console.log('COMPARE_PASSWORDS---');
};

const changePassword: RequestHandler = async (req, res, next) => {
	console.log('---CHANGE_PASSWORDS');
	const { id: reqIdStr, newPassword: reqNewPassword } = req.body;
	console.log({ reqIdStr, reqNewPassword });

	const reqId = new ObjectId(reqIdStr);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const filter = { _id: reqId };

	const result = await databaseConnect.findOne(filter);

	if (!result) {
		res.json({ error: 'Une erreur est survenue.' });
		return;
	}

	const newPasswordIsValid = reqNewPassword.match(
		/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
	);

	if (!newPasswordIsValid) {
		res.json({ error: 'Nouveau Mot de Passe Invalide.' });
		return;
	}

	const hashedNewPassword = await bcrypt.hash(reqNewPassword, 10);
	console.log(hashedNewPassword);

	await databaseConnect.updateOne(filter, {
		$set: {
			password: hashedNewPassword,
		},
	});

	res.json({ success: 'Mot de passe modifié.' });

	console.log('CHANGE_PASSWORDS---');
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.confirmEmailAddress = confirmEmailAddress;
exports.changeName = changeName;
exports.comparePasswords = comparePasswords;
exports.changePassword = changePassword;
