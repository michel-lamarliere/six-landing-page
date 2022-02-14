import React from 'react';

import TopArrow from '../../assets/icons/top-arrow.svg';

import classes from './Calendar.module.scss';

export const CalendarButton: React.FC<{
	showCalendar: boolean;
	calendarButtonHandler: () => void;
}> = (props) => {
	return (
		<button className={classes.buttons__button} onClick={props.calendarButtonHandler}>
			{/* <img /> */}
			<img
				src={TopArrow}
				className={`${classes.buttons__button__arrow} ${
					props.showCalendar && classes['buttons__button__arrow--open']
				}`}
				alt='CalendarButton'
			/>
		</button>
	);
};

export const TaskButton: React.FC<{
	showTaskSelector: boolean;
	setShowTaskSelector: () => void;
	chosenTask: string;
	selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = (props) => {
	return (
		<>
			<button
				onClick={props.setShowTaskSelector}
				className={classes.buttons__button}
			>
				{props.chosenTask}
				<img
					src={TopArrow}
					className={`${classes.buttons__button__arrow} ${
						props.showTaskSelector && classes['buttons__button__arrow--open']
					}`}
					alt='CalendarButton'
				/>
			</button>
			{props.showTaskSelector && (
				<div className={classes.selector}>
					<button value='food' onClick={props.selectHandler}>
						Alimentation
					</button>
					<button value='sleep' onClick={props.selectHandler}>
						Sommeil
					</button>
					<button value='sport' onClick={props.selectHandler}>
						Sport
					</button>
					<button value='relaxation' onClick={props.selectHandler}>
						Détente
					</button>
					<button value='work' onClick={props.selectHandler}>
						Projets
					</button>
					<button value='social' onClick={props.selectHandler}>
						Vie Sociale
					</button>
				</div>
			)}
		</>
	);
};
