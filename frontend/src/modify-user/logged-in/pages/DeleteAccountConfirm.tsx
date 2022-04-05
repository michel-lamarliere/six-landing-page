import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUser } from '../../../_shared/classes/user-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import classes from './DeleteAccountConfirm.module.scss';

const DeleteAccountConfirm: React.FC = () => {
	const { email, code } = useParams();
	const { User } = useUser();

	const { sendRequest } = useRequest();

	const [response, setResponse] = useState('');

	const deleteAccountHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user-modify/delete-account/confirmation',
			'DELETE',
			JSON.stringify({
				email,
				code,
			})
		);

		if (responseData.error) {
			setResponse(responseData.error);
			return;
		}

		User.logOut();
	};

	useEffect(() => {
		deleteAccountHandler();
	}, []);

	return <div>{response}</div>;
};

export default DeleteAccountConfirm;
