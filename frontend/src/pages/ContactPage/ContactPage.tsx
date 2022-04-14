import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/_store';

import { useInput, useInputTypes } from '../../hooks/input-hook';
import { useRequest } from '../../hooks/http-hook';

import { useUserClass } from '../../classes/user-class-hook';

import RoundedButton from '../../components/buttons/RoundedButton/RoundedButton';
import Input, { InputStyles } from '../../components/form-elements/Input';

import successIcon from '../../assets/icons/success.svg';
import backButtonIcon from '../../assets/icons/back-button.svg';

import classes from './ContactPage.module.scss';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
	const { sendRequest } = useRequest();

	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [sent, setSent] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	// const [formIsValid, setFormIsValid] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameInputOnChangeHandler,
		inputOnBlurHandler: nameInputOnBlurHandler,
	} = useInput({ type: useInputTypes.NAME, validate: true, display: submitted });

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailInputOnChangeHandler,
		inputOnBlurHandler: emailInputOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: true, display: submitted });

	const {
		input: messageInput,
		setInput: setMessageInput,
		inputOnChangeHandler: messageInputOnChangeHandler,
		inputOnBlurHandler: messageInputOnBlurHandler,
	} = useInput({ type: useInputTypes.MESSAGE, validate: true, display: submitted });

	const resetForm = () => {
		setNameInput({ value: '', isValid: false, isTouched: false });
		setEmailInput({ value: '', isValid: false, isTouched: false });
		setMessageInput({ value: '', isValid: false, isTouched: false });
	};

	const validateForm = () => {
		setSubmitted(true);

		console.log(messageInput.isValid);

		if (User.isLoggedIn()) {
			if (!messageInput.isValid) {
				return false;
			}
		} else {
			if (!messageInput.isValid || !nameInput.isValid || !emailInput.isValid) {
				return false;
			}
		}

		return true;
	};

	const submitHandler = async (event: any) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/contact/message`,
			method: 'POST',
			body: JSON.stringify({
				email: User.isLoggedIn() ? userState.email : emailInput.value,
				name: User.isLoggedIn() ? userState.name : nameInput.value,
				message: messageInput.value,
				loggedIn: User.isLoggedIn() ? true : false,
			}),
		});

		setSent(true);

		if (!responseData) {
			return;
		}

		resetForm();

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		setResponseMessage(
			'Message envoyé. Nous ferons notre maximum afin de répondre le plus rapidement possible.'
		);

		setTimeout(() => {
			setSent(false);
		}, 5000);
	};

	return (
		<div className={classes.wrapper}>
			{!User.isLoggedIn() && (
				<Link to='/' className={classes['back-button']}>
					<img src={backButtonIcon} alt='Retour' />
				</Link>
			)}
			{!sent && (
				<>
					<div className={classes.title}>Un problème ? Une question ?</div>
					<form onSubmit={submitHandler} className={classes.form}>
						{!User.isLoggedIn() && (
							<>
								<Link to='/' className={classes['back-button']}>
									<img src={backButtonIcon} alt='Retour' />
								</Link>
								<Input
									styling={InputStyles.BLACK_FORM}
									id={'nom'}
									placeholder={'Votre nom'}
									type={'text'}
									value={nameInput.value}
									errorText={'2 caractères minimum.'}
									isValid={nameInput.isValid}
									isTouched={nameInput.isTouched}
									onChange={nameInputOnChangeHandler}
									onBlur={nameInputOnBlurHandler}
								/>
								<Input
									styling={InputStyles.BLACK_FORM}
									id={'adresse mail'}
									placeholder={'Votre adresse mail'}
									type={'text'}
									value={emailInput.value}
									errorText={'Format invalide.'}
									isValid={emailInput.isValid}
									isTouched={emailInput.isTouched}
									onChange={emailInputOnChangeHandler}
									onBlur={emailInputOnBlurHandler}
								/>
							</>
						)}
						<Input
							styling={InputStyles.BLACK_FORM}
							id={'message'}
							placeholder={'Votre message'}
							type={'textarea'}
							value={messageInput.value}
							errorText={'10 caractères minimum.'}
							isValid={messageInput.isValid}
							isTouched={messageInput.isTouched}
							onChange={messageInputOnChangeHandler}
							onBlur={messageInputOnBlurHandler}
						/>
						<RoundedButton
							type='submit'
							text={'Envoyer'}
							className={classes['submit-button']}
							// onClick={submitHandler}
						/>
					</form>
				</>
			)}
			{sent && (
				<>
					<img src={successIcon} alt='Succès.' />
					<div className={classes['response-message']}>{responseMessage}</div>
				</>
			)}
		</div>
	);
};

export default Contact;
