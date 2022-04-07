import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { UIElementsActionTypes } from '../../_shared/store/ui-elements';

import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';
import { useRequest } from '../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../_shared/components/FormElements/Input';
import RoundedButton from '../../_shared/components/UIElements/RoundedButton';
import PopUp, { PopUpTypes } from '../../_shared/components/UIElements/PopUp';

import successIcon from '../../_shared/assets/imgs/icons/validated.svg';

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

		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user-modify/forgot-password/${forgotPasswordEmailInput.value}`,
			'GET',
			null
		);

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

	const closePopUp = () => {
		dispatch({ type: UIElementsActionTypes.HIDE_OVERLAY });
		dispatch({ type: UIElementsActionTypes.HIDE_FORGOT_PASSWORD_FORM });
	};

	return (
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
		</PopUp>
	);
};

export default ForgotPassword;
