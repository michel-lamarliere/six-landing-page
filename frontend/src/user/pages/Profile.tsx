import React, { useEffect, useState } from 'react';
import classes from './Profile.module.scss';

import NameForm from '../components/NameForm';
import PasswordForm from '../components/PasswordForm';
import { RootState } from '../../shared/store/store';
import { useSelector } from 'react-redux';

const Profile: React.FC = () => {
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

	return (
		<div className={classes.wrapper}>
			<div>
				{userState.confirmedEmail
					? 'Adresse Mail Confirmée'
					: 'Adresse Email Non-Confirmée.'}
			</div>
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
