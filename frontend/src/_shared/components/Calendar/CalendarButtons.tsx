import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/_store';
import { CalendarActionTypes } from '../../store/calendar';
import { OverlayActionTypes } from '../../store/overlay';
import { TaskSelectorActionTypes } from '../../store/task-selector';

import topArrowIcon from '../../assets/imgs/icons/top-arrow.svg';
import calendarIcon from '../../assets/imgs/icons/calendar/calendar_icon.svg';
import foodIcon from '../../assets/imgs/icons/six/food.svg';
import sleepIcon from '../../assets/imgs/icons/six/sleep.svg';
import sportsIcon from '../../assets/imgs/icons/six/sports.svg';
import relaxationIcon from '../../assets/imgs/icons/six/relaxation.svg';
import workIcon from '../../assets/imgs/icons/six/work.svg';
import socialIcon from '../../assets/imgs/icons/six/social.svg';

import calendarClasses from './Calendar.module.scss';

export const CalendarButton: React.FC = () => {
	const dispatch = useDispatch();

	const calendarState = useSelector((state: RootState) => state.calendar);

	const calendarButtonHandler = () => {
		dispatch({ type: CalendarActionTypes.SHOW_CALENDAR });
	};

	useEffect(() => {
		if (calendarState.show) {
			dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
		} else {
			dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
		}
	}, [calendarState.show]);

	return (
		<button
			className={calendarClasses.buttons__button}
			onClick={calendarButtonHandler}
		>
			<img
				src={calendarIcon}
				alt='LogoCalendrier'
				className={calendarClasses.buttons__button__calendar}
			/>
			<img
				src={topArrowIcon}
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
		dispatch({ type: TaskSelectorActionTypes.SHOW_TASK_SELECTOR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	const getTaskImage = () => {
		switch (props.chosenTask) {
			case 'food': {
				return foodIcon;
			}
			case 'sleep': {
				return sleepIcon;
			}
			case 'sport': {
				return sportsIcon;
			}
			case 'relaxation': {
				return relaxationIcon;
			}
			case 'work': {
				return workIcon;
			}
			case 'social': {
				return socialIcon;
			}
		}
	};

	useEffect(() => {
		if (taskSelectorState.show) {
			dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
		} else {
			dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
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
					src={topArrowIcon}
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
						<img src={foodIcon} alt='Alimentation' />
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
						<img src={sleepIcon} alt='Sommeil' />
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
						<img src={sportsIcon} alt='Sport' />
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
						<img src={relaxationIcon} alt='Détente' />
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
						<img src={workIcon} alt='Projets' />
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
						<img src={socialIcon} alt='Vie Sociale' />
						Vie Sociale
					</button>
				</div>
			)}
		</div>
	);
};
