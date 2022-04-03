import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/store';

import { UserActionTypes } from '../../_shared/store/user';
import { EmailConfirmationActionTypes } from '../../_shared/store/email-confirmation';

import { useRequest } from '../../_shared/hooks/http-hook';
import { useUser } from '../../_shared/classes/user-hook';

import PasswordForm from '../components/PasswordForm';

import TopArrow from '../../_shared/assets/icons/top-arrow.svg';

import classes from './Profile.module.scss';

const Profile: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { User } = useUser();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [showEditProfile, setShowEditProfile] = useState(true);
	const [response, setResponse] = useState('');

	const editProfileHandler = () => {
		setShowEditProfile((prev) => !prev);
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
		User.logOut();
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
			<Link to='/graphique' className={classes.recap}>
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
						<Link
							to='/profil/modifier/image'
							className={classes['edit-button']}
						>
							Modifier Mon Image
						</Link>
						<Link
							to='/profil/modifier/nom'
							className={classes['edit-button']}
						>
							Modifier Mon Nom
						</Link>
						<Link
							to='/profil/modifier/email'
							className={classes['edit-button']}
						>
							Modifier Mon Adresse Mail
						</Link>
						<Link
							to='/profil/modifier/motdepasse'
							className={classes['edit-button']}
						>
							Modifier Mon Mot de Passe
						</Link>
					</>
				)}
			</div>
			<button onClick={logoutHandler} className={classes['log-out']}>
				<img src='' alt='img' />
				<div className={classes['log-out__text']}>Déconnexion</div>
			</button>
		</div>
	);
};

export default Profile;
