import React from 'react';

import { useRequest } from '../../_shared/hooks/http-hook';
import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';
import { useUser } from '../../_shared/hooks/user-hook';

import FormContainer from './FormContainer';
import Input from '../../_shared/components/FormElements/Input';

import classes from './SignupForm.module.scss';

interface Props {
	switchFormHandler: () => void;
}

const SingupForm: React.FC<Props> = (props) => {
	const { sendRequest } = useRequest();
	const { User } = useUser();

	const {
		input: nameInput,
		setInput: setNameInput,
		inputOnChangeHandler: nameOnChangeHandler,
		inputOnBlurHandler: nameOnBlurHandler,
	} = useInput(useInputTypes.NAME);

	const {
		input: emailInput,
		setInput: setEmailInput,
		inputOnChangeHandler: emailOnChangeHandler,
		inputOnBlurHandler: emailOnBlurHandler,
	} = useInput(useInputTypes.EMAIL);

	const {
		input: passwordInput,
		setInput: setPasswordInput,
		inputOnChangeHandler: passwordOnChangeHandler,
		inputOnBlurHandler: passwordOnBlurHandler,
	} = useInput(useInputTypes.PASSWORD);

	const {
		input: passwordConfirmationInput,
		setInput: setPasswordConfirmationInput,
		inputOnChangeHandler: passwordConfirmationOnChangeHandler,
		inputOnBlurHandler: passwordConfirmationOnBlurHandler,
	} = useInput(useInputTypes.PASSWORD_COMPARISON, passwordInput.value);

	const signupFormHandler = async (event: React.FormEvent) => {
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
			// setResponseMessage(responseData.error);
			console.log('erreur');
			return;
		}

		const user = new User(responseData);

		console.log(user);

		// logInUser(responseData);
	};

	return (
		<FormContainer
			formHandler={signupFormHandler}
			header_title={'Bienvenue !'}
			footer_text={'Déjà membre ?'}
			footer_text_link={'Connectez-vous !'}
			switchFormHandler={props.switchFormHandler}
		>
			<Input
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
