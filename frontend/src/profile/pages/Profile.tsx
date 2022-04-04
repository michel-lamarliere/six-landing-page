import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/_store';

import { useRequest } from '../../_shared/hooks/http-hook';
import { useUser } from '../../_shared/classes/user-hook';

import confirmedEmailIcon from '../../_shared/assets/imgs/icons/profile/profile-confirmed-email-arrow.svg';
import arrow from '../../_shared/assets/imgs/icons/arrow-bottom-purple.svg';
import userIcon from '../../_shared/assets/imgs/icons/user-icon.svg';
import recapIcon from '../../_shared/assets/imgs/icons/profile/profile-stats.svg';
import imageIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-image.svg';
import nameIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-name.svg';
import emailIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-email.svg';
import passwordIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-password.svg';
import logOutIcon from '../../_shared/assets/imgs/icons/profile/profile-log-out.svg';

import classes from './Profile.module.scss';
import LogOutConfirmation from '../components/LogOutConfirmation';

const Profile: React.FC = () => {
	const { User } = useUser();
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [showEditProfile, setShowEditProfile] = useState(true);
	const [response, setResponse] = useState('');
	const [promptLogOut, setPromptLogOut] = useState(false);

	const editProfileHandler = () => {
		setShowEditProfile((prev) => !prev);
	};

	const promptLogOutHandler = () => {
		setPromptLogOut(true);
	};

	const removeLogOutPrompt = () => {
		setPromptLogOut(false);
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
			<div className={classes.user}>
				<img src={userIcon} alt='Utilisateur' className={classes.user__img} />
				<div className={classes.user__name}>{userState.name}</div>
			</div>
			{!userState.confirmedEmail && (
				<button className={classes['confirmed-email']}>
					Adresse mail non confirmée
					<img src={confirmedEmailIcon} alt='Confirmer adresse mail' />
				</button>
			)}
			<Link to='/graphique' className={classes.recap}>
				Voir mes statistiques
				<img src={recapIcon} alt='Stats' className={classes.recap__img} />
			</Link>
			<div className={classes['edit-profile']}>
				<button
					className={`${classes['edit-profile__button']} ${
						showEditProfile && classes['edit-profile__button--open']
					}`}
					onClick={editProfileHandler}
				>
					<div className={classes['edit-profile__text']}>Éditer le profil</div>
					<img
						src={arrow}
						alt='Flêche'
						className={`${classes['edit-profile__img']} ${
							!showEditProfile && classes['edit-profile__img--closed']
						}`}
					/>
				</button>
				{showEditProfile && (
					<>
						<Link
							to='/profil/modifier/image'
							className={classes['edit-button']}
						>
							<img
								src={imageIcon}
								alt='Icône'
								className={classes['edit-button__img']}
							/>
							Image
						</Link>
						<Link
							to='/profil/modifier/nom'
							className={classes['edit-button']}
						>
							<img
								src={nameIcon}
								alt='Nom'
								className={classes['edit-button__img']}
							/>
							Nom
						</Link>
						<Link
							to='/profil/modifier/email'
							className={classes['edit-button']}
						>
							<img
								src={emailIcon}
								alt='Adresse mail'
								className={classes['edit-button__img']}
							/>
							Adresse Mail
						</Link>
						<Link
							to='/profil/modifier/mot-de-passe'
							className={classes['edit-button']}
						>
							<img
								src={passwordIcon}
								alt='Mot de passe'
								className={classes['edit-button__img']}
							/>
							Mot de Passe
						</Link>
						<Link
							to='/profil/modifier/supprimer-compte'
							className={classes['delete-button']}
						>
							Supprimer mon compte
						</Link>
					</>
				)}
			</div>
			<button onClick={promptLogOutHandler} className={classes['log-out']}>
				<img src={logOutIcon} alt='Déconnexion' />
				<div className={classes['log-out__text']}>Déconnexion</div>
			</button>
			{promptLogOut && (
				<LogOutConfirmation cancelLogOutHandler={removeLogOutPrompt} />
			)}
		</div>
	);
};

export default Profile;
