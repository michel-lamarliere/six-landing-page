import React from 'react';
import { useDispatch } from 'react-redux';

import { useUserClass } from '../../../classes/user-class-hook';
import { OverlayActionTypes } from '../../../store/overlay';
import { LogOutConfirmationPopUpActionTypes } from '../../../store/pop-ups/log-out-confirmation-pop-up';

import RoundedButton from '../../buttons/RoundedButton/RoundedButton';

import classes from './LogOutConfirmation.module.scss';

const LogOutConfirmation: React.FC = () => {
	const dispatch = useDispatch();
	const { User } = useUserClass();

	const cancelHandler = () => {
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
		dispatch({
			type: LogOutConfirmationPopUpActionTypes.HIDE_LOG_OUT_CONFIRMATION_POP_UP,
		});
	};

	const logoutHandler = () => {
		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
		dispatch({
			type: LogOutConfirmationPopUpActionTypes.HIDE_LOG_OUT_CONFIRMATION_POP_UP,
		});
		User.logOut({ redirect: true });
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.message}>
				Souhaitez-vous vraiment vous déconnecter ?
			</div>
			<div className={classes.buttons}>
				<RoundedButton
					text={'Annuler'}
					className={`${classes.buttons__button} ${classes['buttons__button--cancel']}`}
					onClick={cancelHandler}
				/>
				<RoundedButton
					text={'Déconnexion'}
					className={`${classes.buttons__button} ${classes['buttons__button--confirm']}`}
					onClick={logoutHandler}
				/>
			</div>
		</div>
	);
};

export default LogOutConfirmation;
