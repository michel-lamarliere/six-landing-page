import React from 'react';
import classes from './Buttons.module.scss';

export const DataButton: React.FC<{
	value: number;
	id: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	disabled: boolean;
}> = (props) => {
	return (
		<button
			className={`${classes.button} ${props.value === 0 ? classes.zero : ''}
						${props.value === 1 ? classes.one : ''}
						${props.value === 2 ? classes.two : ''}
						`}
			id={props.id}
			onClick={props.onClick}
			value={props.value}
			disabled={!props.disabled}
		/>
	);
};
