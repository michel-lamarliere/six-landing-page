import React from 'react';

import RoundedButton from './RoundedButton';

import warningIcon from '../../../_shared/assets/imgs/icons/warning.svg';
import closeIcon from '../../../_shared/assets/imgs/icons/close.svg';
import sentIcon from '../../../_shared/assets/imgs/icons/validated.svg';

import classes from './PopUp.module.scss';

export enum PopUpTypes {
	CONFIRM_EMAIL_ADDRESS = 'CONFIRM_EMAIL_ADDRESS',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

interface Props {
	type: PopUpTypes;
	closePopUp: any;
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
			<img src={warningIcon} alt='Alerte' className={classes['warning-icon']} />
			<div className={classes.children}>{props.children}</div>
		</div>
	);
};

export default PopUp;
