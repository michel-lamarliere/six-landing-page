import React, { useState } from 'react';

import { useRequest } from '../../../hooks/http-hook';
import { useInput, useInputTypes } from '../../../hooks/input-hook';

import { useUserClass } from '../../../classes/user-class-hook';

import FormContainer from '../FormContainer/FormContainer';
import Input, { InputStyles } from '../../../components/form-elements/Input';
import RoundedButton from '../../../components/buttons/RoundedButton/RoundedButton';

interface Props {
	switchFormHandler: () => void;
}

const SingupForm: React.FC<Props> = (props) => {
	const { sendRequest } = useRequest();
	const { User } = useUserClass();

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
		type: useInputTypes.COMPARISON,
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

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/sign-up`,
			method: 'POST',
			body: JSON.stringify({
				name: nameInput.value.trim().toLowerCase(),
				email: emailInput.value.trim().toLowerCase(),
				password: passwordInput.value,
				passwordConfirmation: passwordConfirmationInput.value,
			}),
		});

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		User.logIn(responseData);
		setSubmitted(false);
	};

	return (
		<FormContainer
			formHandler={signupFormHandler}
			headerTitle={'Bienvenue !'}
			footerText={'Déjà membre ?'}
			footerTextLink={'Connectez-vous !'}
			switchFormHandler={props.switchFormHandler}
			responseMessage={responseMessage}
		>
			<Input
				styling={InputStyles.PURPLE_FORM}
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
				styling={InputStyles.PURPLE_FORM}
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
				styling={InputStyles.PURPLE_FORM}
				id='mot de passe'
				type='password'
				placeholder='Mot de passe'
				value={passwordInput.value}
				isValid={passwordInput.isValid}
				isTouched={passwordInput.isTouched}
				errorText='8 caractères minimum dont 1 minuscle, 1 majuscule, 1 chiffre et un caractère spécial.'
				onChange={passwordOnChangeHandler}
				onBlur={passwordOnBlurHandler}
			/>
			<Input
				styling={InputStyles.PURPLE_FORM}
				id='mot de passe'
				type='password'
				placeholder='Confirmation mot de passe'
				value={passwordConfirmationInput.value}
				isValid={passwordConfirmationInput.isValid}
				isTouched={passwordConfirmationInput.isTouched}
				errorText='Les mots de passe ne sont pas indentiques.'
				onChange={passwordConfirmationOnChangeHandler}
				onBlur={passwordConfirmationOnBlurHandler}
			/>
			<RoundedButton text={'Inscription'} />
		</FormContainer>
	);
};

export default SingupForm;
