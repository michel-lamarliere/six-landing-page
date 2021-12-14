import React, { useEffect } from 'react';
import { getISOWeek, startOfWeek, lastDayOfWeek, addDays } from 'date-fns';
import classes from './Log.module.scss';

import WeekView from '../components/WeekView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const currentDate = new Date();
	const modifiedDate = addDays(currentDate, -1);

	console.log({ currentDate });

	const currentDay = currentDate.getDay();
	console.log({ currentDay });

	const weekNumber = getISOWeek(modifiedDate);
	console.log({ weekNumber });

	let firstOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	let lastOfWeek = lastDayOfWeek(currentDate, { weekStartsOn: 1 });

	let firstOfWeekISO = startOfWeek(currentDate, { weekStartsOn: 1 })
		.toISOString()
		.slice(0, 10);
	let lastOfWeekISO = lastDayOfWeek(currentDate, { weekStartsOn: 1 })
		.toISOString()
		.slice(0, 10);
	console.log({ firstOfWeek });
	console.log({ lastOfWeek });

	const calendarView = () => {
		fetch('/api/log/weekly', {
			method: 'GET',
			body: JSON.stringify({
				email: userState.email,
				startDate: firstOfWeekISO,
				endDate: lastOfWeekISO,
			}),
		});
	};

	useEffect(() => {}, []);

	return (
		<div className={classes.wrapper}>
			{userState.id && (
				<>
					<h1>Journal | Vue Semaine</h1>
					<WeekView
						weekNumber={weekNumber}
						monday={firstOfWeek.getDate()}
						tuesday={addDays(firstOfWeek, 1).getDate()}
						wednesday={addDays(firstOfWeek, 2).getDate()}
						thursday={addDays(firstOfWeek, 3).getDate()}
						friday={addDays(firstOfWeek, 4).getDate()}
						saturday={addDays(firstOfWeek, 5).getDate()}
						sunday={addDays(firstOfWeek, 6).getDate()}
					/>
				</>
			)}
		</div>
	);
};

export default Log;
