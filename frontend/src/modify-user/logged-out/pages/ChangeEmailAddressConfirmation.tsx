import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRequest } from '../../../_shared/hooks/http-hook';

import classes from './ConfirmedEmailAddress.module.scss';

const ConfirmEmailAddress: React.FC = () => {
	const { sendRequest } = useRequest();

	const { email, code } = useParams();

	const [response, setResponse] = useState();

	const confirmationHandler = async () => {
		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user/confirm/email`,
			'PATCH',
			JSON.stringify({ email: email, code: code })
		);

		if (responseData.error) {
			setResponse(responseData.message);
			return;
		}

		setResponse(responseData.message);
	};

	useEffect(() => {
		confirmationHandler();
	}, []);

	return <div>{response}</div>;
};

export default ConfirmEmailAddress;
