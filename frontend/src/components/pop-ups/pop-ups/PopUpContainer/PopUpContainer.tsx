import React from 'react';

import warningIcon from '../../../../assets/icons/warning.svg';
import closeIcon from '../../../../assets/icons/close.svg';

import classes from './PopUpContainer.module.scss';

export enum PopUpTypes {
	CONFIRM_EMAIL_ADDRESS = 'CONFIRM_EMAIL_ADDRESS',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

interface Props {
	type: PopUpTypes;
	closePopUp: any;
	displayNextMessage: boolean;
}

const PopUp: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<button onClick={props.closePopUp} className={classes['close-button']}>
				<img
					src={closeIcon}
					alt='Fermer'
					className={classes['close-button__icon']}
				/>
			</button>
			{!props.displayNextMessage && (
				<img src={warningIcon} alt='Alerte' className={classes['warning-icon']} />
			)}
			<div className={classes.children}>{props.children}</div>
		</div>
	);
};

export default PopUp;
