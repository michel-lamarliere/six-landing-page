import React from 'react';

import leftArrowIcon from '../../assets/icons/calendar/left-arrow.svg';
import rightArrowIcon from '../../assets/icons/calendar/right-arrow.svg';

import classes from './DateNavigation.module.scss';

export enum DateNavigationTypes {
	VIEW = 'VIEW',
	ANNUAL_CHART = 'ANNUAL_CHART',
}

interface Props {
	type: DateNavigationTypes;
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
					className={`${classes.button} ${classes['button--left']} ${
						props.type === DateNavigationTypes.ANNUAL_CHART &&
						classes['button--left--annual-chart']
					}`}
					onClick={props.previousHandler}
				>
					<img src={leftArrowIcon} alt='Flèche gauche' />
				</button>
			)}
			<h1 className={classes.text}>{props.headerText}</h1>
			{!props.nextHandlerDisabled() && (
				<button
					className={`${classes.button} ${classes['button--right']} ${
						props.type === DateNavigationTypes.ANNUAL_CHART &&
						classes['button--right--annual-chart']
					}`}
					onClick={props.nextHandler}
				>
					<img src={rightArrowIcon} alt='Flèche droite' />
				</button>
			)}
		</div>
	);
};

export default DateNavigation;
