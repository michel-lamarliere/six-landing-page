import React from 'react';

import classes from './LogDataButtons.module.scss';

const LogDataButton: React.FC<{
	value: number;
	id?: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	disabled: boolean;
	dayNumber?: number;
}> = (props) => {
	return (
		<div
			className={`${classes.wrapper} ${
				props.disabled && classes['wrapper--disabled']
			}`}
		>
			<div
				className={`${classes.button__filling} ${
					props.value === 0 ? classes['button__filling--zero'] : ''
				}
				${props.value === 1 ? classes['button__filling--one'] : ''}
				${props.value === 2 ? classes['button__filling--two'] : ''}`}
			></div>
			<div className={`${classes['button__day-number']}`}>{props.dayNumber}</div>
			<button
				className={classes.button}
				id={props.id}
				onClick={props.onClick}
				value={props.value}
				disabled={props.disabled}
			></button>
		</div>
	);
};

export default LogDataButton;
