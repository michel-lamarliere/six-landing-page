import React from 'react';
import { useDispatch } from 'react-redux';

import { PopUpActionTypes } from '../../_shared/store/pop-ups';

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

	const error = WarningOrErrorPopUpTypes.ERROR;

	const warning = WarningOrErrorPopUpTypes.WARNING;

	const closePopUp = () => {
		if (props.type === error) {
			dispatch({ type: PopUpActionTypes.REMOVE_ERROR });
		} else if (props.type === warning) {
			dispatch({ type: PopUpActionTypes.REMOVE_ALERT });
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
				{props.type === error && 'Erreur'} {props.type === warning && 'Alerte'}
			</div>
			<div className={classes.message}>{props.message}</div>
			{props.type === error && (
				<RoundedButton text={'Signaler le problème'} className={classes.button} />
			)}
		</div>
	);
};

export default WarningOrErrorPopUp;
