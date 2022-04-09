import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AlertPopUpActionTypes } from '../../_shared/store/pop-ups/alert-pop-up';

import { useUserClass } from '../../_shared/classes/user-class-hook';
import { useRequest } from '../../_shared/hooks/http-hook';

const ChangeEmailConfirm: React.FC = () => {
	const dispatch = useDispatch();

	const { oldEmail, newEmail } = useParams();

	const { sendRequest } = useRequest();
	const { User } = useUserClass();

	const [response, setResponse] = useState('');

	const modifyEmailAdressHandler = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/user-modify/email/confirmation`,
			method: 'PATCH',
			body: JSON.stringify({
				oldEmail,
				newEmail,
			}),
		});

		if (responseData.error) {
			setResponse(responseData.message);
			return;
		}

		User.logOut({ redirect: true });

		dispatch({
			type: AlertPopUpActionTypes.SET_AND_SHOW_ALERT_POP_UP,
			message: responseData.message,
		});
	};

	useEffect(() => {
		modifyEmailAdressHandler();
	}, []);

	return <div>{response}</div>;
};

export default ChangeEmailConfirm;
