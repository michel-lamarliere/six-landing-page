import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../_shared/store/_store';
import { PopUpActionTypes } from '../../_shared/store/pop-ups';

import WarningOrErrorPopUp, {
	WarningOrErrorPopUpTypes,
} from '../components/WarningOrErrorPopUp';
import closeButton from '../../_shared/assets/imgs/icons/close.svg';
import warningButton from '../../_shared/assets/imgs/icons/warning.svg';

import RoundedButton from '../../_shared/components/UIElements/RoundedButton';

import classes from './ErrorPopUp.module.scss';

const ErrorPopup: React.FC<{ message: string }> = (props) => {
	return ReactDOM.createPortal(
		<WarningOrErrorPopUp
			type={WarningOrErrorPopUpTypes.ERROR}
			message={props.message}
		/>,
		// <div className={classes.wrapper}>
		// 	<img src={warningButton} alt='Alerte' className={classes['warning-img']} />
		// 	<button onClick={closePopup} className={classes['close-button']}>
		// 		<img src={closeButton} alt='Fermer' />
		// 	</button>
		// 	<div className={classes.title}>Erreur</div>
		// 	<div className={classes.message}>{props.message}</div>
		// 	<RoundedButton text={'Signaler le problème'} className={classes.button} />
		// </div>
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
