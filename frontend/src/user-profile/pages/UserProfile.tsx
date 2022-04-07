import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/_store';
import { EmailConfirmationPopUpActionTypes } from '../../_shared/store/pop-ups/email-confirmation-pop-up';

import { useUserClass } from '../../_shared/classes/user-class-hook';

import confirmedEmailIcon from '../../_shared/assets/imgs/icons/profile/profile-confirmed-email-arrow.svg';
import arrow from '../../_shared/assets/imgs/icons/arrow-bottom-purple.svg';
import recapIcon from '../../_shared/assets/imgs/icons/profile/profile-stats.svg';
import imageIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-image.svg';
import nameIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-name.svg';
import emailIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-email.svg';
import passwordIcon from '../../_shared/assets/imgs/icons/profile/profile-modify-password.svg';
import logOutIcon from '../../_shared/assets/imgs/icons/profile/profile-log-out.svg';

import LogOutConfirmation from '../components/LogOutConfirmation';
import UserIcon from '../../_shared/components/UserIcon/UserIcon';
import RoundedButton from '../../_shared/components/UIElements/RoundedButton';

import classes from './UserProfile.module.scss';

const Profile: React.FC = () => {
	const dispatch = useDispatch();

	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [showEditProfile, setShowEditProfile] = useState(true);
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

	const confirmEmailAddressHandler = () => {
		dispatch({
			type: EmailConfirmationPopUpActionTypes.SHOW_EMAIL_CONFIRMATION_POP_UP,
		});
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.user}>
				<UserIcon className={classes.user__img} icon={User.getInfo().icon} />
				<div className={classes.user__name}>{userState.name}</div>
			</div>
			{!userState.confirmedEmail && (
				<button
					className={classes['confirmed-email']}
					onClick={confirmEmailAddressHandler}
				>
					Adresse mail non confirmée
					<img src={confirmedEmailIcon} alt='Confirmer adresse mail' />
				</button>
			)}
			<RoundedButton
				text={'Voir mes statistiques'}
				link='/graphique'
				onClick={confirmEmailAddressHandler}
				className={classes.recap}
			>
				<img src={recapIcon} alt='Stats' className={classes.recap__img} />
			</RoundedButton>
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
