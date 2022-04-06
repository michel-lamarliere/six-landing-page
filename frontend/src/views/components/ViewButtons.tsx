import React from 'react';

import classes from './ViewButtons.module.scss';

export const DataButton: React.FC<{
	value: number;
	id?: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	disabled: boolean;
}> = (props) => {
	return (
		<button
			className={`${classes.button} ${
				props.value === 0 ? classes['button--zero'] : ''
			}
						${props.value === 1 ? classes['button--one'] : ''}
						${props.value === 2 ? classes['button--two'] : ''}
						`}
			id={props.id}
			onClick={props.onClick}
			value={props.value}
			disabled={!props.disabled}
		/>
	);
};

export const PlaceHolderDataButton: React.FC<{
	disabled: boolean;
}> = (props) => {
	return <button className={classes.button} disabled={!props.disabled} />;
};
