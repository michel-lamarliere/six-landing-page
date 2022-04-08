import React from 'react';

import { useUserClass } from '../../_shared/classes/user-class-hook';

import RoundedButton from '../../_shared/components/UIElements/RoundedButton';

import classes from './LogOutConfirmation.module.scss';

interface Props {
	cancelLogOutHandler: any;
}

const LogOutConfirmation: React.FC<Props> = (props) => {
	const { User } = useUserClass();

	const cancelHandler = () => {
		props.cancelLogOutHandler();
	};

	const logoutHandler = () => {
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
