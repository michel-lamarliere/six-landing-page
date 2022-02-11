import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorPopupActionTypes } from '../shared/store/error';
import { RootState } from '../shared/store/store';
import classes from './ErrorPopup.module.scss';

const ErrorPopup: React.FC<{ message: string }> = (props) => {
	const dispatch = useDispatch();
	const errorState = useSelector((state: RootState) => state.error);

	const closePopup = () => {
		dispatch({ type: ErrorPopupActionTypes.REMOVE_ERROR });
	};

	useEffect(() => {
		if (errorState.message) {
			setTimeout(() => {
				dispatch({ type: ErrorPopupActionTypes.REMOVE_ERROR });
			}, 5000);
		}
	}, [errorState]);

	return ReactDOM.createPortal(
		<div className={classes.wrapper}>
			<button onClick={closePopup}>x</button>
			{props.message}
		</div>,
		document.getElementById('error-popup')!
	);
};

export default ErrorPopup;
