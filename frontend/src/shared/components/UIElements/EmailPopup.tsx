import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { EmailConfirmationActionTypes } from '../../store/email-confirmation';
import { RootState } from '../../store/store';

import classes from './EmailPopup.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const emailState = useSelector((state: RootState) => state.email);

	useEffect(() => {
		if (userState.confirmedEmail) {
			dispatch({ type: EmailConfirmationActionTypes.HIDE });
		} else {
			dispatch({ type: EmailConfirmationActionTypes.SHOW });
		}
	}, [userState.confirmedEmail]);

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
