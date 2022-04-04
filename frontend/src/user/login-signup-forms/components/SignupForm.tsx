import React, { useState } from 'react';

import { useRequest } from '../../../_shared/hooks/http-hook';
import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useUser } from '../../../_shared/classes/user-hook';

import FormContainer from './FormContainer';
import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';

import classes from './SignupForm.module.scss';

interface Props {
	switchFormHandler: () => void;
}

const SingupForm: React.FC<Props> = (props) => {
	const { sendRequest } = useRequest();
	const { User } = useUser();

	const [responseMessage, setResponseMessage] = useState('');

	const [sumbitted, setSubmitted] = useState(false);

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameOnChangeHandler,
		inputOnBlurHandler: nameOnBlurHandler,
	} = useInput({ type: useInputTypes.NAME, validate: true, display: sumbitted });

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: true, display: sumbitted });

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true, display: sumbitted });

	const {
		input: passwordConfirmationInput,
		setInput: setPasswordConfirmationInput,
		inputOnChangeHandler: passwordConfirmationOnChangeHandler,
		inputOnBlurHandler: passwordConfirmationOnBlurHandler,
	} = useInput({
		type: useInputTypes.PASSWORD_COMPARISON,
		validate: true,
		display: sumbitted,
		compareTo: passwordInput.value,
	});

	const checkFormIsValid = () => {
		if (
			!nameInput.isValid ||
			!emailInput.isValid ||
			!passwordInput.isValid ||
			!passwordConfirmationInput.isValid
		) {
			return false;
		}

		return true;
	};

	const signupFormHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		setSubmitted(true);
		const formIsValid = checkFormIsValid();

		if (!formIsValid) {
			return;
		}

		console.log(passwordConfirmationInput.value);

		const responseData = await sendRequest(
			'http://localhost:8080/api/user/signup',
			'POST',
			JSON.stringify({
				name: nameInput.value.trim().toLowerCase(),
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
				passwordConfirmation: passwordConfirmationInput.value,
			})
		);

		if (responseData.error) {
			setResponseMessage(responseData.error);
			return;
		}

		const user = new User(responseData);

		await user.logIn();
		setSubmitted(false);
	};

	return (
		<FormContainer
			formHandler={signupFormHandler}
			header_title={'Bienvenue !'}
			footer_text={'Déjà membre ?'}
			footer_text_link={'Connectez-vous !'}
			switchFormHandler={props.switchFormHandler}
			responseMessage={responseMessage}
		>
			<Input
				styling={InputStyles.BASIC_FORM}
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
			<Input
				styling={InputStyles.BASIC_FORM}
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
				styling={InputStyles.BASIC_FORM}
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
			<Input
				styling={InputStyles.BASIC_FORM}
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
			<button className={classes['submit-button']}>Inscription</button>
		</FormContainer>
	);
};

export default SingupForm;
