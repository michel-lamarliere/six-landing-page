import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useRequest } from '../../hooks/http-hook';
import { useInput } from '../../hooks/input-hook';
import Input from '../FormElements/Input';

import classes from './Navigation.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';

const Header: React.FC = () => {
	const [responseMessage, setResponseMessage] = useState('');

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loginMode, setLoginMode] = useState(true);
	const [formIsValid, setFormIsValid] = useState(false);

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameOnChangeHandler,
		inputOnBlurHandler: nameOnBlurHandler,
		// inputOnPasteHandler: nameOnPasteHandler,
	} = useInput('NAME', loginMode);

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
		// inputOnPasteHandler: emailOnPasteHandler,
	} = useInput('EMAIL', loginMode);

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
		// inputOnPasteHandler: passwordOnPasteHandler,
	} = useInput('PASSWORD', loginMode);

	const switchModeHandler = () => {
		setLoginMode((prev) => !prev);
		resetFormInputs();
	};

	const logoutBtnHandler = () => {
		if (!loginMode) {
			switchModeHandler();
		}

		dispatch({ type: 'LOG_OUT' });
		navigate('/');
		localStorage.removeItem('credentials');
	};

	const resetFormInputs = () => {
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

		if (responseData.error) {
			setResponseMessage(responseData.error);
			return;
		}

		const { success, token, id, email, name } = responseData;

		dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });

		localStorage.setItem(
			'credentials',
			JSON.stringify({
				email: email,
				password: 'Tester1@',
			})
		);

		resetFormInputs();

		navigate('/log');
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

		if (responseData.error) {
			setResponseMessage(responseData.error);
			return;
		}

		const { token, id, name, email } = responseData;

		dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });

		resetFormInputs();

		localStorage.setItem(
			'credentials',
			JSON.stringify({
				email: email,
				password: 'Tester1@',
			})
		);

		navigate('/log');
	};

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
			if (nameInput.isValid && emailInput.isValid && passwordInput.isValid) {
				setFormIsValid(true);
			} else {
				setFormIsValid(false);
			}
		}
	}, [nameInput, emailInput, passwordInput]);

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				{userState.token === null && (
					<button onClick={switchModeHandler}>
						Basculer sur {loginMode ? "s'inscrire" : 'se connecter'}
					</button>
				)}
				{userState.token !== null && (
					<button onClick={logoutBtnHandler}>Se déconnecter</button>
				)}
			</div>
			{userState.token === null && (
				<form
					onSubmit={loginMode ? loginFormHandler : signupFormHandler}
					className={classes.form}
				>
					{!loginMode && (
						<Input
							id='Nom'
							type='text'
							placeholder='Jean'
							errorText='Nom invalide'
							value={nameInput.value}
							isValid={nameInput.isValid}
							isTouched={nameInput.isTouched}
							onChange={nameOnChangeHandler}
							onBlur={nameOnBlurHandler}
							// onPaste={nameOnPasteHandler}
						/>
					)}
					<Input
						id='Email'
						type='text'
						placeholder='jean@email.fr'
						value={emailInput.value}
						errorText='Adresse mail non valide.'
						isValid={emailInput.isValid}
						isTouched={emailInput.isTouched}
						onChange={emailOnChangeHandler}
						onBlur={emailOnBlurHandler}
						// onPaste={emailOnPasteHandler}
					/>
					<Input
						id='mot de passe'
						type='password'
						placeholder='********'
						value={passwordInput.value}
						isValid={passwordInput.isValid}
						isTouched={passwordInput.isTouched}
						errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
						onChange={passwordOnChangeHandler}
						onBlur={passwordOnBlurHandler}
						// onPaste={passwordOnPasteHandler}
						password={true}
					/>
					<button disabled={!formIsValid}>
						{loginMode ? 'Connexion' : 'Inscription'}
					</button>
					<h1>michel@test.com</h1>
					<h1>Tester1@</h1>
					<h1>{responseMessage}</h1>
				</form>
			)}
			{userState.token && (
				<>
					<Link to='/log'>Log</Link>
					<Link to='/profile'>Profile</Link>
				</>
			)}
			{userState.token && (
				<>
					<div>token:{userState.token}</div>
					<div>id:{userState.id}</div>
					<div>Nom:{userState.name}</div>
					<div>Email:{userState.email}</div>
				</>
			)}
		</div>
	);
};

export default Header;
