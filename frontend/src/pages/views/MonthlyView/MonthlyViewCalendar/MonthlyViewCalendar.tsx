import React, { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addHours, addMonths, addYears, getYear, isBefore, isSameDay } from 'date-fns';

import { TaskSelectorActionTypes } from '../../../../store/task-selector';
import { CalendarActionTypes } from '../../../../store/calendar';

import Calendar, {
	calendarTypes,
} from '../../../../components/calendar/Calendar/Calendar';

import calendarClasses from '../../../../components/calendar/Calendar/Calendar.module.scss';

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

		dispatch({ type: TaskSelectorActionTypes.HIDE_TASK_SELECTOR });
	};

	const monthOnClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.setChosenDate(new Date((event.target as HTMLButtonElement).id));

		dispatch({ type: CalendarActionTypes.HIDE_CALENDAR });
	};

	return (
		<Calendar
			calendar={calendarTypes.MONTHLY}
			selectHandler={selectHandler}
			chosenTask={props.chosenTask}
			chosenDate={props.chosenDate}
			setChosenDate={props.setChosenDate}
			calendarDate={calendarDate}
			setCalendarDate={setCalendarDate}
			// previousHandlerDisabled={isBefore(
			// 	addMonths(props.chosenDate, -1),
			// 	new Date(2020, 0, 1)
			// )}
			headerText={props.headerText}
			// nextHandlerDisabled={!isBefore(addMonths(props.chosenDate, 1), new Date())}
			// calendarPreviousYearHandlerDisabled={isBefore(
			// 	addYears(calendarDate, -1),
			// 	new Date(2020, 0, 1)
			// )}
			calendarText={`${getYear(calendarDate)}`}
			// calendarNextYearHandlerDisabled={
			// 	!isBefore(addYears(calendarDate, 1), new Date())
			// }
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
							) &&
							!isSameDay(
								new Date(
									addHours(
										new Date(calendarDate.getFullYear(), index, 1),
										1
									)
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
