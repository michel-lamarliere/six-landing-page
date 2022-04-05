import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';

import { PopUpActionTypes } from '../_shared/store/pop-ups';

import closeButton from '../_shared/assets/imgs/icons/close.svg';
import warningButton from '../_shared/assets/imgs/icons/warning.svg';

import classes from './Alert.module.scss';

interface Props {
	message: string;
}

const Alert: React.FC<Props> = (props) => {
	const dispatch = useDispatch();

	const closePopup = () => {
		dispatch({ type: PopUpActionTypes.REMOVE_ALERT });
	};
	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<img src={warningButton} alt='Alerte' className={classes['warning-img']} />
			<button onClick={closePopup} className={classes['close-button']}>
				<img src={closeButton} alt='Fermer' />
			</button>
			<div className={classes.title}>Alerte</div>
			<div className={classes.message}>{props.message}</div>
		</div>,
		document.getElementById('alert-popup')!
	);
};

export default Alert;
