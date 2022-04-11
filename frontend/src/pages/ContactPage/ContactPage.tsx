import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/_store';

import { useInput, useInputTypes } from '../../hooks/input-hook';
import { useRequest } from '../../hooks/http-hook';

import RoundedButton from '../../components/buttons/RoundedButton/RoundedButton';
import Input, { InputStyles } from '../../components/form-elements/Input';

import successIcon from '../../assets/icons/success.svg';

import classes from './ContactPage.module.scss';

const Contact: React.FC = () => {
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [sent, setSent] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const {
		input: message,
		setInput: setMessage,
		inputOnChangeHandler: messageOnChangeHandler,
		inputOnBlurHandler: messageOnBlurHandler,
	} = useInput({ type: useInputTypes.NONE, validate: false });

	const submitHandler = async () => {
		if (message.value.trim().length < 10) {
			setMessage((prev) => ({ ...prev, isValid: false, isTouched: true }));
			return;
		}

		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/contact/message`,
			method: 'POST',
			body: JSON.stringify({
				email: userState.email,
				name: userState.name,
				message: message.value,
			}),
		});

		setMessage({ value: '', isValid: false, isTouched: false });

		setSent(true);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			setResponseMessage(responseData.message);
			return;
		}

		setResponseMessage(
			'Message envoyé. Nous ferons notre maximum afin de répondre le plus rapidement possible.'
		);

		setTimeout(() => {
			setSent(false);
		}, 5000);
	};

	return (
		<div className={classes.wrapper}>
			{!sent && (
				<>
					<div className={classes.title}>Un problème ? Une question ?</div>
					<Input
						styling={InputStyles.BASIC_FORM}
						id={'message'}
						placeholder={'Votre message'}
						type={'textarea'}
						value={message.value}
						errorText={'10 caractères minimum.'}
						isValid={message.isValid}
						isTouched={message.isTouched}
						onChange={messageOnChangeHandler}
						onBlur={messageOnBlurHandler}
					/>
					<RoundedButton
						text={'Envoyer'}
						className={classes['submit-button']}
						onClick={submitHandler}
					/>
				</>
			)}
			{sent && (
				<>
					<img src={successIcon} alt='Succès.' />
					<div className={classes['response-message']}>{responseMessage}</div>
				</>
			)}
		</div>
	);
};

export default Contact;
