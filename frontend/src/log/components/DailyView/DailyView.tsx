import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { addDays, getDate, getDay, getYear, isAfter } from 'date-fns';
import { RootState } from '../../../shared/store/store';
import classes from './DailyView.module.scss';

import { DataButton } from '../../../shared/components/UIElements/Buttons';

const DailyView: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [fullDate, setFullDate] = useState({
		day: '',
		month: '',
		year: '',
	});
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
		setIsLoading(false);
	};

	const previousDayHandler = () => {
		setChosenDate(addDays(chosenDate, -1));
	};

	const nextDayHandler = () => {
		if (!isAfter(addDays(chosenDate, 1), new Date())) {
			setChosenDate(addDays(chosenDate, 1));
		}
	};

	const taskLevelHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);

		await fetch(`http://localhost:8080/api/logs/task`, {
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
		}
		// }, [chosenDate, userState]);
	}, [chosenDate]);

	useEffect(() => {
		switch (getDay(chosenDate)) {
			case 1:
				setFullDate((prev) => ({
					...prev,
					day: 'Lundi',
				}));
				break;
			case 2:
				setFullDate((prev) => ({
					...prev,
					day: 'Mardi',
				}));
				break;
			case 3:
				setFullDate((prev) => ({
					...prev,
					day: 'Mercredi',
				}));
				break;
			case 4:
				setFullDate((prev) => ({
					...prev,
					day: 'Jeudi',
				}));
				break;
			case 5:
				setFullDate((prev) => ({
					...prev,
					day: 'Vendredi',
				}));
				break;
			case 6:
				setFullDate((prev) => ({
					...prev,
					day: 'Samedi',
				}));
				break;
			case 0:
				setFullDate((prev) => ({
					...prev,
					day: 'Dimanche',
				}));
				break;
		}

		switch (chosenDate.getMonth()) {
			case 0:
				setFullDate((prev) => ({
					...prev,
					month: 'Janvier',
				}));
				break;
			case 1:
				setFullDate((prev) => ({
					...prev,
					month: 'Février',
				}));
				break;
			case 2:
				setFullDate((prev) => ({
					...prev,
					month: 'Mars',
				}));
				break;
			case 3:
				setFullDate((prev) => ({
					...prev,
					month: 'Avril',
				}));
				break;
			case 4:
				setFullDate((prev) => ({
					...prev,
					month: 'Mai',
				}));
				break;
			case 5:
				setFullDate((prev) => ({
					...prev,
					month: 'Juin',
				}));
				break;
			case 6:
				setFullDate((prev) => ({
					...prev,
					month: 'Janvier',
				}));
				break;
			case 7:
				setFullDate((prev) => ({
					...prev,
					month: 'Août',
				}));
				break;
			case 8:
				setFullDate((prev) => ({
					...prev,
					month: 'Septembre',
				}));
				break;
			case 9:
				setFullDate((prev) => ({
					...prev,
					month: 'Octobre',
				}));
				break;
			case 10:
				setFullDate((prev) => ({
					...prev,
					month: 'Novembre',
				}));
				break;
			case 11:
				setFullDate((prev) => ({
					...prev,
					month: 'Décembre',
				}));
				break;
			default:
				break;
		}
	}, [chosenDate]);

	return (
		<>
			<div className={classes.wrapper}>
				<button onClick={previousDayHandler}>Jour précédent</button>
				<div>
					{fullDate.day} {getDate(chosenDate)} {fullDate.month}{' '}
					{getYear(chosenDate)}
				</div>
				<button
					onClick={nextDayHandler}
					disabled={isAfter(addDays(chosenDate, 1), new Date())}
				>
					Jour suivant
				</button>
			</div>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData.six).map((item: any) => (
					<div key={`${chosenDate.toISOString().slice(0, 10)}_${item[0]}_task`}>
						<div>{item[0]}</div>
						<DataButton
							id={`${chosenDate.toISOString().slice(0, 10)}_${item[0]}`}
							onClick={taskLevelHandler}
							value={item[1]}
							disabled={true}
						/>
					</div>
				))}
		</>
	);
};

export default DailyView;
