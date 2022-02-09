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

import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';

import 'react-datepicker/dist/react-datepicker.css';
import CalendarButton from '../components/CalendarButton';

const DailyView: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest, sendData } = useRequest();
	const { getDayFn, getMonthFn } = useDates();

	registerLocale('fr', fr);

	const userState = useSelector((state: RootState) => state.user);

	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [day, setDay] = useState('');
	const [month, setMonth] = useState('');
	const [dailyData, setDailyData] = useState<any>([]);
	const [showCalendar, setShowCalendar] = useState(false);

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
		}

		if (userState.id) {
			getDailyData(userState.id, chosenDate.toISOString().slice(0, 10));
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

	const calendarButtonHandler = () => {
		setShowCalendar((prev) => !prev);
	};

	const calendarOnChangeHandler = (date: Date) => {
		setShowCalendar(false);
		setChosenDate(date);
	};

	const previousDayHandler = () => {
		setChosenDate(addDays(chosenDate, -1));
	};

	const nextDayHandler = () => {
		if (!isAfter(addDays(chosenDate, 1), new Date())) {
			setChosenDate(addDays(chosenDate, 1));
		}
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
				button_previous_text='Jour précédent'
				button_previous_handler={previousDayHandler}
				button_next_text='Jour suivant'
				button_next_handler={nextDayHandler}
				button_next_disabled={isAfter(addDays(chosenDate, 1), new Date())}
				text={`${day} ${getDate(chosenDate)} ${month}
					${getYear(chosenDate)}`}
				selector_date={
					<>
						<CalendarButton onClick={calendarButtonHandler} />
						{showCalendar && (
							<DatePicker
								selected={chosenDate}
								onChange={calendarOnChangeHandler}
								onSelect={(date: Date) => setChosenDate(date!)}
								showMonthDropdown
								showYearDropdown
								dropdownMode='select'
								minDate={new Date(2020, 0, 1)}
								maxDate={new Date()}
								calendarStartDay={1}
								locale='fr'
								inline
								formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
							/>
						)}
					</>
				}
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
