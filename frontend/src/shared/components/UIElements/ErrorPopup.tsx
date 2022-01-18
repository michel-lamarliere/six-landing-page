import React from 'react';
import { useDispatch } from 'react-redux';
import classes from './ErrorPopup.module.scss';

const ErrorPopup: React.FC<{ message: string }> = (props) => {
	const dispatch = useDispatch();

	const closePopup = () => {
		dispatch({ type: 'REMOVE_ERROR' });
	};

	return (
		<div className={classes.wrapper}>
			<button onClick={closePopup}>x</button>
			{props.message}
		</div>
	);
};

export default ErrorPopup;
