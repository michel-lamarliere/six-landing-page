import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUserClass } from '../../_shared/classes/user-class-hook';
import { useRequest } from '../../_shared/hooks/http-hook';

const DeleteAccountConfirm: React.FC = () => {
	const { email, code } = useParams();
	const { User } = useUserClass();

	const { sendRequest } = useRequest();

	const [response, setResponse] = useState('');

	const deleteAccountHandler = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/delete-account/confirmation`,
			method: 'DELETE',
			body: JSON.stringify({
				email,
				code,
			}),
		});

		if (responseData.error) {
			setResponse(responseData.message);
			return;
		}

		User.logOut({ redirect: true });
	};

	useEffect(() => {
		deleteAccountHandler();
	}, []);

	return <div>{response}</div>;
};

export default DeleteAccountConfirm;
