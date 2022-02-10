import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store/store';
import { ErrorPopupActionTypes } from '../../shared/store/error';

import WeekViewTasks from '../components/WeeklyViewTasks';
import LogHeader from '../components/LogHeader';

import { useRequest } from '../../shared/hooks/http-hook';
import { useDates } from '../../shared/hooks/dates-hook';

import {
	addDays,
	getISOWeek,
	startOfWeek,
	format,
	getYear,
	isAfter,
	isSameDay,
} from 'date-fns';

import classes from './WeeklyView.module.scss';

const WeekView: React.FC = () => {
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDates();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [weekData, setWeekData] = useState<{ date: Date; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [chosenDate, setChosenDate] = useState(addDays(new Date(), 0));
	const [month, setMonth] = useState('');
	const firstOfWeek = startOfWeek(chosenDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);

		if (userState.id) {
			const responseData = await sendData(userState.id, dateAndTaskStr, prevLevel);

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: ErrorPopupActionTypes.SET_ERROR,
					message: responseData.error,
				});
			}

			getWeekData(userState.id, formattedFirstOfWeek);
		}
	};

	const getWeekData = async (userId: string, formattedFirstOfWeekStr: string) => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/weekly/${userId}/${formattedFirstOfWeekStr}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setIsLoading(false);
		setWeekData(responseData);
		getMappingArray(responseData, firstOfWeek);
	};

	const emptySixObject = (logDate: Date) => {
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

	const getMappingArray = (weekData: { date: Date; six: {} }[], firstOfWeek: Date) => {
		let array = [];
		let i = 0;
		let y = 0;

		do {
			if (
				weekData[i] &&
				isSameDay(new Date(weekData[i].date), addDays(firstOfWeek, y))
			) {
				array.push(weekData[i]);
				i++;
				y++;
			} else {
				array.push(emptySixObject(addDays(firstOfWeek, y)));
				y++;
			}
		} while (array.length < 7);

		setMappingArray(array);
	};

	useEffect(() => {
		if (userState.id) {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMappingArray(weekData, firstOfWeek);
		}
	}, [userState.id, chosenDate]);

	useEffect(() => {
		getMonthFn(chosenDate.getMonth(), true, setMonth);
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<LogHeader
				setDate={setChosenDate}
				date={chosenDate}
				text={`Semaine: ${getISOWeek(chosenDate)} | ${month} ${getYear(
					chosenDate
				)}`}
				calendar='WEEKLY'
			/>
			<div>
				<div className={classes.days}>
					<li>Lundi {addDays(firstOfWeek, 0).getDate()}</li>
					<li>Mardi {addDays(firstOfWeek, 1).getDate()}</li>
					<li>Mercredi {addDays(firstOfWeek, 2).getDate()}</li>
					<li>Jeudi {addDays(firstOfWeek, 3).getDate()}</li>
					<li>Vendredi {addDays(firstOfWeek, 4).getDate()}</li>
					<li>Samedi {addDays(firstOfWeek, 5).getDate()}</li>
					<li>Dimanche {addDays(firstOfWeek, 6).getDate()}</li>
				</div>
				<div className={classes.six}>
					<div className={classes.six_titles}>
						<li>Food</li>
						<li>Sleep</li>
						<li>Sport</li>
						<li>Relaxation</li>
						<li>Work</li>
						<li>Social</li>
					</div>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={addData}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
