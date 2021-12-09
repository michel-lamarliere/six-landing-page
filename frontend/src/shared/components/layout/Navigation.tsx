import React, { FormEvent, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useInput } from '../../hooks/useInput';
import FormInput from '../FormElements/FormInput';

import classes from './Navigation.module.scss';

const Header: React.FC = () => {
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

	const signupFormHandler = (event: FormEvent) => {
		event.preventDefault();
		fetch('http://localhost:8080/api/users/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: Math.random(),
				name: nameInput,
				email: emailInput,
				password: passwordInput,
			}),
		});
		resetFormInputs();
	};

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				<button onClick={signUpBtnHandler}>
					{loginMode ? 'Sign Up' : 'Login'}
				</button>
			</div>
			<form onSubmit={signupFormHandler} className={classes.form}>
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
		</div>
	);
};

export default Header;
