import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { EmailConfirmationActionTypes } from '../../store/email-confirmation';

import classes from './EmailPopup.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<h1 className={classes.title}>Votre adresse mail n'est pas confirmée.</h1>
			<h2 className={classes.text}>Renvoyer un mail</h2>
			<button onClick={() => dispatch({ type: EmailConfirmationActionTypes.HIDE })}>
				X
			</button>
		</div>,
		document.getElementById('email-confirmation-popup')!
	);
};

export default EmailPopup;
