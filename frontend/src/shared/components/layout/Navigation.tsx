import React, { FormEvent, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useInput } from '../../hooks/useInput';
import FormInput from '../FormElements/Input';

import classes from './Navigation.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';

const Header: React.FC = () => {
	const [responseMessage, setResponseMessage] = useState('');

	const userState = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loginMode, setLoginMode] = useState(false);

	const signUpBtnHandler = () => {
		setLoginMode((prev) => !prev);
	};

	const logoutBtnHandler = () => {
		dispatch({ type: 'LOG_OUT' });
		navigate('/');
		localStorage.removeItem('credentials');
	};

	// const {
	// 	input: nameInput,
	// 	setInput: setNameInput,
	// 	inputOnChangeHandler: nameOnChangeHandler,
	// 	inputOnBlurHandler: nameOnBlurHandler,
	// } = useInput('NAME');

	// const {
	// 	input: emailInput,
	// 	setInput: setEmailInput,
	// 	inputOnChangeHandler: emailOnChangeHandler,
	// 	inputOnBlurHandler: emailOnBlurHandler,
	// } = useInput('EMAIL');

	// const {
	// 	input: passwordInput,
	// 	setInput: setPasswordInput,
	// 	inputOnChangeHandler: passwordOnChangeHandler,
	// 	inputOnBlurHandler: passwordOnBlurHandler,
	// } = useInput('PASSWORD');

	const [nameInput, setNameInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const [emailInput, setEmailInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const [passwordInput, setPasswordInput] = useState({
		value: '',
		isValid: false,
		isTouched: false,
	});

	const resetFormInputs = () => {
		setNameInput({ value: '', isValid: false, isTouched: false });
		setEmailInput({
			value: '',
			isValid: false,
			isTouched: false,
		});
		setPasswordInput({
			value: '',
			isValid: false,
			isTouched: false,
		});
	};

	const onChangeHandler = (
		event: React.ChangeEvent<HTMLInputElement>,
		type: 'NAME' | 'EMAIL' | 'PASSWORD'
	) => {
		if (type === 'NAME') {
			setNameInput((prev) => ({ ...prev, value: event.target.value }));

			event.target.value.trim().length > 2
				? setNameInput((prev) => ({ ...prev, isValid: true }))
				: setNameInput((prev) => ({ ...prev, isValid: false }));
		} else if (type === 'EMAIL') {
			setEmailInput((prev) => ({ ...prev, value: event.target.value }));

			event.target.value.match(
				/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
				? setEmailInput((prev) => ({ ...prev, isValid: true }))
				: setEmailInput((prev) => ({ ...prev, isValid: false }));
		} else if (type === 'PASSWORD') {
			setPasswordInput((prev) => ({ ...prev, value: event.target.value }));

			event.target.value.match(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
			)
				? setPasswordInput((prev) => ({ ...prev, isValid: true }))
				: setPasswordInput((prev) => ({ ...prev, isValid: false }));
		}
	};

	const onBlurHandler = (type: 'NAME' | 'EMAIL' | 'PASSWORD') => {
		if (type === 'NAME') {
			setNameInput((prev) => ({ ...prev, isTouched: true }));
		}
		if (type === 'EMAIL') {
			setEmailInput((prev) => ({ ...prev, isTouched: true }));
		}
		if (type === 'PASSWORD') {
			setPasswordInput((prev) => ({ ...prev, isTouched: true }));
		}
	};

	const signupFormHandler = async (event: FormEvent) => {
		event.preventDefault();
		const response = await fetch('http://localhost:8080/api/users/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: nameInput,
				email: emailInput,
				password: passwordInput,
			}),
		});

		const { message, token, id, email, name } = await response.json();
		if (token) {
			dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });
		} else {
			setResponseMessage(message);
		}
	};

	const loginFormHandler = async (event: FormEvent) => {
		event.preventDefault();
		const response = await fetch('http://localhost:8080/api/users/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: emailInput,
				password: passwordInput,
			}),
		});

		const responseData = await response.json();
		if (responseData.message) {
			setResponseMessage(responseData.message);
			return;
		}
		const { token, id, name, email } = responseData;
		dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });
		resetFormInputs();
		localStorage.setItem(
			'credentials',
			JSON.stringify({
				email: email,
				password: 'tester',
			})
		);
	};

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				{userState.token === null && (
					<button onClick={signUpBtnHandler}>
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
						<>
							<FormInput
								id='Nom'
								type='text'
								placeholder='Jean'
								errorText='Nom trop court.'
								value={nameInput.value}
								isValid={nameInput.isValid}
								isTouched={nameInput.isTouched}
								onChange={(event) => onChangeHandler(event, 'NAME')}
								onBlur={() => onBlurHandler('NAME')}
							/>
						</>
					)}
					<FormInput
						id='Email'
						type='text'
						placeholder='jean@email.fr'
						value={emailInput.value}
						errorText='Adresse mail non valide.'
						isValid={emailInput.isValid}
						isTouched={emailInput.isTouched}
						onChange={(event) => onChangeHandler(event, 'EMAIL')}
						onBlur={() => onBlurHandler('EMAIL')}
					/>
					<FormInput
						id='mot de passe'
						type='password'
						placeholder='********'
						value={passwordInput.value}
						isValid={passwordInput.isValid}
						isTouched={passwordInput.isTouched}
						errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
						onChange={(event) => onChangeHandler(event, 'PASSWORD')}
						onBlur={() => onBlurHandler('PASSWORD')}
					/>
					<button>{loginMode ? 'Connexion' : 'Inscription'}</button>
					<h1>{responseMessage}</h1>
				</form>
			)}
			<div>token:{userState.token}</div>
			<div>id:{userState.id}</div>
			<div>Nom:{userState.name}</div>
			<div>Email:{userState.email}</div>
		</div>
	);
};

export default Header;
