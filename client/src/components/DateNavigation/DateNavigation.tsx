import React from 'react';

import leftArrowIcon from '../../assets/icons/calendar/left-arrow.svg';
import rightArrowIcon from '../../assets/icons/calendar/right-arrow.svg';

import classes from './DateNavigation.module.scss';

interface Props {
	headerText: string;
	previousHandler: () => void;
	nextHandler: () => void;
	previousHandlerDisabled: () => boolean;
	nextHandlerDisabled: () => boolean;
}

const DateNavigation: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			{!props.previousHandlerDisabled() && (
				<button
					className={`${classes.button} ${classes['button--left']}`}
					onClick={props.previousHandler}
				>
					<img src={leftArrowIcon} alt='Flêche gauche' />
				</button>
			)}
			<h1 className={classes.text}>{props.headerText}</h1>
			{!props.nextHandlerDisabled() && (
				<button
					className={`${classes.button} ${classes['button--right']}`}
					onClick={props.nextHandler}
				>
					<img src={rightArrowIcon} alt='Flêche droite' />
				</button>
			)}
		</div>
	);
};

export default DateNavigation;
