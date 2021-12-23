import React, { useState, useEffect } from 'react';
import { addDays, getISOWeek, startOfWeek, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/store/store';

import classes from './WeeklyView.module.scss';

import WeekViewTasks from './WeeklyViewTasks';
import WeekViewButtons from './WeeklyViewButtons';

const WeekView: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const [weekData, setWeekData] = useState<{ date: string; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [currentDate, setCurrentDate] = useState(addDays(new Date(), 0));
	const firstOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const previousWeekHandler = () => {
		setCurrentDate(addDays(currentDate, -7));
	};

	const nextWeekHandler = () => {
		setCurrentDate(addDays(currentDate, 7));
	};

	const getWeekData = async (userId: string, formattedFirstOfWeekStr: string) => {
		const response = await fetch(
			`http://localhost:8080/api/logs/weekly/${userId}/${formattedFirstOfWeekStr}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
		setIsLoading(false);
		const responseJson = await response.json();

		setWeekData(responseJson);
		getMappingArray(responseJson, firstOfWeek);
	};

	const setEmptyArray = (logDate: string) => {
		let emptySix = {
			date: logDate,
			six: {
				food: 0,
				sleep: 0,
				sport: 0,
				relaxation: 0,
				work: 0,
				social: 0,
			},
		};

		return emptySix;
	};

	const getMappingArray = (
		weekData: { date: string; six: {} }[],
		firstOfWeek: Date
	) => {
		let array = [];
		let i = 0;
		let y = 0;
		do {
			if (
				weekData[i] &&
				weekData[i].date === format(addDays(firstOfWeek, y), 'yyyy-MM-dd')
			) {
				array.push(weekData[i]);
				i++;
				y++;
			} else {
				array.push(setEmptyArray(format(addDays(firstOfWeek, y), 'yyyy-MM-dd')));
				y++;
			}
		} while (array.length < 7);
		setMappingArray(array);
	};

	const taskLevelHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);

		await fetch(`http://localhost:8080/api/logs/six`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id: userState.id,
				email: userState.email,
				date: date,
				task: task,
				levelOfCompletion: prevLevel !== 2 ? prevLevel + 1 : 0,
			}),
		});

		if (typeof userState.id === 'string') {
			getWeekData(userState.id, formattedFirstOfWeek);
		}
	};

	useEffect(() => {
		if (typeof userState.id === 'string') {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMappingArray(weekData, firstOfWeek);
		}
	}, [userState.id, currentDate]);

	return (
		<div className={classes.wrapper}>
			<WeekViewButtons
				weekNumber={getISOWeek(currentDate)}
				previousWeekHandler={previousWeekHandler}
				nextWeekHandler={nextWeekHandler}
			/>
			<div className={classes.days}>
				<th>Lundi {addDays(firstOfWeek, 0).getDate()}</th>
				<th>Mardi {addDays(firstOfWeek, 1).getDate()}</th>
				<th>Mercredi {addDays(firstOfWeek, 2).getDate()}</th>
				<th>Jeudi {addDays(firstOfWeek, 3).getDate()}</th>
				<th>Vendredi {addDays(firstOfWeek, 4).getDate()}</th>
				<th>Samedi {addDays(firstOfWeek, 5).getDate()}</th>
				<th>Dimanche {addDays(firstOfWeek, 6).getDate()}</th>
			</div>
			<div className={classes.six}>
				<div className={classes.titles}>
					<li>Food</li>
					<li>Sleep</li>
					<li>Sport</li>
					<li>Relaxation</li>
					<li>Work</li>
					<li>Social</li>
				</div>
				<div className={classes.list}>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='food'
						one={classes.one}
						two={classes.two}
						zero={classes.zero}
					/>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='sleep'
					/>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='sport'
					/>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='relaxation'
					/>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='work'
					/>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='social'
					/>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
