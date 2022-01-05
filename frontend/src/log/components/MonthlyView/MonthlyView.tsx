import React, { useEffect, useState, useRef } from 'react';
import { addMonths, getYear, format, addHours, addDays, parseISO } from 'date-fns';
import classes from './MonthlyView.module.scss';
import { RootState } from '../../../shared/store/store';
import { useSelector } from 'react-redux';

const MonthlyView: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);
	const [chosenMonth, setChosenMonth] = useState<Date>(new Date());
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<any[]>([]);
	const [datesArray, setDatesArray] = useState<any[]>([]);
	const selectSixRef = useRef<HTMLSelectElement>(null);
	const [currentTask, setCurrentTask] = useState(selectSixRef.current?.value);

	const selectHandler = () => {
		if (selectSixRef.current) {
			console.log(selectSixRef.current.value);
			setCurrentTask(selectSixRef.current?.value);
		}
	};

	const previousMonthHandler = () => {
		setChosenMonth(addMonths(chosenMonth, -1));
	};

	const nextMonthHandler = () => {
		setChosenMonth(addMonths(chosenMonth, 1));
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenMonth, 'yyyy-MM-dd');
		if (selectSixRef.current) {
			const response = await fetch(
				`http://localhost:8080/api/logs/monthly/${userState.id}/${chosenMonthStr}/${currentTask}`,
				{
					headers: { 'Content-Type': 'application/json' },
					method: 'GET',
				}
			);

			const responseData = await response.json();
			const { datesArray: responseDatesArray, responseArray } = responseData;
			setDatesArray(responseDatesArray);
			console.log({ responseArray });
			console.log({ responseDatesArray });
			setMonthlyArray(responseArray);
		}
	};

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		console.log(date);
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		console.log(task);
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);
		console.log(typeof prevLevel);

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
		getMonthlyData();
		console.log('data sent');
	};

	useEffect(() => {
		if (typeof selectSixRef.current?.value === 'string') {
			setCurrentTask(selectSixRef.current?.value);
			getMonthlyData();
		}
	}, [userState.id, chosenMonth, currentTask]);

	useEffect(() => {
		switch (chosenMonth.getMonth()) {
			case 0:
				setMonthStr('Janvier');
				break;
			case 1:
				setMonthStr('Février');
				break;
			case 2:
				setMonthStr('Mars');
				break;
			case 3:
				setMonthStr('Avril');
				break;
			case 4:
				setMonthStr('Mai');
				break;
			case 5:
				setMonthStr('Juin');
				break;
			case 6:
				setMonthStr('Juillet');
				break;
			case 7:
				setMonthStr('Août');
				break;
			case 8:
				setMonthStr('Septembre');
				break;
			case 9:
				setMonthStr('Octobre');
				break;
			case 10:
				setMonthStr('Novembre');
				break;
			case 11:
				setMonthStr('Décembre');
				break;
			default:
				break;
		}
	}, [chosenMonth]);

	return (
		<div className={classes.wrapper}>
			<div className={classes.month}>
				<button onClick={previousMonthHandler}>Mois précédent</button>
				<div>
					{monthStr} {getYear(chosenMonth)}
				</div>
				<button onClick={nextMonthHandler}>Mois suivant</button>
			</div>
			<div>
				<select
					ref={selectSixRef}
					name='six'
					onChange={selectHandler}
					defaultValue='food'
				>
					<option value='food'>Alimentation</option>
					<option value='sleep'>Sommeil</option>
					<option value='sport'>Activité Physique</option>
					<option value='relaxation'>Détente</option>
					<option value='work'>Projets</option>
					<option value='social'>Vie Sociale</option>
				</select>
			</div>
			<div className={classes.button_wrapper}>
				{monthlyArray.map((item, index) => (
					<button
						className={`${classes.button} ${item === 0 ? classes.zero : ''}
							${item === 1 ? classes.one : ''}
							${item === 2 ? classes.two : ''}
						`}
						id={`${datesArray[index]}_${currentTask}`}
						onClick={addData}
						value={item}
					></button>
				))}
			</div>
		</div>
	);
};

export default MonthlyView;
