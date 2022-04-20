import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { addDays, getISOWeek, startOfWeek, format, getYear } from 'date-fns';

import { RootState } from '../../../../store/_store';

import { useRequest } from '../../../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';
import { useTaskClass } from '../../../../classes/task-class-hook';

import WeekViewTasks from '../WeeklyViewTasks/WeeklyViewTasks';
import WeeklyCalendar from '../WeeklyViewCalendar/WeeklyViewCalendar';
import ViewsContainer from '../../../../containers/ViewsContainer/ViewsContainer';

import classes from './WeeklyViewPage.module.scss';

const WeekView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	const [dataArray, setDataArray] = useState<{
		nutrition: [];
		sleep: [];
		sports: [];
		relaxation: [];
		projects: [];
		socialLife: [];
	}>({
		nutrition: [],
		sleep: [],
		sports: [],
		relaxation: [],
		projects: [],
		socialLife: [],
	});
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

		const date = dateAndTaskStr.split('/')[0];
		const task = dateAndTaskStr.split('/')[1];

		const newTaskObj = {
			date,
			task,
			previousLevel,
		};

		await Task.save(newTaskObj);

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
		<ViewsContainer>
			<WeeklyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`Semaine: ${getISOWeek(chosenDate)} | ${monthStr} ${getYear(
					chosenDate
				)}`}
			/>
			<WeekViewTasks
				isLoading={isLoading}
				dataArray={dataArray}
				datesArray={datesArray}
				onClick={addData}
				firstOfWeek={firstOfWeek}
			/>
			{/* </div> */}
		</ViewsContainer>
	);
};

export default WeekView;
