import React from 'react';
import { useDispatch } from 'react-redux';

import { ErrorPopUpActionTypes } from '../../_shared/store/pop-ups/error-pop-up';
import { AlertPopUpActionTypes } from '../../_shared/store/pop-ups/alert-pop-up';

import RoundedButton from '../../_shared/components/UIElements/RoundedButton';

import closeButtonIcon from '../../_shared/assets/imgs/icons/close.svg';
import warningButtonIcon from '../../_shared/assets/imgs/icons/warning.svg';

import classes from './WarningOrErrorPopUp.module.scss';

export enum WarningOrErrorPopUpTypes {
	ERROR = 'ERROR',
	WARNING = 'WARNING',
}

interface Props {
	type: WarningOrErrorPopUpTypes;
	message: string;
}

const WarningOrErrorPopUp: React.FC<Props> = (props) => {
	const dispatch = useDispatch();

	const error = props.type === WarningOrErrorPopUpTypes.ERROR;
	const warning = props.type === WarningOrErrorPopUpTypes.WARNING;

	const closePopUp = () => {
		if (error) {
			dispatch({ type: ErrorPopUpActionTypes.REMOVE_AND_HIDE });
		} else if (warning) {
			dispatch({ type: AlertPopUpActionTypes.REMOVE_AND_HIDE });
		}
	};

	return (
		<div className={classes.wrapper}>
			<img src={closeButtonIcon} alt='Alerte' className={classes['warning-img']} />
			<button onClick={closePopUp} className={classes['close-button']}>
				<img src={warningButtonIcon} alt='Fermer' />
			</button>
			<div className={classes.title}>
				{error && 'Erreur'} {warning && 'Alerte'}
			</div>
			<div className={classes.message}>{props.message}</div>
			{error && (
				<RoundedButton text={'Signaler le problème'} className={classes.button} />
			)}
		</div>
	);
};

export default WarningOrErrorPopUp;
