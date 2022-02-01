import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDays, getDate, getDay, getYear, isAfter, format } from 'date-fns';
import classes from './DailyView.module.scss';

import { useRequest } from '../../shared/hooks/http-hook';
import { DataButton } from '../components/Buttons';
import { RootState } from '../../shared/store/store';
import ErrorPopup from '../../shared/components/UIElements/ErrorPopup';
import { ErrorPopupActionTypes } from '../../shared/store/error';
import LogHeader from '../components/LogHeader';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
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
		let responseData = await sendRequest(
			`http://localhost:8080/api/log/daily/${userId}/${date}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

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

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		let date = (event.target as HTMLElement).id.split('_')[0];
		let task = (event.target as HTMLButtonElement).id.split('_')[1];
		let prevLevel = parseInt((event.target as HTMLButtonElement).value);

		if (userState.id && userState.email) {
			const responseData = await sendData(
				userState.id,
				userState.email,
				date,
				task,
				prevLevel
			);

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: ErrorPopupActionTypes.SET_ERROR,
					message: responseData.error,
				});
			}
		}

		if (typeof userState.id === 'string') {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
		}
	};

	useEffect(() => {
		if (typeof userState.id === 'string') {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
		}
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
		<div className={classes.wrapper}>
			<LogHeader
				button_previous_text='Jour précédent'
				button_previous_handler={previousDayHandler}
				button_next_text='Jour suivant'
				button_next_handler={nextDayHandler}
				button_next_disabled={isAfter(addDays(chosenDate, 1), new Date())}
				text={`${fullDate.day} ${getDate(chosenDate)} ${fullDate.month}
					${getYear(chosenDate)}`}
			/>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData.six).map((item: any) => (
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
