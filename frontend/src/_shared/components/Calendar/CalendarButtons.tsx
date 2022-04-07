import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/_store';

import TopArrow from '../../assets/imgs/icons/top-arrow.svg';
import CalendarIcon from '../../assets/imgs/icons/calendar/calendar_icon.svg';
import FoodIcon from '../../assets/imgs/icons/six/food.svg';
import SleepIcon from '../../assets/imgs/icons/six/sleep.svg';
import SportsIcon from '../../assets/imgs/icons/six/sports.svg';
import RelaxationIcon from '../../assets/imgs/icons/six/relaxation.svg';
import WorkIcon from '../../assets/imgs/icons/six/work.svg';
import SocialIcon from '../../assets/imgs/icons/six/social.svg';

import calendarClasses from './Calendar.module.scss';
import { CalendarActionTypes } from '../../store/calendar';
import { OverlayActionTypes } from '../../store/overlay';
import { TaskSelectorActionTypes } from '../../store/task-selector';

export const CalendarButton: React.FC = () => {
	const dispatch = useDispatch();

	const calendarState = useSelector((state: RootState) => state.calendar);

	const calendarButtonHandler = () => {
		// dispatch({ type: UIElementsActionTypes.SHOW_CALENDAR });
		dispatch({ type: CalendarActionTypes.SHOW });
	};

	useEffect(() => {
		if (calendarState.show) {
			dispatch({ type: OverlayActionTypes.SHOW });
		} else {
			dispatch({ type: OverlayActionTypes.HIDE });
		}
	}, [calendarState.show]);

	return (
		<button
			className={calendarClasses.buttons__button}
			onClick={calendarButtonHandler}
		>
			<img
				src={CalendarIcon}
				alt='LogoCalendrier'
				className={calendarClasses.buttons__button__calendar}
			/>
			<img
				src={TopArrow}
				className={`${calendarClasses.buttons__button__arrow} ${
					calendarState.show && calendarClasses['buttons__button__arrow--open']
				}`}
				alt='Flêche Calendrier'
			/>
		</button>
	);
};

export const TaskSelectorButton: React.FC<{
	chosenTask: string;
	selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = (props) => {
	const dispatch = useDispatch();

	const taskSelectorState = useSelector((state: RootState) => state.taskSelector);

	const taskButtonHandler = () => {
		dispatch({ type: TaskSelectorActionTypes.SHOW });
		dispatch({ type: OverlayActionTypes.SHOW });
	};

	const getTaskImage = () => {
		switch (props.chosenTask) {
			case 'food': {
				return FoodIcon;
			}
			case 'sleep': {
				return SleepIcon;
			}
			case 'sport': {
				return SportsIcon;
			}
			case 'relaxation': {
				return RelaxationIcon;
			}
			case 'work': {
				return WorkIcon;
			}
			case 'social': {
				return SocialIcon;
			}
		}
	};

	useEffect(() => {
		if (taskSelectorState.show) {
			dispatch({ type: OverlayActionTypes.SHOW });
		} else {
			dispatch({ type: OverlayActionTypes.HIDE });
		}
	}, [taskSelectorState.show]);

	return (
		<div className={calendarClasses.buttons}>
			<button
				onClick={taskButtonHandler}
				className={calendarClasses.buttons__button}
			>
				<img
					src={getTaskImage()}
					alt='Tâche Sélectionnée'
					className={calendarClasses.buttons__button__icon}
				/>
				<img
					src={TopArrow}
					className={`${calendarClasses.buttons__button__arrow} ${
						taskSelectorState.show &&
						calendarClasses['buttons__button__arrow--open']
					}`}
					alt='Flêche Calendrier'
				/>
			</button>
			{taskSelectorState.show && (
				<div className={calendarClasses.selector}>
					<button
						value='food'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'food' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={FoodIcon} alt='Alimentation' />
						Alimentation
					</button>

					<button
						value='sleep'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'sleep' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={SleepIcon} alt='Sommeil' />
						Sommeil
					</button>

					<button
						value='sport'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'sport' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={SportsIcon} alt='Sport' />
						Sport
					</button>

					<button
						value='relaxation'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'relaxation' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={RelaxationIcon} alt='Détente' />
						Détente
					</button>

					<button
						value='work'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'work' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={WorkIcon} alt='Projets' />
						Projets
					</button>

					<button
						value='social'
						onClick={props.selectHandler}
						className={`${
							props.chosenTask === 'social' &&
							calendarClasses.selector__active
						}`}
					>
						<img src={SocialIcon} alt='Vie Sociale' />
						Vie Sociale
					</button>
				</div>
			)}
		</div>
	);
};
