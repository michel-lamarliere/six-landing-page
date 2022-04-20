import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from '../../hooks/http-hook';

import errorIcon from '../../assets/icons/error.svg';
import successIcon from '../../assets/icons/success.svg';

import classes from './EmailAddressConfirmationPage.module.scss';

const ConfirmEmailAddress: React.FC = () => {
	const { sendRequest } = useRequest();

	const { email, code } = useParams();

	const [response, setResponse] = useState();
	const [responseIsError, setResponseIsError] = useState(false);

	const confirmationHandler = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user/confirm/email`,
			method: 'PATCH',
			body: JSON.stringify({ email: email, code: code }),
		});

		if (responseData.error) {
			setResponse(responseData.message);
			setResponseIsError(true);
			return;
		}

		setResponse(responseData.message);
	};

	useEffect(() => {
		confirmationHandler();
	}, []);

	return (
		<div className={classes.wrapper}>
			<img
				src={responseIsError ? errorIcon : successIcon}
				alt={`${responseIsError ? 'Erreur' : 'Succès'}`}
				className={classes.img}
			/>
			<h1 className={classes.text}>{response}</h1>
		</div>
	);
};

export default ConfirmEmailAddress;
