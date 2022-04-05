import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';

import { useInput, useInputTypes } from '../../../_shared/hooks/input-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../../_shared/components/FormElements/Input';
import FormWrapper, { FormWrapperTypes } from '../components/FormWrapper';

import successIcon from '../../../_shared/assets/imgs/icons/validated.svg';

import classes from './DeleteAccount.module.scss';

const DeleteAccount: React.FC = () => {
	const navigate = useNavigate();

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [submitted, setSubmitted] = useState(false);
	const [response, setResponse] = useState('');

	const confirmationPhrase = 'supprimer';

	const cancelHandler = () => {
		navigate('/profil');
	};

	const textValidationHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		if (confirmationInput.value.toLowerCase() === confirmationPhrase) {
			setConfirmationInput((prev) => ({ ...prev, isValid: true }));
		} else {
			setConfirmationInput((prev) => ({
				...prev,
				isValid: false,
				isTouched: true,
			}));
			return;
		}

		const responseData = await sendRequest(
			'http://localhost:8080/api/user-modify/delete-account',
			'PATCH',
			JSON.stringify({ id: userState.id })
		);

		setSubmitted(true);

		if (responseData.error) {
			setResponse(responseData.error);
			setSubmitted(true);
			return;
		}

		setResponse(responseData.message);

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
		<FormWrapper type={FormWrapperTypes.DELETE} title={'Suppression de compte'}>
			{!submitted && (
				<>
					<div className={classes.text}>
						Écrivez « SUPPRIMER » ci-dessous si vous souhaitez vraiment
						continuer.
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
					<div className={classes.buttons}>
						<button
							className={`${classes['buttons__button']} ${classes['buttons__button--cancel']}`}
							onClick={cancelHandler}
						>
							Annuler
						</button>
						<button
							className={`${classes['buttons__button']} ${classes['buttons__button--confirm']}`}
							onClick={textValidationHandler}
						>
							Supprimer le compte
						</button>
					</div>
					<div className={classes.instructions}>
						Après avoir envoyé ce formulaire, vous recevrez un mail avec un
						lien sur lequel après avoir cliqué, votre suppression sera
						effective.
						{/* Après avoir envoyé ce formulaire, vous
				aurez 10 jours pour vous reconnecter à votre compte afin de le restaurer
				avant qu’il ne soit définitivement supprimé. */}
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
					<div className={classes.response__text}>{response}</div>
				</div>
			)}
		</FormWrapper>
	);
};

export default DeleteAccount;
