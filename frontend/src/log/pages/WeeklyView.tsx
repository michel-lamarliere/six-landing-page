import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addDays, getISOWeek, startOfWeek, format, getYear } from 'date-fns';

import { RootState } from '../../_shared/store/store';
import { ErrorPopupActionTypes } from '../../_shared/store/error';

import { useRequest } from '../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../_shared/hooks/dates-hook';

import WeekViewTasks from '../components/WeeklyViewTasks';
import WeeklyCalendar from '../../_shared/components/Calendar/WeeklyCalendar';

import classes from './WeeklyView.module.scss';

const WeekView: React.FC = () => {
	const { sendRequest, sendData } = useRequest();
	const { getMonthFn } = useDatesFn();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [mappingArray, setMappingArray] = useState<{ date: Date; six: {} }[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// CALENDAR
	const [chosenDate, setChosenDate] = useState(addDays(new Date(), 0));
	const [monthStr, setMonthStr] = useState('');
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
		setMappingArray(responseData);
	};

	useEffect(() => {
		if (userState.id) {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMonthFn(getMonthFnTypes.STATE, chosenDate.getMonth(), false, setMonthStr);
			console.log(mappingArray);
			console.log(typeof mappingArray[1]);
		}
	}, [userState.id, chosenDate]);

	return (
		<div className={classes.wrapper}>
			<WeeklyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`Semaine: ${getISOWeek(chosenDate)} | ${monthStr} ${getYear(
					chosenDate
				)}`}
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
					<div className={classes.six__titles}>
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
