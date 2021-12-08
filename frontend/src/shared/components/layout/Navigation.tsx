import React, { FormEvent, useState } from 'react';
import classes from './Navigation.module.scss';

const Header: React.FC = () => {
	const [loginForm, setLoginForm] = useState(false);
	const [signUpForm, setSignUpForm] = useState(false);

	const [loginFormInputs, setLoginFormInputs] = useState({
		email: '',
		password: '',
	});

	const [signupFormInputs, setSignUpFormInputs] = useState({
		email: '',
		password: '',
	});

	const loginBtnHandler = () => {
		setSignUpForm(false);
		setLoginForm(true);
	};

	const signUpBtnHandler = () => {
		setLoginForm(false);
		setSignUpForm(true);
	};

	const loginFormHandler = (event: FormEvent) => {
		event.preventDefault();
	};

	const signupFormHandler = (event: FormEvent) => {
		event.preventDefault();
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.nav}>
				<button onClick={loginBtnHandler}>Login</button>
				<button onClick={signUpBtnHandler}>Sign Up</button>
			</div>
			{loginForm && (
				<form onSubmit={loginFormHandler} className={classes.form}>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' value={loginFormInputs.email}></input>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={loginFormInputs.password}
					></input>
					<button>Send</button>
				</form>
			)}
			{signUpForm && (
				<form onSubmit={signupFormHandler} className={classes.form}>
					<label htmlFor='email'>Email</label>
					<input type='email' id='email' value={signupFormInputs.email}></input>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						id='password'
						value={signupFormInputs.password}
					></input>
					<button>Send</button>
				</form>
			)}
		</div>
	);
};

export default Header;
