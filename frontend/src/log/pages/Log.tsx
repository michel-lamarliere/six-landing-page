import React from 'react';
import { useParams } from 'react-router-dom';
import { getWeek, startOfWeek, addDays } from 'date-fns';
import classes from './Log.module.scss';

import WeekView from '../components/WeekView';

const Log: React.FC = () => {
	const userId = useParams().userId;

	const currentDate = new Date();
	const modifiedDate = addDays(currentDate, 0);
	console.log({ currentDate });

	const currentDay = currentDate.getDay();
	console.log({ currentDay });

	const weekNumber = getWeek(modifiedDate, {
		weekStartsOn: 1,
		firstWeekContainsDate: 4,
	});
	console.log({ weekNumber });

	let firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	console.log({ firstDayOfWeek });

	return (
		<div className={classes.wrapper}>
			<h1>Log {userId}</h1>
			<button>Choose view</button>
			<WeekView
				weekNumber={weekNumber}
				monday={firstDayOfWeek.getDate()}
				tuesday={addDays(firstDayOfWeek, 1).getDate()}
				wednesday={addDays(firstDayOfWeek, 2).getDate()}
				thursday={addDays(firstDayOfWeek, 3).getDate()}
				friday={addDays(firstDayOfWeek, 4).getDate()}
				saturday={addDays(firstDayOfWeek, 5).getDate()}
				sunday={addDays(firstDayOfWeek, 6).getDate()}
			/>
		</div>
	);
};

export default Log;
