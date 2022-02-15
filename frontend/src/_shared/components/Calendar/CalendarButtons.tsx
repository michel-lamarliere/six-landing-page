import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';
import { UIElementsActionTypes } from '../../store/ui-elements';

import TopArrow from '../../assets/icons/top-arrow.svg';

import calendarClasses from './Calendar.module.scss';

export const CalendarButton: React.FC = () => {
	const dispatch = useDispatch();

	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	const calendarButtonHandler = () => {
		dispatch({ type: UIElementsActionTypes.SHOW_CALENDAR });
	};

	useEffect(() => {
		if (uiElementsState.showCalendar) {
			dispatch({ type: UIElementsActionTypes.SHOW_OVERLAY });
		} else {
			dispatch({ type: UIElementsActionTypes.HIDE_OVERLAY });
		}
	}, [uiElementsState.showCalendar]);

	return (
		<button
			className={calendarClasses.buttons__button}
			onClick={calendarButtonHandler}
		>
			{/* <img /> */}
			<img
				src={TopArrow}
				className={`${calendarClasses.buttons__button__arrow} ${
					uiElementsState.showCalendar &&
					calendarClasses['buttons__button__arrow--open']
				}`}
				alt='CalendarButton'
			/>
		</button>
	);
};

export const TaskButton: React.FC<{
	chosenTask: string;
	selectHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = (props) => {
	const dispatch = useDispatch();

	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	const taskButtonHandler = () => {
		dispatch({ type: UIElementsActionTypes.SHOW_TASK_SELECTOR });
		dispatch({ type: UIElementsActionTypes.SHOW_OVERLAY });
	};

	useEffect(() => {
		if (uiElementsState.showTaskSelector) {
			dispatch({ type: UIElementsActionTypes.SHOW_OVERLAY });
		} else {
			dispatch({ type: UIElementsActionTypes.HIDE_OVERLAY });
		}
	}, [uiElementsState.showTaskSelector]);

	return (
		<div className={calendarClasses.buttons}>
			<button
				onClick={taskButtonHandler}
				className={calendarClasses.buttons__button}
			>
				{props.chosenTask}
				<img
					src={TopArrow}
					className={`${calendarClasses.buttons__button__arrow} ${
						uiElementsState.showTaskSelector &&
						calendarClasses['buttons__button__arrow--open']
					}`}
					alt='CalendarButton'
				/>
			</button>
			{uiElementsState.showTaskSelector && (
				<div className={calendarClasses.selector}>
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
		</div>
	);
};
