import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useUser } from '../../../_shared/classes/user-hook';
import { useRequest } from '../../../_shared/hooks/http-hook';

import classes from './ChangeEmailConfirm.module.scss';

const ChangeEmailConfirm: React.FC = () => {
	const { oldEmail, newEmail } = useParams();

	const { sendRequest } = useRequest();
	const { User } = useUser();

	const [response, setResponse] = useState('');

	const modifyEmailAdressHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user-modify/email/confirmation',
			'PATCH',
			JSON.stringify({
				oldEmail,
				newEmail,
			})
		);

		if (responseData.error) {
			setResponse(responseData.error);
			return;
		}

		console.log('done');

		User.logOut();
	};

	useEffect(() => {
		modifyEmailAdressHandler();
	}, []);

	return <div>{response}</div>;
};

export default ChangeEmailConfirm;
