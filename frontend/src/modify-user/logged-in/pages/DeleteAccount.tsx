import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import FormWrapper, { FormWrapperTypes } from '../components/FormWrapper';

import classes from './DeleteAccount.module.scss';

const DeleteAccount: React.FC = () => {
	const navigate = useNavigate();

	const [submitted, setSubmitted] = useState(false);

	const confirmationPhrase = 'supprimer';

	const cancelHandler = () => {
		navigate('/profil');
	};

	const textValidationHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (confirmationInput.value.toLowerCase() === confirmationPhrase) {
			setConfirmationInput((prev) => ({ ...prev, isValid: true }));
		} else {
			setConfirmationInput((prev) => ({
				...prev,
				isValid: false,
				isTouched: true,
			}));
		}

		setSubmitted(true);
	};

	const {
		input: confirmationInput,
		setInput: setConfirmationInput,
		inputOnChangeHandler: confirmationInputOnChangeHandler,
		inputOnBlurHandler: nconfirmationInputOnBlurHandler,
	} = useInput({
		type: useInputTypes.COMPARISON,
		validate: false,
		display: submitted,
		compareTo: confirmationPhrase.toLowerCase(),
	});

	return (
		<FormWrapper type={FormWrapperTypes.DELETE}>
			<div>Suppression de compte</div>
			<div>
				Écrivez « SUPPRIMER » ci-dessous si vous souhaitez vraiment continuer.
			</div>
			<Input
				styling={InputStyles.PROFILE_FORM}
				id='Nouveau Nom'
				type='text'
				placeholder='Écrivez "SUPPRIMER"'
				errorText='Écrivez "SUPPRIMER"'
				value={confirmationInput.value}
				isValid={confirmationInput.isValid}
				isTouched={confirmationInput.isTouched}
				onChange={confirmationInputOnChangeHandler}
				onBlur={nconfirmationInputOnBlurHandler}
			/>
			<div>
				<button onClick={cancelHandler}>Annuler</button>
				<button onClick={textValidationHandler}>Supprimer le compte</button>
			</div>
			<div>
				Après avoir envoyé ce formulaire, vous aurez 10 jours pour vous
				reconnecter à votre compte afin de le restaurer avant qu’il ne soit
				définitivement supprimé.
			</div>
		</FormWrapper>
	);
};

export default DeleteAccount;
