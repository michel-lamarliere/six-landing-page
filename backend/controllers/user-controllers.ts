import { RequestHandler } from 'express';
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const database = require('../util/db-connect');
const { v5: uuidv5 } = require('uuid');
var crypto = require('crypto');

const { createNodemailerTransporter } = require('../util/nodemailer-transporter');
const { emailConfirmationEmail } = require('../util/email-confirmation');

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
		forgotPasswordCode: null,
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

	// EMAIL
	emailConfirmationEmail(reqEmail, hashedConfirmationCode);

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

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.json({ fatal: true });
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

	res.json({ success: 'Nom modifié !', name: reqNewName });
};

const comparePasswords: RequestHandler = async (req, res, next) => {
	console.log('---COMPARE_PASSWORDS');
	const reqId = new ObjectId(req.params.id);
	const reqPassword = req.params.password;

	console.log({ reqPassword });

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.json({ fatal: true });
		return;
	}

	console.log(reqPassword);
	console.log(user.password);

	const matchingPasswordsjs = await bcryptjs.compare(reqPassword, user.password);
	console.log({ matchingPasswordsjs });

	const matchingPasswords = await bcrypt.compare(reqPassword, user.password);
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

	const user = await databaseConnect.findOne({ _id: reqId });

	if (!user) {
		res.json({ fatal: true });
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

	await databaseConnect.updateOne(
		{ _id: reqId },
		{
			$set: {
				password: hashedNewPassword,
			},
		}
	);

	res.json({ success: 'Mot de passe modifié.' });

	console.log('CHANGE_PASSWORDS---');
};

const refreshData: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.params.userId);
	console.log(id);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.json({ fatal: true });
		return;
	}

	res.json({ success: 'Données rafraichies', user });
};

const resendEmailConfirmation: RequestHandler = async (req, res, next) => {
	const id = new ObjectId(req.body.id);
	console.log(id);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ _id: id });

	if (!user) {
		res.json({ fatal: true });
		return;
	}

	if (user.confirmation.confirmed) {
		res.json({ error: 'Compte déjà confirmé, veuillez rafraichir vos données.' });
		return;
	}

	try {
		await emailConfirmationEmail(user.email, user.confirmation.code);
	} catch (error) {
		res.json({ error: 'Une erreur est survenue.' });
		console.log('error');
		return;
	}

	res.json({
		success:
			'Email envoyé ! Veuillez vérifier votre boîte de réception ou votre dossier spam.',
	});
};

const sendEmailForgotPassword: RequestHandler = async (req, res, next) => {
	const reqEmail = req.params.email;

	console.log(reqEmail);

	const databaseConnect = await database.getDb('six-dev').collection('test');

	const user = await databaseConnect.findOne({ email: reqEmail });

	if (!user) {
		res.json({ error: 'Cette adresse mail introuvable, veuillez créer un compte.' });
		return;
	}

	if (!user.confirmation.confirmed) {
		res.json({
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

	res.json({ success: 'Email envoyé, veuillez consulter votre boite de réception.' });
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
		res.json({ error: 'Non autorisé' });
		return;
	}

	res.json({ success: 'Autorisé !', id: user._id });
};

exports.signUp = signUp;
exports.signIn = signIn;
exports.confirmEmailAddress = confirmEmailAddress;
exports.changeName = changeName;
exports.comparePasswords = comparePasswords;
exports.changePassword = changePassword;
exports.refreshData = refreshData;
exports.resendEmailConfirmation = resendEmailConfirmation;
exports.sendEmailForgotPassword = sendEmailForgotPassword;
exports.checkForgotPasswordAuth = checkForgotPasswordAuth;
