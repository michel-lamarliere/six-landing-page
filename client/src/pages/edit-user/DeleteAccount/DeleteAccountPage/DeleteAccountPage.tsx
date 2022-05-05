import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../../../store/_store';

import { useInput, useInputTypes } from '../../../../hooks/input-hook';
import { useRequest } from '../../../../hooks/http-hook';

import Input, { InputStyles } from '../../../../components/form-elements/Input';
import EditProfileFormWrapper, {
	EditProfileFormWrapperTypes,
} from '../../../../containers/EditUserContainer/EditUserContainer';
import RoundedButton from '../../../../components/buttons/RoundedButton/RoundedButton';

import successIcon from '../../../../assets/icons/success.svg';

import classes from './DeleteAccountPage.module.scss';

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

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/delete/account/send-email`,
			method: 'PATCH',
			body: JSON.stringify({ id: userState.id }),
		});

		setSubmitted(true);

		if (responseData.error) {
			setResponse(responseData.message);
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
		inputOnBlurHandler: confirmationInputOnBlurHandler,
	} = useInput({
		type: useInputTypes.COMPARISON,
		validate: false,
		display: submitted,
		compareTo: confirmationPhrase.toLowerCase(),
	});

	return (
		<EditProfileFormWrapper
			type={EditProfileFormWrapperTypes.DELETE}
			title={'Suppression de compte'}
		>
			{!submitted && (
				<>
					<div className={classes.text}>
						Écrivez « SUPPRIMER » ci-dessous si vous souhaitez vraiment
						continuer.
					</div>
					<Input
						styling={InputStyles.BLACK_FORM}
						id='Nouveau Nom'
						type='text'
						placeholder='Écrivez "SUPPRIMER"'
						errorText='Écrivez "SUPPRIMER"'
						value={confirmationInput.value}
						isValid={confirmationInput.isValid}
						isTouched={confirmationInput.isTouched}
						onChange={confirmationInputOnChangeHandler}
						onBlur={confirmationInputOnBlurHandler}
					/>
					<div className={classes.buttons}>
						<RoundedButton
							text={'Annuler'}
							onClick={cancelHandler}
							className={`${classes['buttons__button']} ${classes['buttons__button--cancel']}`}
						/>
						<RoundedButton
							type='submit'
							text={'Supprimer le compte'}
							onClick={textValidationHandler}
							className={`${classes['buttons__button']} ${classes['buttons__button--confirm']}`}
						/>
					</div>
					<div className={classes.instructions}>
						Après avoir envoyé ce formulaire, vous recevrez un mail avec un
						lien sur lequel après avoir cliqué, votre suppression sera
						effective.
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
		</EditProfileFormWrapper>
	);
};

export default DeleteAccount;
