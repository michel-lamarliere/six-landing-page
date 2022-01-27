import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { ErrorPopupActionTypes } from '../../store/error';
import classes from './ErrorPopup.module.scss';

const ErrorPopup: React.FC<{ message: string }> = (props) => {
	const dispatch = useDispatch();

	const closePopup = () => {
		dispatch({ type: ErrorPopupActionTypes.REMOVE_ERROR });
	};

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<button onClick={closePopup}>x</button>
			{props.message}
		</div>,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
