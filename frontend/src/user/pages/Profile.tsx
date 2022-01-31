import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useRequest } from '../../shared/hooks/http-hook';

import NameForm from '../components/NameForm';
import PasswordForm from '../components/PasswordForm';
import { RootState } from '../../shared/store/store';

import classes from './Profile.module.scss';
import { EmailConfirmationActionTypes } from '../../shared/store/email-confirmation';

const Profile: React.FC = () => {
	const { sendRequest } = useRequest();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [showChangeName, setShowChangeName] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [response, setResponse] = useState('');

	const showChangeNameHandler = () => {
		setShowChangeName((prev) => !prev);
	};

	const showChangePasswordHandler = () => {
		setShowChangePassword((prev) => !prev);
	};

	const setResponseHandler = (message: string) => {
		setResponse(message);

		setTimeout(() => {
			setResponse('');
		}, 3000);
	};

	const resendEmail = async () => {
		const responseData = await sendRequest(
			'http://localhost:8080/api/user/email/email-confirmation',
			'POST',
			JSON.stringify({ id: userState.id })
		);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			setResponse(responseData.error);
		} else if (responseData.success) {
			setResponse(responseData.success);
		}

		setTimeout(() => {
			setResponse('');
		}, 5000);
	};

	return (
		<div className={classes.wrapper}>
			<div>
				{userState.confirmedEmail ? (
					<p>Adresse Mail Confirmée</p>
				) : (
					<>
						<p>Adresse Mail Non Confirmée</p>
						<button onClick={resendEmail}>
							Renvoyer un mail de confirmation.
						</button>
					</>
				)}
			</div>
			<Link to='/recap'>Recapitulatif</Link>
			<button className={classes.button} onClick={showChangeNameHandler}>
				Modifier Mon Nom
			</button>
			{showChangeName && (
				<NameForm
					setShowChangeName={showChangeNameHandler}
					setResponse={setResponseHandler}
				/>
			)}
			<button className={classes.button} onClick={showChangePasswordHandler}>
				Modifier Mon Mot de Passe
			</button>
			{showChangePassword && (
				<>
					<PasswordForm
						setShowChangePassword={showChangePasswordHandler}
						setResponse={setResponseHandler}
					/>
					<h1>Tester1@</h1>
				</>
			)}
			<h1>{response}</h1>
		</div>
	);
};

export default Profile;
