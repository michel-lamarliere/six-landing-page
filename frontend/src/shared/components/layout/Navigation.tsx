import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useInput } from '../../hooks/useInput';
import FormInput from '../FormElements/FormInput';

import classes from './Navigation.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';

const Header: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		const { token, id, name, email } = responseData;
		dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });
		resetFormInputs();
		navigate(`/${id}/log`);
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
		const { token, id, name, email } = responseData;
		dispatch({ type: 'LOG_IN', token: token, id: id, name: name, email: email });
		resetFormInputs();
	};

	const logoutBtnHandler = () => {
		dispatch({ type: 'LOG_OUT' });
		navigate('/');
	};

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				{userState.token === null && (
					<button onClick={signUpBtnHandler}>
						{loginMode ? 'Switch to Sign Up' : 'Switch to Log In'}
					</button>
				)}
				{userState.token !== null && (
					<button onClick={logoutBtnHandler}>Log Out</button>
				)}
			</div>
			{userState.token === null && (
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
			<div>token:{userState.token}</div>
			<div>Id:{userState.id}</div>
			<div>Name:{userState.name}</div>
			<div>Email:{userState.email}</div>
		</div>
	);
};

export default Header;
