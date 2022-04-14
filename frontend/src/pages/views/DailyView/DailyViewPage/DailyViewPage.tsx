import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getDate, getDay, getYear, format } from 'date-fns';

import { RootState } from '../../../../store/_store';

import { useRequest } from '../../../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../../hooks/dates-hook';
import { useTaskClass } from '../../../../classes/task-class-hook';
import { useSixNameHook } from '../../../../hooks/six-name-hook';

import LogDataButton from '../../LogDataButtons/LogDataButtons';
import DailyViewCalendar from '../DailyViewCalendar/DailyViewCalendar';
import ViewsContainer from '../../../../containers/ViewsContainer/ViewsContainer';

import foodIcon from '../../../../assets/icons/six/food.svg';
import sleepIcon from '../../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../../assets/icons/six/sports.svg';
import relaxationIcon from '../../../../assets/icons/six/relaxation.svg';
import workIcon from '../../../../assets/icons/six/work.svg';
import socialIcon from '../../../../assets/icons/six/social.svg';

import classes from './DailyViewPage.module.scss';

const DailyView: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getDayFn, getMonthFn } = useDatesFn();
	const { translateSixName } = useSixNameHook();
	const { Task } = useTaskClass();

	const userState = useSelector((state: RootState) => state.user);

	const [dailyData, setDailyData] = useState<{}>();

	// CALENDAR
	const [isLoading, setIsLoading] = useState(true);
	const [chosenDate, setChosenDate] = useState(new Date());
	const [dayStr, setDayStr] = useState('');
	const [monthStr, setMonthStr] = useState('');

	const sixIcons = [
		foodIcon,
		sleepIcon,
		sportsIcon,
		workIcon,
		relaxationIcon,
		socialIcon,
	];

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const dateAndTaskStr = (event.target as HTMLElement).id;
		const previousLevel = parseInt((event.target as HTMLButtonElement).value);

		const date = dateAndTaskStr.split('_')[0];
		const task = dateAndTaskStr.split('_')[1];

		const newTaskObj = {
			date,
			task,
			previousLevel,
		};

		const newTask = new Task(newTaskObj);

		await newTask.save();

		getDailyData();
	};

	const getDailyData = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/log/daily/${userState.id}/${format(
				chosenDate,
				'yyyy-MM-dd'
			)}`,
			method: 'GET',
		});

		if (!responseData) {
			return;
		}

		setDailyData(responseData);
		setIsLoading(false);
	};

	useEffect(() => {
		if (userState.id) {
			getDailyData();
			getDayFn({ dayNumber: getDay(chosenDate), setState: setDayStr });
			getMonthFn({
				type: getMonthFnTypes.STATE,
				monthNumber: chosenDate.getMonth(),
				abreviation: false,
				setState: setMonthStr,
			});
		}
	}, [chosenDate]);

	return (
		<ViewsContainer>
			<DailyViewCalendar
				chosenDate={chosenDate}
				setChosenDate={setChosenDate}
				headerText={`${dayStr} ${getDate(chosenDate)} ${monthStr} ${getYear(
					chosenDate
				)}`}
			/>
			{!isLoading &&
				dailyData &&
				Object.entries(dailyData).map((item: any[], index) => (
					<div
						className={classes.task}
						key={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}_task`}
					>
						<div className={classes['task-name']}>
							<img
								src={sixIcons[index]}
								alt='six'
								className={classes['task-name__img']}
							/>
							<div className={classes['task-name__text']}>
								{translateSixName(item[0])}
							</div>
						</div>
						<LogDataButton
							id={`${format(chosenDate, 'yyyy-MM-dd')}_${item[0]}`}
							onClick={addData}
							value={item[1]}
							disabled={false}
						/>
					</div>
				))}
		</ViewsContainer>
	);
};

export default DailyView;
