import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../_shared/store/_store';
import { PopUpActionTypes } from '../_shared/store/pop-ups';

import closeButton from '../_shared/assets/imgs/icons/close.svg';
import warningButton from '../_shared/assets/imgs/icons/warning.svg';

import classes from './Error.module.scss';

const ErrorPopup: React.FC<{ message: string }> = (props) => {
	const dispatch = useDispatch();

	const closePopup = () => {
		dispatch({ type: PopUpActionTypes.REMOVE_ERROR });
	};

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<img src={warningButton} alt='Alerte' className={classes['warning-img']} />
			<button onClick={closePopup} className={classes['close-button']}>
				<img src={closeButton} alt='Fermer' />
			</button>
			<div className={classes.title}>Erreur</div>
			<div className={classes.message}>{props.message}</div>
			<button className={classes.button}>Signaler le problème</button>
		</div>,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
