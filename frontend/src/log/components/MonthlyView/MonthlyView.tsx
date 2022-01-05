import React, { useEffect, useState, useRef } from 'react';
import { addMonths, getYear, format, isAfter } from 'date-fns';
import classes from './MonthlyView.module.scss';
import { RootState } from '../../../shared/store/store';
import { useSelector } from 'react-redux';
import { DataButton } from '../../../shared/components/UIElements/Buttons';

const MonthlyView: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);
	const [chosenDate, setChosenDate] = useState<Date>(new Date());
	const [monthStr, setMonthStr] = useState('');
	const [monthlyArray, setMonthlyArray] = useState<number[]>([]);
	const [datesArray, setDatesArray] = useState<string[]>([]);
	const selectSixRef = useRef<HTMLSelectElement>(null);
	const [currentTask, setCurrentTask] = useState(selectSixRef.current?.value);

	const selectHandler = () => {
		if (selectSixRef.current) {
			setCurrentTask(selectSixRef.current?.value);
		}
	};

	const previousMonthHandler = () => {
		setChosenDate(addMonths(chosenDate, -1));
	};

	const nextMonthHandler = () => {
		if (!isAfter(addMonths(chosenDate, 1), new Date())) {
			setChosenDate(addMonths(chosenDate, 1));
		}
	};

	const getMonthlyData = async () => {
		const chosenMonthStr = format(chosenDate, 'yyyy-MM-dd');
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
			setMonthlyArray(responseArray);
		}
	};

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
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
		getMonthlyData();
	};

	useEffect(() => {
		if (typeof selectSixRef.current?.value === 'string') {
			setCurrentTask(selectSixRef.current?.value);
			getMonthlyData();
		}
	}, [userState.id, chosenDate, currentTask]);

	useEffect(() => {
		switch (chosenDate.getMonth()) {
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
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<div className={classes.month}>
				<button onClick={previousMonthHandler}>Mois précédent</button>
				<div>
					{monthStr} {getYear(chosenDate)}
				</div>
				<button
					onClick={nextMonthHandler}
					disabled={isAfter(addMonths(chosenDate, 1), new Date())}
				>
					Mois suivant
				</button>
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
			<div className={classes.calendar_wrapper}>
				{monthlyArray.map((item, index) => (
					<div
						key={`${datesArray[index]}_${currentTask}_div`}
						className={classes.button_wrapper}
					>
						<div>{index + 1}</div>
						<DataButton
							id={`${datesArray[index]}_${currentTask}`}
							onClick={addData}
							value={item}
							disabled={
								!isAfter(
									new Date(
										+datesArray[index].slice(0, 4),
										+datesArray[index].slice(5, 7) === 12
											? 11
											: +datesArray[index].slice(5, 7) - 1,
										+datesArray[index].slice(8, 10)
									),
									new Date()
								)
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MonthlyView;
