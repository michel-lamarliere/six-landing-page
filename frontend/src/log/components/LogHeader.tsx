import React from 'react';
import classes from './LogHeader.module.scss';

const LogHeader: React.FC<{
	selector_date?: any;
	selector_task?: any;
	button_previous_text: string;
	button_previous_handler: () => void;
	button_previous_disabled?: boolean;
	button_next_text: string;
	button_next_handler: () => void;
	button_next_disabled: boolean;
	text: string;
}> = (props) => {
	return (
		<>
			<div className={classes.selectors}>
				<p>{props.selector_date}</p>
				<h1>{props.selector_task}</h1>
			</div>
			<div className={classes.buttons}>
				<button
					onClick={props.button_previous_handler}
					disabled={props.button_previous_disabled}
				>
					{props.button_previous_text}
				</button>
				<div>{props.text}</div>
				<button
					onClick={props.button_next_handler}
					disabled={props.button_next_disabled}
				>
					{props.button_next_text}
				</button>
			</div>
		</>
	);
};

export default LogHeader;
