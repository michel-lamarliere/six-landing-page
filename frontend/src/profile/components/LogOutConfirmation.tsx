import React from 'react';

import { useUser } from '../../_shared/classes/user-hook';

import classes from './LogOutConfirmation.module.scss';

interface Props {
	cancelLogOutHandler: any;
}

const LogOutConfirmation: React.FC<Props> = (props) => {
	const { User } = useUser();

	const cancelHandler = () => {
		props.cancelLogOutHandler();
	};

	const logoutHandler = () => {
		User.logOut();
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.message}>
				Souhaitez-vous vraiment vous déconnecter ?
			</div>
			<div className={classes.buttons}>
				<button
					className={`${classes.buttons__button} ${classes['buttons__button--cancel']}`}
					onClick={cancelHandler}
				>
					Annuler
				</button>
				<button
					className={`${classes.buttons__button} ${classes['buttons__button--confirm']}`}
					onClick={logoutHandler}
				>
					Déconnexion
				</button>
			</div>
		</div>
	);
};

export default LogOutConfirmation;
