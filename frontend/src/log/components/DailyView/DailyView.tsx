import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addDays } from 'date-fns';
import { RootState } from '../../../shared/store/store';
import classes from './DailyView.module.scss';

const DailyView: React.FC = () => {
	const userState = useSelector((state: RootState) => state);

	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dailyData, setDailyData] = useState<any>([]);

	const getDailyData = async (userId: string, date: string) => {
		const response = await fetch(
			`http://localhost:8080/api/logs/daily/${userId}/${date}`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);

		let responseData = await response.json();
		if (responseData.message) {
			responseData = {
				date: chosenDate.toISOString().slice(0, 10),
				six: {
					food: 0,
					sleep: 0,
					sport: 0,
					relaxation: 0,
					work: 0,
					social: 0,
				},
			};
		}
		setDailyData(responseData);
		console.log(responseData);
		setIsLoading(false);
	};

	const previousDayHandler = () => {
		setChosenDate(addDays(chosenDate, -1));
	};

	const nextDayHandler = () => {
		setChosenDate(addDays(chosenDate, 1));
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
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
		}
	};

	useEffect(() => {
		if (typeof userState.id === 'string') {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
			console.log(dailyData);
		}
	}, [chosenDate, userState]);

	return (
		<>
			<div className={classes.wrapper}>
				<button onClick={previousDayHandler}>Jour précédent</button>
				<div>{chosenDate.toISOString().slice(0, 10)}</div>
				<button onClick={nextDayHandler}>Jour suivant</button>
			</div>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData.six).map((item: any) => (
					<>
						<div>{item[0]}</div>
						<button
							id={`${chosenDate.toISOString().slice(0, 10)}_${item[0]}`}
							onClick={taskLevelHandler}
							value={item[1]}
							className={`${classes.button} ${
								item[1] === 0 ? classes.zero : ''
							}
							${item[1] === 1 ? classes.one : ''} 
							
							${item[1] === 2 ? classes.two : ''}
						`}
						></button>
					</>
				))}
		</>
	);
};

export default DailyView;
