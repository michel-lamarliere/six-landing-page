import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Buttons.module.scss';

export enum buttonColors {
	COLOR_WHITE = 'white',
	COLOR_PURPLE = 'purple',
}

interface ButtonProps {
	text: string;
	color: buttonColors;
	link?: string;
	onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = (props) => {
	let button;

	if (props.link) {
		button = (
			<button className={`${classes.button} ${classes[`button_${props.color}`]}`}>
				<Link to={props.link}>{props.text}</Link>
			</button>
		);
	} else if (!props.link && props.onClick) {
		button = (
			<button onClick={props.onClick} className={classes.button}>
				{props.text}
			</button>
		);
	}

	return <>{button}</>;
};
