import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../store/_store';
import { CalendarActionTypes } from '../../../store/calendar';
import { OverlayActionTypes } from '../../../store/overlay';
import { TaskSelectorActionTypes } from '../../../store/task-selector';

import topArrowIcon from '../../../assets/icons/top-arrow.svg';
import calendarIcon from '../../../assets/icons/calendar/calendar_icon.svg';
import foodIcon from '../../../assets/icons/six/food.svg';
import sleepIcon from '../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../assets/icons/six/sports.svg';
import relaxationIcon from '../../../assets/icons/six/relaxation.svg';
import workIcon from '../../../assets/icons/six/work.svg';
import socialIcon from '../../../assets/icons/six/social.svg';

import classes from './CalendarAndTaskSelectorButtons.module.scss';

export const CalendarButton: React.FC = () => {
	const dispatch = useDispatch();

	const calendarState = useSelector((state: RootState) => state.calendar);

	const calendarButtonHandler = () => {
		dispatch({ type: CalendarActionTypes.SHOW_CALENDAR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	return (
		<button className={classes.button} onClick={calendarButtonHandler}>
			<img
				src={calendarIcon}
				alt='LogoCalendrier'
				className={classes.button__icon}
			/>
			<img
				src={topArrowIcon}
				className={`${classes.button__arrow} ${
					calendarState.show && classes['button__arrow--open']
				}`}
				alt='Flêche Calendrier'
			/>
		</button>
	);
};

export const TaskSelectorButton: React.FC<{
	chosenTask: string;
	selectTaskHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = (props) => {
	const dispatch = useDispatch();

	const taskSelectorState = useSelector((state: RootState) => state.taskSelector);

	const taskButtonHandler = () => {
		dispatch({ type: TaskSelectorActionTypes.SHOW_TASK_SELECTOR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	const selectTaskHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.selectTaskHandler(event);

		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
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

	return (
		<div className={classes.wrapper}>
			<button onClick={taskButtonHandler} className={classes.button}>
				<img
					src={getTaskImage()}
					alt='Tâche Sélectionnée'
					className={classes.button__icon}
				/>
				<img
					src={topArrowIcon}
					className={`${classes.button__arrow} ${
						taskSelectorState.show && classes['button__arrow--open']
					}`}
					alt='Flêche Calendrier'
				/>
			</button>
			{taskSelectorState.show && (
				<div className={classes.selector}>
					<button
						value='food'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'food' && classes.selector__active
						}`}
					>
						<img src={foodIcon} alt='Alimentation' />
						Alimentation
					</button>

					<button
						value='sleep'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'sleep' && classes.selector__active
						}`}
					>
						<img src={sleepIcon} alt='Sommeil' />
						Sommeil
					</button>

					<button
						value='sport'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'sport' && classes.selector__active
						}`}
					>
						<img src={sportsIcon} alt='Sport' />
						Sport
					</button>

					<button
						value='relaxation'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'relaxation' && classes.selector__active
						}`}
					>
						<img src={relaxationIcon} alt='Détente' />
						Détente
					</button>

					<button
						value='work'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'work' && classes.selector__active
						}`}
					>
						<img src={workIcon} alt='Projets' />
						Projets
					</button>

					<button
						value='social'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'social' && classes.selector__active
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
