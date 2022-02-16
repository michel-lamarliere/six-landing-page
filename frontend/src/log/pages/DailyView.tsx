import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getDate, getDay, getYear, format } from 'date-fns';

import { RootState } from '../../_shared/store/store';
import { ErrorPopupActionTypes } from '../../_shared/store/error';

import { useRequest } from '../../_shared/hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../_shared/hooks/dates-hook';

import { DataButton } from '../components/Buttons';
import DailyCalendar from '../../_shared/components/Calendar/DailyCalendar';

import classes from './DailyView.module.scss';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getDayFn, getMonthFn } = useDatesFn();

	const userState = useSelector((state: RootState) => state.user);

	const [dailyData, setDailyData] = useState<any>([]);

	// CALENDAR
	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dayStr, setDayStr] = useState('');
	const [monthStr, setMonthStr] = useState('');

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);
		console.log((event.target as HTMLElement).id);

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
				return;
			}
			if (responseData) {
				getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
			}
		}
	};

	const getDailyData = async (userId: string, date: string) => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/daily/${userId}/${date}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setDailyData(responseData);
		setIsLoading(false);
	};

	useEffect(() => {
		if (userState.id) {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
			getDayFn(getDay(chosenDate), setDayStr);
			getMonthFn(getMonthFnTypes.STATE, chosenDate.getMonth(), setMonthStr);
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<DailyCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`${dayStr} ${getDate(chosenDate)} ${monthStr} ${getYear(
					chosenDate
				)}`}
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
