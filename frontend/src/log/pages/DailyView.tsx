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
import { useDates } from '../../shared/hooks/dates-hook';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getDayFn, getMonthFn } = useDates();

	const userState = useSelector((state: RootState) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [day, setDay] = useState('');
	const [month, setMonth] = useState('');
	const [dailyData, setDailyData] = useState<any>([]);

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
			getDayFn(getDay(chosenDate), setDay);
			getMonthFn(chosenDate.getMonth(), true, setMonth);
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<LogHeader
				date={chosenDate}
				setDate={setChosenDate}
				text={`${day} ${getDate(chosenDate)} ${month}
					${getYear(chosenDate)}`}
				calendar={'DAILY'}
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
