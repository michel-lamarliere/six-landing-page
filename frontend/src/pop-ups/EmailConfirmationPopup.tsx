import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../_shared/store/store';
import { EmailConfirmationActionTypes } from '../_shared/store/email-confirmation';

import { useRequest } from '../_shared/hooks/http-hook';

import classes from './EmailConfirmationPopup.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [sent, setSent] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const resendEmailConfirmationHandler = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/email/email-confirmation',
			'POST',
			JSON.stringify({ id: userState.id })
		);

		console.log(responseData);

		if (responseData.error) {
			setResponseMessage(responseData.error);
		} else if (responseData.success) {
			setResponseMessage(responseData.success);
		}

		setSent(true);

		setTimeout(() => {
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
		}, 5000);
	};

	const closePopup = () => {
		sessionStorage.setItem('showEmailConfirmationPopup', JSON.stringify(false));
		dispatch({ type: EmailConfirmationActionTypes.HIDE });
	};

	useEffect(() => {
		if (userState.confirmedEmail) {
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
		} else {
			dispatch({ type: EmailConfirmationActionTypes.SHOW });
		}
	}, [userState.confirmedEmail]);

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			{!sent ? (
				<>
					<h1 className={classes.title}>
						Votre adresse mail n'est pas confirmée.
					</h1>
					<button
						className={classes.text}
						onClick={resendEmailConfirmationHandler}
					>
						Renvoyer un mail
					</button>
				</>
			) : (
				<h1 className={classes.title}>{responseMessage}</h1>
			)}
			<button onClick={closePopup}>X</button>
		</div>,
		document.getElementById('email-confirmation-popup')!
	);
};

export default EmailPopup;
