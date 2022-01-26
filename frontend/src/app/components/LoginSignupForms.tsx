import React, { FormEvent, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addHours, addSeconds } from 'date-fns';

import { useRequest } from '../../shared/hooks/http-hook';
import { useInput } from '../../shared/hooks/input-hook';
import Input from '../../shared/components/FormElements/Input';

import classes from './LoginSignupForms.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../shared/store/store';

const Header: React.FC = () => {
	const [responseMessage, setResponseMessage] = useState('');
	const [rememberEmail, setRememberEmail] = useState(false);

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
	} = useInput('NAME', loginMode);

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput('EMAIL', loginMode);

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput('PASSWORD', loginMode);

	const switchModeHandler = () => {
		setLoginMode((prev) => !prev);
		resetFormInputs();
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

		const tokenExpiration = addHours(new Date(), 1);

		dispatch({
			type: 'LOG_IN',
			token: token,
			expiration: tokenExpiration.toISOString(),
			id: id,
			name: name,
			email: email,
		});

		localStorage.setItem(
			'userData',
			JSON.stringify({
				token: token,
				expiration: tokenExpiration.toISOString(),
				id: id,
				email: email,
				name: name,
			})
		);

		resetFormInputs();

		navigate('/log/daily');
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

		const tokenExpiration = addHours(new Date(), 1);
		// const tokenExpiration = addSeconds(new Date(), 5);

		console.log({ rememberEmail });
		if (rememberEmail) {
			localStorage.setItem('rememberEmail', email);
		} else if (!rememberEmail) {
			localStorage.removeItem('rememberEmail');
		}

		localStorage.setItem(
			'userData',
			JSON.stringify({
				token: token,
				expiration: tokenExpiration.toISOString(),
				id: id,
				email: email,
				name: name,
			})
		);

		dispatch({
			type: 'LOG_IN',
			token: token,
			expiration: tokenExpiration.toISOString(),
			id: id,
			name: name,
			email: email,
		});

		resetFormInputs();
		navigate('/log/daily');
	};

	const checkboxHandler = () => {
		console.log(rememberEmail);
		setRememberEmail((prev) => !prev);
	};

	// useEffect(() => {
	// 	const rememberEmailStorage = localStorage.getItem('rememberEmail');
	// 	console.log(rememberEmailStorage);
	// 	console.log({ rememberEmail });
	// 	if (loginMode && rememberEmailStorage) {
	// 		setEmailInput((prev) => ({ ...prev, value: rememberEmailStorage }));
	// 		setRememberEmail(true);
	// 		console.log('test-empty');
	// 		console.log(rememberEmail);
	// 	}
	// }, []);

	useEffect(() => {
		const rememberEmailStorage = localStorage.getItem('rememberEmail');
		console.log(rememberEmailStorage);
		console.log({ rememberEmail });
		if (loginMode && rememberEmailStorage) {
			setEmailInput((prev) => ({ ...prev, value: rememberEmailStorage }));
			setRememberEmail(true);
			console.log('test-empty');
			console.log(rememberEmail);
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
						password={true}
					/>
					{loginMode && (
						<div className={classes.remember_me}>
							<label htmlFor='remember_me'>Se souvenir de moi</label>
							<input
								type='checkbox'
								id='remember_me'
								name='remember_me'
								onChange={checkboxHandler}
								checked={rememberEmail}
							/>
						</div>
					)}
					<button disabled={!formIsValid}>
						{loginMode ? 'Connexion' : 'Inscription'}
					</button>
					<h1>michel@test.com</h1>
					<h1>Tester1@</h1>
					<h1>{responseMessage}</h1>
				</form>
			)}
		</div>
	);
};

export default Header;