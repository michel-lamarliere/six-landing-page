import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/store';

import { useInput, useInputTypes } from '../../_shared/hooks/input-hook';
import { useRequest } from '../../_shared/hooks/http-hook';

import Input, { InputStyles } from '../../_shared/components/FormElements/Input';

import CloseIcon from '../../_shared/assets/icons/close.svg';

import classes from './ForgotPassword.module.scss';
import { UIElementsActionTypes } from '../../_shared/store/ui-elements';

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
			`http://localhost:8080/api/user_modify/email/forgot-password/${forgotPasswordEmailInput.value}`,
			'GET',
			null
		);

		console.log(responseData);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			// setResponseMessage(responseData.error);
			setInputErrorMessage(responseData.error);
			setForgotPasswordEmailInput((prev) => ({
				...prev,
				isValid: false,
				isTouched: true,
			}));
			return;
		}

		setSent(true);
		setResponseMessage(responseData.success);
	};

	const closeButtonHandler = (event: React.FormEvent) => {
		event.preventDefault();
		dispatch({ type: UIElementsActionTypes.HIDE_OVERLAY });
		dispatch({ type: UIElementsActionTypes.HIDE_FORGOT_PASSWORD_FORM });
	};

	return (
		<div className={classes.wrapper}>
			<button onClick={closeButtonHandler} className={classes['close-button']}>
				<img src={CloseIcon} alt='fermer' />
			</button>
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
					<div>{responseMessage}</div>
					<button
						onClick={sendEmailForgotPassword}
						className={classes['submit-button']}
					>
						Envoyer
					</button>
				</>
			) : (
				<>
					<div className={classes['text-sent']}>
						Un mail vient de vous être envoyé. Veuillez vérifier votre boîte
						mail.
					</div>
				</>
			)}
		</div>
	);
};

export default ForgotPassword;
