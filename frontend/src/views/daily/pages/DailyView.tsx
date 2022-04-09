import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getDate, getDay, getYear, format } from 'date-fns';

import { RootState } from '../../../_shared/store/_store';

import { useRequest } from '../../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../_shared/hooks/dates-hook';
import { useTaskClass } from '../../../_shared/classes/task-class-hook';

import { DataButton } from '../../components/ViewButtons';
import DailyCalendar from '../components/DailyCalendar';

import classes from './DailyView.module.scss';

const DailyView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getDayFn, getMonthFn } = useDatesFn();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	const [dailyData, setDailyData] = useState<{}>();

	// CALENDAR
	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dayStr, setDayStr] = useState('');
	const [monthStr, setMonthStr] = useState('');

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

		getDailyData();
	};

	const getDailyData = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/log/daily/${userState.id}/${format(
				chosenDate,
				'yyyy-MM-dd'
			)}`,
			method: 'GET',
		});

		if (!responseData) {
			return;
		}

		setDailyData(responseData);
		setIsLoading(false);
	};

	useEffect(() => {
		if (userState.id) {
			getDailyData();
			getDayFn({ dayNumber: getDay(chosenDate), setState: setDayStr });
			getMonthFn({
				type: getMonthFnTypes.STATE,
				monthNumber: chosenDate.getMonth(),
				abreviation: false,
				setState: setMonthStr,
			});
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<DailyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`${dayStr} ${getDate(chosenDate)} ${monthStr} ${getYear(
					chosenDate
				)}`}
			/>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData).map((item: any[]) => (
					<div
						className={classes.task}
						key={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}_task`}
					>
						<div>{item[0]}</div>
						<DataButton
							id={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}`}
							onClick={addData}
							value={item[1]}
							disabled={true}
						/>
					</div>
				))}
		</div>
	);
};

export default DailyView;
