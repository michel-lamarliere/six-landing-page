import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { ForgotPasswordPopUpActionTypes } from '../../../../store/pop-ups/forgot-password-pop-up';
import { OverlayActionTypes } from '../../../../store/overlay';

import { useInput, useInputTypes } from '../../../../hooks/input-hook';
import { useRequest } from '../../../../hooks/http-hook';

import Input, { InputStyles } from '../../../form-elements/Input';
import RoundedButton from '../../../buttons/RoundedButton/RoundedButton';
import PopUp, { PopUpTypes } from '../PopUpContainer/PopUpContainer';

import successIcon from '../../../../assets/icons/success.svg';

import classes from './ForgotPasswordPopUp.module.scss';

const ForgotPassword: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const [responseMessage, setResponseMessage] = useState('');
	const [inputErrorMessage, setInputErrorMessage] = useState('');
	const [sent, setSent] = useState(false);

	const {
		input: forgotPasswordEmailInput,
		setInput: setForgotPasswordEmailInput,
		inputOnChangeHandler: forgotPasswordEmailOnChangeHandler,
		inputOnBlurHandler: forgotPasswordEmailOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true });

	const sendEmailForgotPassword = async (event: React.FormEvent) => {
		event.preventDefault();

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/forgot-password/${forgotPasswordEmailInput.value}`,
			method: 'GET',
		});

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			setInputErrorMessage(responseData.message);
			setForgotPasswordEmailInput((prev) => ({
				...prev,
				isValid: false,
				isTouched: true,
			}));
			return;
		}

		setSent(true);
		setResponseMessage(responseData.message);
	};

	const closePopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		// dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
		dispatch({ type: ForgotPasswordPopUpActionTypes.HIDE_FORGOT_PASSWORD_POP_UP });
	};

	return ReactDOM.createPortal(
		<PopUp
			type={PopUpTypes.CONFIRM_EMAIL_ADDRESS}
			closePopUp={closePopUp}
			displayNextMessage={sent}
		>
			{!sent ? (
				<>
					<div className={classes.text}>
						Veuillez saisir votre adresse mail et nous vous enverrons les
						instructions.
					</div>
					<Input
						styling={InputStyles.BASIC_FORM}
						id='Email'
						type='text'
						placeholder='jean@email.fr'
						value={forgotPasswordEmailInput.value}
						errorText={inputErrorMessage}
						isValid={forgotPasswordEmailInput.isValid}
						isTouched={forgotPasswordEmailInput.isTouched}
						onChange={forgotPasswordEmailOnChangeHandler}
						onBlur={forgotPasswordEmailOnBlurHandler}
					/>
					<RoundedButton
						text={'Envoyer'}
						onClick={sendEmailForgotPassword}
						className={classes['submit-button']}
					/>
				</>
			) : (
				<>
					<img src={successIcon} alt='Succès' />
					<div className={classes['text-sent']}>{responseMessage}</div>
				</>
			)}
		</PopUp>,
		document.getElementById('forgot-password-pop-up')!
	);
};

export default ForgotPassword;
