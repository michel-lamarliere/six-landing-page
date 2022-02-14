import React, { useState } from 'react';

import DaysOfWeek from './DaysOfWeek';

import LeftArrow from '../../assets/icons/left-arrow.svg';
import DoubleLeftArrow from '../../assets/icons/double-left-arrow.svg';
import RightArrow from '../../assets/icons/right-arrow.svg';
import DoubleRightArrow from '../../assets/icons/double-right-arrow.svg';
import TopArrow from '../../assets/icons/top-arrow.svg';

import classes from './Calendar.module.scss';

export enum calendarTypes {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	ANNUAL_CHART = 'ANNUAL_CHART',
}

type CommonProps = {
	previousHandler: any;
	previousHandlerDisabled: boolean;
	headerText: string;
	nextHandler: any;
	nextHandlerDisabled: boolean;
};

type TestProps =
	| {
			calendar: calendarTypes.DAILY | calendarTypes.WEEKLY;
			ref: any;
			taskSelector?: never;
			selectHandler?: never;
			currentTask?: never;
			calendarPreviousYearHandler: () => void;
			calendarPreviousYearHandlerDisabled: boolean;
			calendarPreviousMonthHandler: () => void;
			calendarPreviousMonthHandlerDisabled: boolean;
			calendarText: string;
			calendarNextMonthHandler: () => void;
			calendarNextMonthHandlerDisabled: boolean;
			calendarNextYearHandler: () => void;
			calendarNextYearHandlerDisabled: boolean;
	  }
	| {
			calendar: calendarTypes.MONTHLY;
			ref: any;
			taskSelector: boolean;
			chosenTask: string;
			selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
			calendarPreviousYearHandler: () => void;
			calendarPreviousYearHandlerDisabled: boolean;
			calendarPreviousMonthHandler?: never;
			calendarPreviousMonthHandlerDisabled?: never;
			calendarText: string;
			calendarNextMonthHandler?: never;
			calendarNextMonthHandlerDisabled?: never;
			calendarNextYearHandler: () => void;
			calendarNextYearHandlerDisabled: boolean;
	  }
	| {
			calendar: calendarTypes.ANNUAL_CHART;
			// ref?: never;
			taskSelector: boolean;
			chosenTask: string;
			selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
			calendarPreviousYearHandler?: never;
			calendarPreviousYearHandlerDisabled?: never;
			calendarPreviousMonthHandler?: never;
			calendarPreviousMonthHandlerDisabled?: never;
			calendarText?: never;
			calendarNextMonthHandler?: never;
			calendarNextMonthHandlerDisabled?: never;
			calendarNextYearHandler?: never;
			calendarNextYearHandlerDisabled?: never;
			calendarButtonHandler?: never;
	  };

type Props = CommonProps & TestProps;

const Calendar: React.FC<Props> = React.forwardRef<HTMLButtonElement, Props>(
	(props, ref) => {
		const [showCalendar, setShowCalendar] = useState(false);
		const [showTaskSelector, setShowTaskSelector] = useState(false);

		const calendarButtonHandler = () => {
			setShowCalendar((prev) => !prev);
			console.log('click');
		};

		return (
			<div className={classes.wrapper}>
				<div className={classes.buttons}>
					{props.calendar !== calendarTypes.ANNUAL_CHART && (
						<button
							ref={ref}
							className={classes.buttons__button}
							onClick={calendarButtonHandler}
						>
							{/* <img /> */}
							<img
								src={TopArrow}
								className={`${classes.buttons__button__arrow} ${
									showCalendar &&
									classes['buttons__button__arrow--open']
								}`}
								alt='CalendarButton'
							/>
						</button>
					)}
					{props.taskSelector && (
						<>
							<button
								onClick={() => setShowTaskSelector((prev) => !prev)}
								className={classes.buttons__button}
							>
								{props.chosenTask}
								<img
									src={TopArrow}
									className={`${classes.buttons__button__arrow} ${
										showTaskSelector &&
										classes['buttons__button__arrow--open']
									}`}
									alt='CalendarButton'
								/>
							</button>
							{showTaskSelector && (
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
									<button
										value='relaxation'
										onClick={props.selectHandler}
									>
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
					)}
				</div>
				<div className={classes.header}>
					{!props.previousHandlerDisabled && (
						<button
							className={`${classes.header__button} ${classes['header__button--left']}`}
							onClick={props.previousHandler}
							disabled={props.previousHandlerDisabled}
						>
							<img src={LeftArrow} alt='Flêche gauche' />
						</button>
					)}
					<h1 className={classes.header__text}>{props.headerText}</h1>
					{!props.nextHandlerDisabled && (
						<button
							className={`${classes.header__button} ${classes['header__button--right']}`}
							onClick={props.nextHandler}
							disabled={props.nextHandlerDisabled}
						>
							<img src={RightArrow} alt='Flêche droite' />
						</button>
					)}
				</div>
				{showCalendar && (
					<div className={classes.calendar}>
						<div className={classes.calendar__header}>
							{!props.calendarPreviousYearHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--double-left']}`}
									onClick={props.calendarPreviousYearHandler}
								>
									<img
										src={DoubleLeftArrow}
										alt='Flêche Année Précédente'
									/>
								</button>
							)}
							{props.calendar ===
								(calendarTypes.DAILY || calendarTypes.WEEKLY) &&
								!props.calendarPreviousMonthHandlerDisabled && (
									<button
										className={`${classes.calendar__header__button} ${classes['calendar__header__button--left']}`}
										onClick={props.calendarPreviousMonthHandler}
									>
										<img
											src={LeftArrow}
											alt='Flêche Mois Précédente'
										/>
									</button>
								)}
							<div className={classes.calendar__header__text}>
								{props.calendarText}
							</div>
							{props.calendar ===
								(calendarTypes.DAILY || calendarTypes.WEEKLY) &&
								!props.calendarNextMonthHandlerDisabled && (
									<button
										className={`${classes.calendar__header__button} ${classes['calendar__header__button--right']}`}
										onClick={props.calendarNextMonthHandler}
									>
										<img src={RightArrow} alt='Flêche Mois Suivant' />
									</button>
								)}
							{!props.calendarNextYearHandlerDisabled && (
								<button
									className={`${classes.calendar__header__button} ${classes['calendar__header__button--double-right']}`}
									onClick={props.calendarNextYearHandler}
								>
									<img
										src={DoubleRightArrow}
										alt='Flêche Année Suivante'
									/>
								</button>
							)}
						</div>
						<div className={classes.calendar__calendar}>
							{(props.calendar === calendarTypes.DAILY ||
								props.calendar === calendarTypes.WEEKLY) && (
								<DaysOfWeek />
							)}
							{props.children}
						</div>
					</div>
				)}
			</div>
		);
	}
);

export default Calendar;
