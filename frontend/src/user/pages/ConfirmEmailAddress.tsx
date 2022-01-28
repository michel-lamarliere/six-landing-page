import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './ConfirmEmailAddress.module.scss';
import { useRequest } from '../../shared/hooks/http-hook';

const ConfirmEmailAddress: React.FC = () => {
	const { sendRequest } = useRequest();
	const { email, code } = useParams();

	const [response, setResponse] = useState();

	const confirmationHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/confirm/email',
			'PATCH',
			JSON.stringify({ email: email, code: code })
		);

		if (responseData.error) {
			setResponse(responseData.error);
			return;
		}

		setResponse(responseData.success);
	};

	useEffect(() => {
		confirmationHandler();
	}, []);

	return <div>{response}</div>;
};

export default ConfirmEmailAddress;
