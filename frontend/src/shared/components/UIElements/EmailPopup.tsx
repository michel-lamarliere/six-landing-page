import React from 'react';
import { useDispatch } from 'react-redux';

import classes from './EmailPopup.module.scss';

const EmailPopup: React.FC = () => {
	const dispatch = useDispatch();

	return (
		<div className={classes.wrapper}>
			<h1>Votre adresse mail n'est pas confirmée.</h1>
			<h2>Renvoyer un mail</h2>
			<button onClick={() => dispatch({ type: 'HIDE' })}>X</button>
		</div>
	);
};

export default EmailPopup;
