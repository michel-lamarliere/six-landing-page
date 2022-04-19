import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';
import { EmailConfirmationPopUpActionTypes } from '../../../store/pop-ups/email-confirmation-pop-up';
import { OverlayActionTypes } from '../../../store/overlay';

import { useUserClass } from '../../../classes/user-class-hook';

import UserProfileEditButton from '../UserProfileEditButton/UserProfileEditButton';
import LogOutConfirmation from '../../../components/pop-ups/LogOutConfirmation/LogOutConfirmation';
import UserIcon from '../../../components/UserIcon/UserIcon';
import RoundedButton from '../../../components/buttons/RoundedButton/RoundedButton';

import confirmedEmailIcon from '../../../assets/icons/profile/profile-confirmed-email-arrow.svg';
import arrowIcon from '../../../assets/icons/arrow-bottom-purple.svg';
import recapIcon from '../../../assets/icons/profile/profile-stats.svg';
import imageIcon from '../../../assets/icons/profile/profile-modify-image.svg';
import nameIcon from '../../../assets/icons/profile/profile-modify-name.svg';
import emailIcon from '../../../assets/icons/profile/profile-modify-email.svg';
import passwordIcon from '../../../assets/icons/profile/profile-modify-password.svg';
import logOutIcon from '../../../assets/icons/profile/profile-log-out.svg';

import classes from './UserProfilePage.module.scss';
import { LogOutConfirmationPopUpActionTypes } from '../../../store/pop-ups/log-out-confirmation-pop-up';

const Profile: React.FC = () => {
	const dispatch = useDispatch();

	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);
	const logOutConfirmationPopUpState = useSelector(
		(state: RootState) => state.logOutConfirmationPopUp
	);

	const [showEditProfile, setShowEditProfile] = useState(true);

	const editProfileHandler = () => {
		setShowEditProfile((prev) => !prev);
	};

	const promptLogOutHandler = () => {
		dispatch({
			type: LogOutConfirmationPopUpActionTypes.SHOW_LOG_OUT_CONFIRMATION_POP_UP,
		});
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	const confirmEmailAddressHandler = () => {
		dispatch({
			type: EmailConfirmationPopUpActionTypes.SHOW_EMAIL_CONFIRMATION_POP_UP,
		});
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
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
			<button
				className={`${classes['edit-profile__button']} ${
					showEditProfile && classes['edit-profile__button--open']
				}`}
				onClick={editProfileHandler}
			>
				<div className={classes['edit-profile__text']}>Éditer le profil</div>
				<img
					src={arrowIcon}
					alt='Flêche'
					className={`${classes['edit-profile__img']} ${
						!showEditProfile && classes['edit-profile__img--closed']
					}`}
				/>
			</button>
			{showEditProfile && (
				<div className={classes['edit-profile']}>
					<UserProfileEditButton
						icon={imageIcon}
						text={'Image'}
						to={'/profil/modifier/image'}
					/>
					<UserProfileEditButton
						icon={nameIcon}
						text={'Nom'}
						to={'/profil/modifier/nom'}
					/>
					<UserProfileEditButton
						icon={emailIcon}
						text={'Adresse mail'}
						to={'/profil/modifier/email'}
					/>
					<UserProfileEditButton
						icon={passwordIcon}
						text={'Mot de passe'}
						to={'/profil/modifier/mot-de-passe'}
					/>
					<Link
						to='/profil/modifier/supprimer-compte'
						className={classes['delete-button']}
					>
						Supprimer mon compte
					</Link>
				</div>
			)}
			<button onClick={promptLogOutHandler} className={classes['log-out']}>
				<img src={logOutIcon} alt='Déconnexion' />
				<div className={classes['log-out__text']}>Déconnexion</div>
			</button>
			{logOutConfirmationPopUpState.show && <LogOutConfirmation />}
		</div>
	);
};

export default Profile;
