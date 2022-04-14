import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { PuffLoader } from 'react-spinners';

import { RootState } from '../../../../store/_store';

import { useInput, useInputTypes } from '../../../../hooks/input-hook';
import { useRequest } from '../../../../hooks/http-hook';

import Input, { InputStyles } from '../../../../components/form-elements/Input';
import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../../../../containers/EditUserContainer/EditUserContainer';

import successIcon from '../../../../assets//icons/success.svg';
import errorIcon from '../../../../assets//icons/error.svg';

import classes from './ChangeEmailPage.module.scss';

const ChangeEmail: React.FC = () => {
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [formIsValid, setFormIsValid] = useState(false);
	const [gotResponse, setGotResponse] = useState(false);
	const [inputErrorText, setInputErrorText] = useState('');

	const {
		input: newEmailInput,
		setInput: setNewEmailInput,
		inputOnChangeHandler: newEmailOnChangeHandler,
		inputOnBlurHandler: newEmailOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: true, display: submitted });

	const submitHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		setSubmitted(true);

		if (!newEmailInput.isValid) {
			setInputErrorText('Format invalide.');
			return;
		}

		if (newEmailInput.value === userState.email) {
			setNewEmailInput((prev) => ({ ...prev, isValid: false }));
			setInputErrorText(
				"Votre nouvelle adresse mail ne peut pas être identique à l'actuelle."
			);

			return;
		}

		setFormIsValid(true);

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/email`,
			method: 'PATCH',
			body: JSON.stringify({
				oldEmail: userState.email,
				newEmail: newEmailInput.value,
			}),
		});

		setGotResponse(true);

		if (responseData.used) {
			setNewEmailInput((prev) => ({ ...prev, isValid: false }));
			setInputErrorText(responseData.message);
			// setGotResponse(false);
			return;
		}

		setResponse(responseData.message);

		setFormIsValid(false);
	};

	return (
		<EditProfileFormWrapper
			formAction={submitHandler}
			type={EditProfileFormWrapperTypes.MODIFY}
			title={'Adresse mail'}
			displaySubmitButton={!gotResponse}
			response={response}
		>
			{!gotResponse && (
				<>
					<div className={classes.wrapper}>
						<div className={classes.label}>Adresse mail actuelle:</div>
						<div className={classes.email}>{userState.email}</div>
					</div>
					<Input
						styling={InputStyles.BLACK_FORM}
						id={'email'}
						type={'text'}
						placeholder={'Nouvelle adresse mail'}
						value={newEmailInput.value}
						errorText={inputErrorText}
						isValid={newEmailInput.isValid}
						isTouched={newEmailInput.isTouched}
						onChange={newEmailOnChangeHandler}
						onBlur={newEmailOnBlurHandler}
					/>
					<div className={classes.instructions}>
						Après avoir envoyé ce formulaire, vous recevrez un mail sur
						l'ancienne adresse mail et un autre sur la nouvelle avec un lien
						permettant de confirmer le changement.
					</div>
					{formIsValid && !gotResponse && (
						<PuffLoader color={'#1cc1e6'} size={'30px'} />
					)}
				</>
			)}
			{gotResponse && (
				<div className={classes.response}>
					<img
						src={successIcon}
						alt='Succès'
						className={classes.response__img}
					/>
				</div>
			)}
		</EditProfileFormWrapper>
	);
};

export default ChangeEmail;
