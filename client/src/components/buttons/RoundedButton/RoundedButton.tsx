import React from 'react';
import { Link } from 'react-router-dom';

import classes from './RoundedButton.module.scss';

interface ButtonProps {
	text: string;
	type?: string;
	className?: string;
	link?: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RoundedButton: React.FC<ButtonProps> = (props) => {
	let button;

	if (props.link) {
		button = (
			<button className={`${classes.button} ${props.className}`}>
				<Link to={props.link}>{props.text}</Link>
				{props.children}
			</button>
		);
	} else if (!props.link || props.onClick) {
		button = (
			<button
				onClick={props.onClick}
				className={`${classes.button} ${props.className}`}
			>
				{props.text}
				{props.children}
			</button>
		);
	}

	return <>{button}</>;
};

export default RoundedButton;
