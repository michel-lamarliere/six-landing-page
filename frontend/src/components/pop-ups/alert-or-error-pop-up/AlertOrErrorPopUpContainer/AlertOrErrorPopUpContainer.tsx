import React from 'react';
import { useDispatch } from 'react-redux';

import { ErrorPopUpActionTypes } from '../../../../store/pop-ups/error-pop-up';
import { AlertPopUpActionTypes } from '../../../../store/pop-ups/alert-pop-up';

import RoundedButton from '../../../buttons/RoundedButton/RoundedButton';

import closeButtonIcon from '../../../../assets/icons/close.svg';
import warningButtonIcon from '../../../../assets/icons/warning.svg';

import classes from './AlertOrErrorPopUpContainer.module.scss';

export enum AlertOrErrorPopUpTypes {
	ERROR = 'ERROR',
	WARNING = 'WARNING',
}

interface Props {
	type: AlertOrErrorPopUpTypes;
	message: string;
}

const AlertOrErrorPopUp: React.FC<Props> = (props) => {
	const dispatch = useDispatch();

	const error = props.type === AlertOrErrorPopUpTypes.ERROR;
	const warning = props.type === AlertOrErrorPopUpTypes.WARNING;

	const closePopUp = () => {
		if (error) {
			dispatch({ type: ErrorPopUpActionTypes.REMOVE_AND_HIDE_ERROR_POP_UP });
		} else if (warning) {
			dispatch({ type: AlertPopUpActionTypes.REMOVE_AND_HIDE_ALERT_POP_UP });
		}
	};

	return (
		<div className={classes.wrapper}>
			<img
				src={warningButtonIcon}
				alt='Alerte'
				className={classes['warning-img']}
			/>
			<button onClick={closePopUp} className={classes['close-button']}>
				<img src={closeButtonIcon} alt='Fermer' />
			</button>
			<div className={classes.title}>
				{error && 'Erreur'} {warning && 'Alerte'}
			</div>
			<div className={classes.message}>{props.message}</div>
			{error && (
				<RoundedButton
					text={'Signaler le problème'}
					link='/contact'
					onClick={closePopUp}
					className={classes.button}
				/>
			)}
		</div>
	);
};

export default AlertOrErrorPopUp;
