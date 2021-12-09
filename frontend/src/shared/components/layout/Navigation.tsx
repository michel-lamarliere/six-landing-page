import React, { FormEvent, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import classes from './Navigation.module.scss';

const Header: React.FC = () => {
	const [loginForm, setLoginForm] = useState(false);
	const [signUpForm, setSignUpForm] = useState(false);

	const [loginFormInputs, setLoginFormInputs] = useState({
		name: '',
		email: '',
	});

	const [signupFormInputs, setSignupFormInputs] = useState({
		name: '',
		email: '',
	});

	const loginNameRef = useRef<HTMLInputElement | null>(null);
	const loginEmailRef = useRef<null | HTMLInputElement>(null);

	const signupNameRef = useRef<HTMLInputElement | null>(null);
	const signupEmailRef = useRef<null | HTMLInputElement>(null);

	const loginBtnHandler = () => {
		setSignUpForm(false);
		setLoginForm(true);
	};

	const signUpBtnHandler = () => {
		setLoginForm(false);
		setSignUpForm(true);
	};

	const loginPasswordOnChangeHandler = () => {
		if (loginNameRef.current !== null) {
			setLoginFormInputs((prev) => ({
				...prev,
				name: loginNameRef.current!.value,
			}));
		}
	};

	const loginEmailOnChangeHandler = () => {
		if (loginEmailRef.current !== null) {
			setLoginFormInputs((prev) => ({
				...prev,
				email: loginEmailRef.current!.value,
			}));
		}
	};

	const signUpPasswordOnChangeHandler = () => {
		if (signupNameRef.current !== null) {
			setSignupFormInputs((prev) => ({
				...prev,
				name: signupNameRef.current!.value,
			}));
		}
	};

	const signUpEmailOnChangeHandler = () => {
		if (signupEmailRef.current !== null) {
			setSignupFormInputs((prev) => ({
				...prev,
				email: signupEmailRef.current!.value,
			}));
		}
	};
	const loginFormHandler = (event: FormEvent) => {
		event.preventDefault();
		fetch('http://localhost:8080/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: loginFormInputs.name,
				email: loginFormInputs.email,
			}),
		});
	};

	const signupFormHandler = (event: FormEvent) => {
		event.preventDefault();
		fetch('http://localhost:8080/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: signupFormInputs.name,
				email: signupFormInputs.email,
			}),
		});
		setSignupFormInputs({ name: '', email: '' });
	};

	return (
		<div className={classes.wrapper}>
			<Link to='/users' />
			<div className={classes.nav}>
				<button onClick={loginBtnHandler}>Login</button>
				<button onClick={signUpBtnHandler}>Sign Up</button>
			</div>
			{loginForm && (
				<form onSubmit={loginFormHandler} className={classes.form}>
					<label htmlFor='name'>Name</label>
					<input
						type='tyep'
						id='name'
						ref={loginNameRef}
						value={loginFormInputs.name}
						onChange={loginPasswordOnChangeHandler}
					></input>
					<label htmlFor='email'>Email</label>
					<input
						type='text'
						id='email'
						ref={loginEmailRef}
						value={loginFormInputs.email}
						onChange={loginEmailOnChangeHandler}
					></input>

					<button>Send</button>
				</form>
			)}
			{signUpForm && (
				<form onSubmit={signupFormHandler} className={classes.form}>
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						id='name'
						value={signupFormInputs.name}
						ref={signupNameRef}
						onChange={signUpPasswordOnChangeHandler}
					></input>
					<label htmlFor='email'>Email</label>
					<input
						type='text'
						id='email'
						value={signupFormInputs.email}
						ref={signupEmailRef}
						onChange={signUpEmailOnChangeHandler}
					></input>
					<button>Send</button>
				</form>
			)}
		</div>
	);
};

export default Header;
