import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { ForgotPasswordPopUpActionTypes } from '../../../store/pop-ups/forgot-password-pop-up';
import { OverlayActionTypes } from '../../../store/overlay';

import { useInput, useInputTypes } from '../../../hooks/input-hook';
import { useRequest } from '../../../hooks/http-hook';

import Input, { InputStyles } from '../../form-elements/Input';
import RoundedButton from '../../buttons/RoundedButton/RoundedButton';
import PopUpContainer, {
	PopUpTypes,
} from '../../../containers/PopUpContainer/PopUpContainer';

import successIcon from '../../../assets/icons/success.svg';

import classes from './ForgotPasswordPopUp.module.scss';
import { PuffLoader } from 'react-spinners';

const ForgotPassword: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const [responseMessage, setResponseMessage] = useState('');
	const [inputErrorMessage, setInputErrorMessage] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [gotResponse, setGotResponse] = useState<any>({});

	const {
		input: forgotPasswordEmailInput,
		setInput: setForgotPasswordEmailInput,
		inputOnChangeHandler: forgotPasswordEmailOnChangeHandler,
		inputOnBlurHandler: forgotPasswordEmailOnBlurHandler,
	} = useInput({ type: useInputTypes.PASSWORD, validate: true });

	const sendEmailForgotPassword = async (event: React.FormEvent) => {
		event.preventDefault();

		setSubmitted(true);

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
			setGotResponse(responseData);
			return;
		}

		setGotResponse(responseData);
		setResponseMessage(responseData.message);
		setSubmitted(false);
	};

	const closePopUp = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		dispatch({ type: ForgotPasswordPopUpActionTypes.HIDE_FORGOT_PASSWORD_POP_UP });
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
	};

	return ReactDOM.createPortal(
		<PopUpContainer
			type={PopUpTypes.CONFIRM_EMAIL_ADDRESS}
			closePopUp={closePopUp}
			displayNextMessage={gotResponse.success}
		>
			{!gotResponse.success && (
				<form onSubmit={sendEmailForgotPassword} className={classes.form}>
					<div className={classes.text}>
						Veuillez saisir votre adresse mail et nous vous enverrons les
						instructions.
					</div>
					<Input
						styling={InputStyles.PURPLE_FORM}
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
					{submitted && !gotResponse.error && !gotResponse.success && (
						<PuffLoader color={'#1cc1e6'} size={'30px'} />
					)}
					<RoundedButton
						text={'Envoyer'}
						type='submit'
						className={classes['submit-button']}
					/>
				</form>
			)}
			{gotResponse.success && (
				<>
					<img src={successIcon} alt='Succès' />
					<div className={classes['text-sent']}>{responseMessage}</div>
				</>
			)}
		</PopUpContainer>,
		document.getElementById('forgot-password-pop-up')!
	);
};

export default ForgotPassword;
