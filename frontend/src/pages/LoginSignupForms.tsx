import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { addHours } from 'date-fns';

import type { RootState } from '../_shared/store/store';
import { EmailConfirmationActionTypes } from '../_shared/store/email-confirmation';
import { UserActionTypes } from '../_shared/store/user';

import { useRequest } from '../_shared/hooks/http-hook';
import { useInput, useInputTypes } from '../_shared/hooks/input-hook';

import Input from '../_shared/components/FormElements/Input';

import RememberMeFalseSVG from '../_shared/assets/icons/remember-me_false.svg';
import RememberMeTrueSVG from '../_shared/assets/icons/remember-me_true.svg';

import classes from './LoginSignupForms.module.scss';

const Header: React.FC = () => {
	const [responseMessage, setResponseMessage] = useState('');
	const [rememberEmail, setRememberEmail] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loginMode, setLoginMode] = useState(true);
	const [formIsValid, setFormIsValid] = useState(false);

	const checkEmail = async () => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/user_modify/check-email/${checkEmailInput.value}`,
			'GET',
			null
		);

		console.log(responseData);

		if (!responseData) {
			console.log(responseData);
			return;
		}

		if (responseData.error) {
			console.log('no');
			setResponseMessage(responseData.message);
			setCheckEmailInput((prev) => ({ ...prev, isValid: false }));
		}

		if (responseData.success) {
			console.log('yes');
			setCheckEmailInput((prev) => ({ ...prev, isValid: true }));
		}
	};

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameOnChangeHandler,
		inputOnBlurHandler: nameOnBlurHandler,
	} = useInput(useInputTypes.NAME, loginMode);

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput(useInputTypes.EMAIL, loginMode);

	const {
		input: checkEmailInput,
		setInput: setCheckEmailInput,
		inputOnChangeHandler: checkEmailOnChangeHandler,
		inputOnBlurHandler: checkEmailOnBlurHandler,
	} = useInput(useInputTypes.CHECK_EMAIL, null, null, checkEmail);

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput(useInputTypes.PASSWORD, loginMode);

	const {
		input: passwordConfirmationInput,
		setInput: setPasswordConfirmationInput,
		inputOnChangeHandler: passwordConfirmationOnChangeHandler,
		inputOnBlurHandler: passwordConfirmationOnBlurHandler,
	} = useInput(useInputTypes.PASSWORD_COMPARISON, loginMode, passwordInput.value);

	const switchModeHandler = () => {
		setLoginMode((prev) => !prev);

		setNameInput({ value: '', isValid: false, isTouched: false });

		setEmailInput({
			value: '',
			isValid: true,
			isTouched: false,
		});

		setPasswordInput({
			value: '',
			isValid: true,
			isTouched: false,
		});

		setPasswordConfirmationInput({
			value: '',
			isValid: true,
			isTouched: false,
		});
	};

	const logInUser = (responseData: {
		error: string;
		token: string;
		id: string;
		name: string;
		email: string;
		confirmedEmail: string;
	}) => {
		if (responseData.error) {
			setResponseMessage(responseData.error);
			return;
		}

		const { token, id, name, email, confirmedEmail } = responseData;

		const tokenExpiration = addHours(new Date(), 1);

		if (rememberEmail) {
			localStorage.setItem('rememberEmail', email);
		} else if (!rememberEmail) {
			localStorage.removeItem('rememberEmail');
		}

		dispatch({
			type: UserActionTypes.LOG_IN,
			token: token,
			expiration: tokenExpiration.toISOString(),
			id: id,
			name: name,
			email: email,
			confirmedEmail: confirmedEmail,
		});

		sessionStorage.setItem(
			'showEmailConfirmationPopup',
			JSON.stringify(!confirmedEmail)
		);

		if (!confirmedEmail) {
			dispatch({ type: EmailConfirmationActionTypes.SHOW });
		}

		navigate('/journal/quotidien');
	};

	const signupFormHandler = async (event: FormEvent) => {
		event.preventDefault();

		const responseData = await sendRequest(
			'http://localhost:8080/api/user/signup',
			'POST',
			JSON.stringify({
				name: nameInput.value.trim().toLowerCase(),
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
			})
		);

		logInUser(responseData);
	};

	const loginFormHandler = async (event: FormEvent) => {
		event.preventDefault();

		const responseData = await sendRequest(
			'http://localhost:8080/api/user/signin',
			'POST',
			JSON.stringify({
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
			})
		);

		logInUser(responseData);
	};

	const checkboxHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setRememberEmail((prev) => !prev);
	};

	const forgotPasswordHandler = async (event: FormEvent) => {
		event.preventDefault();
		setResponseMessage('');
		setForgotPassword((prev) => !prev);
	};

	const sendEmailForgotPassword = async (event: FormEvent) => {
		event.preventDefault();
		const responseData = await sendRequest(
			`http://localhost:8080/api/user_modify/email/forgot-password/${checkEmailInput.value}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			setResponseMessage(responseData.error);
			return;
		}

		setResponseMessage(responseData.success);

		setForgotPassword(false);
	};

	useEffect(() => {
		const emailStorage = localStorage.getItem('rememberEmail');

		if (loginMode && emailStorage) {
			setEmailInput((prev) => ({ ...prev, value: emailStorage }));
			setRememberEmail(true);
		}
	}, [userState.token, loginMode]);

	useEffect(() => {
		setResponseMessage('');

		if (loginMode) {
			if (
				emailInput.value.trim().length > 0 &&
				passwordInput.value.trim().length > 0
			) {
				setFormIsValid(true);
			} else {
				setFormIsValid(false);
			}
		} else {
			if (
				nameInput.isValid &&
				emailInput.isValid &&
				passwordInput.isValid &&
				passwordConfirmationInput.isValid
			) {
				setFormIsValid(true);
			} else {
				setFormIsValid(false);
			}
		}
	}, [nameInput, emailInput, passwordInput, passwordConfirmationInput]);

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email &&
		userState.confirmedEmail;

	return (
		<div className={classes.wrapper}>
			<h1 className={classes.title}>
				{loginMode ? 'Heureux de vous revoir !' : 'Bienvenue !'}
			</h1>
			{!userData && (
				<form
					onSubmit={loginMode ? loginFormHandler : signupFormHandler}
					className={classes.form}
				>
					{!loginMode && (
						<Input
							id='Nom'
							type='text'
							placeholder='Jean'
							errorText='Minimum 2 caractères, sans espaces.'
							value={nameInput.value}
							isValid={nameInput.isValid}
							isTouched={nameInput.isTouched}
							onChange={nameOnChangeHandler}
							onBlur={nameOnBlurHandler}
						/>
					)}
					{!forgotPassword && (
						<>
							<Input
								id='Email'
								type='text'
								placeholder='jean@email.fr'
								value={emailInput.value}
								errorText='Format invalide.'
								isValid={emailInput.isValid}
								isTouched={emailInput.isTouched}
								onChange={emailOnChangeHandler}
								onBlur={emailOnBlurHandler}
							/>
							<Input
								id='mot de passe'
								type='password'
								placeholder='Mot de passe'
								value={passwordInput.value}
								isValid={passwordInput.isValid}
								isTouched={passwordInput.isTouched}
								errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
								onChange={passwordOnChangeHandler}
								onBlur={passwordOnBlurHandler}
								password={true}
							/>
							{!loginMode && (
								<Input
									id='mot de passe'
									type='password'
									placeholder='Confirmation mot de passe'
									value={passwordConfirmationInput.value}
									isValid={passwordConfirmationInput.isValid}
									isTouched={passwordConfirmationInput.isTouched}
									errorText='Les mots de passe ne sont pas indentiques.'
									onChange={passwordConfirmationOnChangeHandler}
									onBlur={passwordConfirmationOnBlurHandler}
									password={true}
								/>
							)}
						</>
					)}
					{loginMode && !forgotPassword && (
						<div className={classes['remember-me']}>
							<button
								onClick={checkboxHandler}
								className={classes['remember-me__button']}
							>
								<img
									className={classes['remember-me__button__img']}
									src={
										rememberEmail
											? RememberMeTrueSVG
											: RememberMeFalseSVG
									}
									alt='Se souvenir de moi'
								/>
							</button>
							<div onClick={() => setRememberEmail((prev) => !prev)}>
								Se souvenir de moi
							</div>
						</div>
					)}
					{forgotPassword && (
						<>
							<Input
								id='Email'
								type='text'
								placeholder='jean@email.fr'
								value={checkEmailInput.value}
								errorText='Adresse email non trouvée, veuillez créer un compte.'
								isValid={checkEmailInput.isValid}
								isTouched={checkEmailInput.isTouched}
								onChange={checkEmailOnChangeHandler}
								onBlur={checkEmailOnBlurHandler}
							/>
							<p>Envoyer un email pour changer mon mot de passe.</p>
							<button
								onClick={sendEmailForgotPassword}
								disabled={!checkEmailInput.isValid}
								className={`${classes['submit-button']} ${
									!checkEmailInput.isValid &&
									classes['submit-button--disabled']
								}`}
							>
								Envoyer un email.
							</button>
						</>
					)}
					{!forgotPassword && (
						<button
							disabled={!formIsValid}
							className={`${classes['submit-button']} ${
								!formIsValid && classes['submit-button--disabled']
							}`}
						>
							{loginMode ? 'Connexion' : 'Inscription'}
						</button>
					)}
					<div className={classes['response-message']}>{responseMessage}</div>
					{loginMode && (
						<button
							onClick={forgotPasswordHandler}
							className={classes['forgot-password-button']}
						>
							{forgotPassword ? 'Revenir' : 'Mot de passe oublié?'}
						</button>
					)}
				</form>
			)}
			<h1>michel@test.com</h1>
			<h1>Tester1@</h1>

			<div className={classes.footer}>
				{!userData && !forgotPassword && (
					<>
						<div className={classes.footer__text}>
							{loginMode ? 'Pas de compte ?' : 'Déjà membre ?'}
						</div>
						<button
							onClick={switchModeHandler}
							className={classes.footer__button}
						>
							{loginMode ? 'Inscrivez-vous !' : 'Connectez-vous !'}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Header;
