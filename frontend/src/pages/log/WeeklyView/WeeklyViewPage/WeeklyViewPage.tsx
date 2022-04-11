import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { addDays, getISOWeek, startOfWeek, format, getYear } from 'date-fns';

import { RootState } from '../../../../store/_store';

import { useRequest } from '../../../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';
import { useTaskClass } from '../../../../classes/task-class-hook';

import WeekViewTasks from '../WeeklyViewTasks/WeeklyViewTasks';
import WeeklyCalendar from '../WeeklyViewCalendar/WeeklyViewCalendar';

import classes from './WeeklyViewPage.module.scss';

const WeekView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	const [dataArray, setDataArray] = useState<{
		food: [];
		sleep: [];
		sport: [];
		relaxation: [];
		social: [];
		work: [];
	}>({ food: [], sleep: [], sport: [], relaxation: [], social: [], work: [] });
	const [isLoading, setIsLoading] = useState(true);
	const [datesArray, setDatesArray] = useState([]);

	// CALENDAR
	const [chosenDate, setChosenDate] = useState(addDays(new Date(), 0));
	const [monthStr, setMonthStr] = useState('');
	const firstOfWeek = startOfWeek(chosenDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const previousLevel = parseInt((event.target as HTMLButtonElement).value);

		const date = dateAndTaskStr.split('_')[0];
		const task = dateAndTaskStr.split('_')[1];

		const newTaskObj = {
			date,
			task,
			previousLevel,
		};

		const newTask = new Task(newTaskObj);

		await newTask.save();

		getWeekData();
	};

	const getWeekData = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/log/weekly/${userState.id}/${formattedFirstOfWeek}`,
			method: 'GET',
		});

		if (!responseData) {
			return;
		}

		console.log(responseData.datesArray);
		console.log(responseData.responseArray);

		setDatesArray(responseData.datesArray);
		setIsLoading(false);
		setDataArray(responseData.responseArray);
	};

	useEffect(() => {
		if (userState.id) {
			getWeekData();
			getMonthFn({
				type: getMonthFnTypes.STATE,
				monthNumber: chosenDate.getMonth(),
				abreviation: false,
				setState: setMonthStr,
			});
		}
	}, [userState.id, chosenDate]);

	return (
		<div className={classes.wrapper}>
			<WeeklyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`Semaine: ${getISOWeek(chosenDate)} | ${monthStr} ${getYear(
					chosenDate
				)}`}
			/>
			<div>
				<div className={classes.days}>
					<li></li>
					<li className={classes.days__day}>
						LUN <br />
						{addDays(firstOfWeek, 0).getDate()}
					</li>
					<li className={classes.days__day}>
						MAR <br />
						{addDays(firstOfWeek, 1).getDate()}
					</li>
					<li className={classes.days__day}>
						MER <br />
						{addDays(firstOfWeek, 2).getDate()}
					</li>
					<li className={classes.days__day}>
						JEU
						<br /> {addDays(firstOfWeek, 3).getDate()}
					</li>
					<li className={classes.days__day}>
						VEN <br />
						{addDays(firstOfWeek, 4).getDate()}
					</li>
					<li className={classes.days__day}>
						SAM <br />
						{addDays(firstOfWeek, 5).getDate()}
					</li>
					<li className={classes.days__day}>
						DIM <br />
						{addDays(firstOfWeek, 6).getDate()}
					</li>
				</div>
				<div className={classes.six}>
					<WeekViewTasks
						isLoading={isLoading}
						dataArray={dataArray}
						datesArray={datesArray}
						onClick={addData}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
