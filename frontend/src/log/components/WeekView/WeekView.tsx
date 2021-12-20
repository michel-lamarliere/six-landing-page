import React, { useState, useEffect } from 'react';
import { addDays, getISOWeek, startOfWeek, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../../shared/store/store';

import classes from './WeekView.module.scss';

import WeekViewButtons from './WeekViewButtons';

const WeekView: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const [weekData, setWeekData] = useState<{ date: string; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const currentDate = addDays(new Date(), 0);
	const weekNumber = getISOWeek(currentDate);
	const firstOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

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
		console.log(responseJson);

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
		console.log(array);
		setMappingArray(array);
	};

	const taskLevelHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		console.log(date, task);
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);

		console.log(date, task);

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
	}, [userState.id]);

	// const getButtonColor = (event: React.MouseEvent<HTMLButtonElement>) => {
	// 	let className;

	// 	switch ((event.target as HTMLButtonElement).value) {
	// 		case '0':
	// 			className = classes.zero;
	// 			break;
	// 		case '1':
	// 			className = classes.one;
	// 			break;
	// 		case '2':
	// 			className = classes.two;
	// 			break;
	// 	}

	// 	return className;
	// };

	return (
		<div className={classes.wrapper}>
			<h2>Semaine: {weekNumber}</h2>
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
					<WeekViewButtons
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='food'
						one={classes.one}
						two={classes.two}
						zero={classes.zero}
					/>
					<WeekViewButtons
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='sleep'
					/>
					<WeekViewButtons
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='sport'
					/>
					<WeekViewButtons
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='relaxation'
					/>
					<WeekViewButtons
						isLoading={isLoading}
						array={mappingArray}
						onClick={taskLevelHandler}
						taskName='work'
					/>
					<WeekViewButtons
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
