import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/store';

import { UserActionTypes } from '../../_shared/store/user';
import { EmailConfirmationActionTypes } from '../../_shared/store/email-confirmation';

import { useRequest } from '../../_shared/hooks/http-hook';

import NameForm from '../components/NameForm';
import PasswordForm from '../components/PasswordForm';

import TopArrow from '../../_shared/assets/icons/top-arrow.svg';

import classes from './Profile.module.scss';

const Profile: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [showEditProfile, setShowEditProfile] = useState(false);
	const [showChangeName, setShowChangeName] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [response, setResponse] = useState('');

	const editProfileHandler = () => {
		if (showEditProfile) {
			setShowChangePassword(false);
			setShowChangeName(false);
		}
		setShowEditProfile((prev) => !prev);
	};

	const showChangeNameHandler = () => {
		if (showChangePassword) {
			setShowChangePassword(false);
		}
		setShowChangeName((prev) => !prev);
	};

	const showChangePasswordHandler = () => {
		if (showChangeName) {
			setShowChangeName(false);
		}
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

	const logoutHandler = () => {
		dispatch({ type: UserActionTypes.LOG_OUT });
		dispatch({ type: EmailConfirmationActionTypes.HIDE });
		navigate('/');
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
			<Link to='/recap' className={classes.recap}>
				Recapitulatif de l'Année
			</Link>
			<div className={classes['edit-profile']}>
				<button
					className={`${classes['edit-profile__button']} ${
						showEditProfile && classes['edit-profile__button--open']
					}`}
					onClick={editProfileHandler}
				>
					<div
						className={`${classes['edit-profile__text']} ${
							showEditProfile && classes['edit-profile__text--open']
						}`}
					>
						Éditer mon profil
					</div>
					<img
						src={TopArrow}
						alt='Flêche'
						className={`${classes['edit-profile__img']} ${
							showEditProfile && classes['edit-profile__img--open']
						}`}
					/>
				</button>
				{showEditProfile && (
					<>
						<button
							className={classes['edit-button']}
							onClick={showChangeNameHandler}
						>
							Modifier Mon Nom
						</button>
						{showChangeName && (
							<NameForm
								setShowChangeName={showChangeNameHandler}
								setResponse={setResponseHandler}
							/>
						)}
						<button
							className={classes['edit-button']}
							onClick={showChangePasswordHandler}
						>
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
					</>
				)}
			</div>
			<button onClick={logoutHandler} className={classes['log-out']}>
				<img src='' alt='img' />
				<div className={classes['log-out__text']}>Déconnexion</div>
			</button>
			<h1>{response}</h1>
		</div>
	);
};

export default Profile;
