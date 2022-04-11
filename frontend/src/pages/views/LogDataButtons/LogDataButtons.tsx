import React from 'react';

import classes from './LogDataButtons.module.scss';

export const LogDataButton: React.FC<{
	value: number;
	id?: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	disabled: boolean;
	dayNumber?: number;
}> = (props) => {
	return (
		<button
			className={classes.button}
			id={props.id}
			onClick={props.onClick}
			value={props.value}
			disabled={props.disabled}
		>
			<div
				className={`${classes.button__filling} ${
					props.value === 0 ? classes['button__filling--zero'] : ''
				}
						${props.value === 1 ? classes['button__filling--one'] : ''}
						${props.value === 2 ? classes['button__filling--two'] : ''}`}
			></div>
			<div className={`${classes['button__day-number']}`}>{props.dayNumber}</div>
		</button>
	);
};

export const PlaceHolderLogDataButton: React.FC<{
	disabled: boolean;
}> = (props) => {
	return <button className={classes.button} disabled={!props.disabled} />;
};
