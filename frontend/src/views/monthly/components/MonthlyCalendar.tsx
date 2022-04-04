import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addHours, addMonths, addYears, getYear, isBefore } from 'date-fns';

import { UIElementsActionTypes } from '../../../_shared/store/ui-elements';

import Calendar, { calendarTypes } from '../../../_shared/components/Calendar/Calendar';

import calendarClasses from '../../../_shared/components/Calendar/Calendar.module.scss';

const MonthlyCalendar: React.FC<{
	chosenDate: Date;
	setChosenDate: Dispatch<SetStateAction<Date>>;
	chosenTask: string;
	setChosenTask: Dispatch<SetStateAction<string>>;
	headerText: string;
}> = (props) => {
	const dispatch = useDispatch();

	const [calendarDate, setCalendarDate] = useState(new Date());

	const months = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre',
	];

	const selectHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.setChosenTask((event.target as HTMLButtonElement).value);

		dispatch({ type: UIElementsActionTypes.HIDE_TASK_SELECTOR });
	};

	const previousHandler = () => {
		props.setChosenDate(addMonths(props.chosenDate, -1));
	};

	const nextHandler = () => {
		props.setChosenDate(addMonths(props.chosenDate, 1));
	};

	const calendarPreviousYearHandler = () => {
		setCalendarDate(addYears(calendarDate, -1));
	};

	const calendarNextYearHandler = () => {
		setCalendarDate(addYears(calendarDate, 1));
	};

	const monthOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.setChosenDate(new Date((event.target as HTMLButtonElement).id));

		dispatch({ type: UIElementsActionTypes.HIDE_CALENDAR });
	};

	return (
		<Calendar
			calendar={calendarTypes.MONTHLY}
			selectHandler={selectHandler}
			chosenTask={props.chosenTask}
			previousHandler={previousHandler}
			previousHandlerDisabled={isBefore(
				addMonths(props.chosenDate, -1),
				new Date(2020, 0, 1)
			)}
			headerText={props.headerText}
			nextHandler={nextHandler}
			nextHandlerDisabled={!isBefore(addMonths(props.chosenDate, 1), new Date())}
			calendarPreviousYearHandler={calendarPreviousYearHandler}
			calendarPreviousYearHandlerDisabled={isBefore(
				addYears(calendarDate, -1),
				new Date(2020, 0, 1)
			)}
			calendarText={`${getYear(calendarDate)}`}
			calendarNextYearHandler={calendarNextYearHandler}
			calendarNextYearHandlerDisabled={
				!isBefore(addYears(calendarDate, 1), new Date())
			}
		>
			<div className={calendarClasses.month}>
				{months.map((month, index) => (
					<button
						key={Math.random()}
						className={`${calendarClasses.month__month} ${
							!isBefore(
								addHours(
									new Date(calendarDate.getFullYear(), index, 1),
									1
								),
								new Date()
							) && calendarClasses['month__month--disabled']
						}`}
						disabled={
							!isBefore(
								addHours(
									new Date(calendarDate.getFullYear(), index, 1),
									1
								),
								new Date()
							)
						}
						onClick={monthOnClickHandler}
						id={`${addHours(
							new Date(calendarDate.getFullYear(), index, 1),
							1
						)}`}
					>
						{month}
					</button>
				))}
			</div>
		</Calendar>
	);
};

export default MonthlyCalendar;
