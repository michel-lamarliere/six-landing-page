import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../components/EditProfileFormWrapper';

import successIcon from '../../../_shared/assets/imgs/icons/success.svg';

import classes from './ChangeEmail.module.scss';

const ChangeEmail: React.FC = () => {
	const { sendRequest } = useRequest();
	const userState = useSelector((state: RootState) => state.user);

	const [response, setResponse] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [sent, setSent] = useState(false);
	const [inputErrorText, setInputErrorText] = useState('');

	const {
		input: newEmailInput,
		setInput: setNewEmailInput,
		inputOnChangeHandler: newEmailOnChangeHandler,
		inputOnBlurHandler: newEmailOnBlurHandler,
	} = useInput({ type: useInputTypes.EMAIL, validate: true, display: sent });

	const submitHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		setSent(true);

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

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/email`,
			method: 'PATCH',
			body: JSON.stringify({
				oldEmail: userState.email,
				newEmail: newEmailInput.value,
			}),
		});

		if (responseData.used) {
			setNewEmailInput((prev) => ({ ...prev, isValid: false }));
			setInputErrorText(responseData.message);
			return;
		}

		setResponse(responseData.message);

		setSubmitted(true);
	};

	return (
		<EditProfileFormWrapper
			type={EditProfileFormWrapperTypes.MODIFY}
			title={'Adresse mail'}
			displaySubmitButton={!submitted}
			button_onClick={submitHandler}
			response={response}
		>
			{!submitted && (
				<>
					<div className={classes.wrapper}>
						<div className={classes.label}>Adresse mail actuelle:</div>
						<div className={classes.email}>{userState.email}</div>
					</div>
					<Input
						styling={InputStyles.PROFILE_FORM}
						id={'email'}
						type={'email'}
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
				</>
			)}

			{submitted && (
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
