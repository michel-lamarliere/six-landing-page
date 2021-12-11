import React, { FormEvent, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useInput } from '../../hooks/useInput';
import FormInput from '../FormElements/FormInput';

import classes from './Navigation.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';

const Header: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const dispatch = useDispatch();

	console.log(userState);

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameOnChangeHander,
	} = useInput();
	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHander,
	} = useInput();

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHander,
	} = useInput();

	const [loginMode, setLoginMode] = useState(false);

	const signUpBtnHandler = () => {
		setLoginMode((prev) => !prev);
	};

	const resetFormInputs = () => {
		setNameInput('');
		setEmailInput('');
		setPasswordInput('');
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
		console.log(responseData);
		const { id, name, email } = responseData;
		dispatch({ type: 'LOG_IN', isLoggedIn: true, id: id, name: name, email: email });
		resetFormInputs();
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

		const responseData = await response.json();
		const { id, name, email } = responseData;
		dispatch({ type: 'LOG_IN', isLoggedIn: true, id: id, name: name, email: email });
		resetFormInputs();
	};

	const logoutBtnHandler = () => {
		dispatch({ type: 'LOG_OUT' });
	};

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				{!userState.isLoggedIn && (
					<button onClick={signUpBtnHandler}>
						{loginMode ? 'Sign Up' : 'Log In'}
					</button>
				)}
				{userState.isLoggedIn && (
					<button onClick={logoutBtnHandler}>
						{userState.isLoggedIn && 'Log Out'}
					</button>
				)}
			</div>
			{!userState.isLoggedIn && (
				<form
					onSubmit={loginMode ? loginFormHandler : signupFormHandler}
					className={classes.form}
				>
					{!loginMode && (
						<FormInput
							id='Name'
							type='text'
							placeholder='John'
							value={nameInput}
							onChange={nameOnChangeHander}
						/>
					)}
					<FormInput
						id='Email'
						type='text'
						placeholder='example@example.com'
						value={emailInput}
						onChange={emailOnChangeHander}
					/>
					<FormInput
						id='password'
						type='password'
						placeholder='********'
						value={passwordInput}
						onChange={passwordOnChangeHander}
					/>
					<button>{loginMode ? 'Login' : 'Sign Up'}</button>
				</form>
			)}
			<div>Is Logged In:{userState.isLoggedIn.toString()}</div>
			<div>Id:{userState.id}</div>
			<div>Name:{userState.name}</div>
			<div>Email:{userState.email}</div>
		</div>
	);
};

export default Header;
