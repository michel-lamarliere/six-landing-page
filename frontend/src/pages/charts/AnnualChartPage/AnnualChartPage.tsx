import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addYears, getYear, isBefore, addMonths } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';

import { RootState } from '../../../store/_store';
import { TaskSelectorActionTypes } from '../../../store/task-selector';

import { useRequest } from '../../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../../hooks/dates-hook';

import Calendar, { calendarTypes } from '../../../components/calendar/Calendar/Calendar';

import classes from './AnnualChartPage.module.scss';

const AnnualGraph: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();

	const userState = useSelector((state: RootState) => state.user);

	const [chosenYear, setChosenYear] = useState<Date>(new Date());
	const [chosenTask, setChosenTask] = useState('food');
	const [data, setData] = useState<{}[]>([]);

	const previousHandler = () => {
		setChosenYear(addYears(chosenYear, -1));
	};

	const nextHandler = () => {
		setChosenYear(addYears(chosenYear, 1));
	};

	const selectHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		setChosenTask((event.target as HTMLButtonElement).value);

		dispatch({ type: TaskSelectorActionTypes.HIDE_TASK_SELECTOR });
	};

	const getGraph = async () => {
		const responseData = await sendRequest({
			url: `${process.env.REACT_APP_BACKEND_URL}/charts/annual/${
				userState.id
			}/${getYear(chosenYear)}/${chosenTask}`,
			method: 'GET',
		});

		createChartData(responseData.array);
	};

	const createChartData = (
		array: { future: number; empty: number; half: number; full: number }[]
	) => {
		const data: {}[] = [];

		for (let i = 0; i < array.length; i++) {
			let month = getMonthFn({
				type: getMonthFnTypes.VARIABLE,
				monthNumber: i,
				abreviation: true,
			});

			const thisMonth = {
				name: month,
				future: array[i].future,
				empty: array[i].empty,
				half: array[i].half,
				full: array[i].full,
			};

			data.push(thisMonth);
		}
		setData(data);
		return data;
	};

	useEffect(() => {
		getGraph();
	}, [chosenYear, chosenTask]);

	return (
		<div className={classes.wrapper}>
			<Calendar
				calendar={calendarTypes.ANNUAL_CHART}
				chosenTask={chosenTask}
				selectHandler={selectHandler}
				previousHandler={previousHandler}
				previousHandlerDisabled={isBefore(
					addMonths(chosenYear, -1),
					new Date(2020, 1, 1)
				)}
				headerText={chosenYear.getFullYear().toString()}
				nextHandler={nextHandler}
				nextHandlerDisabled={!isBefore(addMonths(chosenYear, 1), new Date())}
			/>
			<div className={classes.chart}>
				<ResponsiveContainer width='70%' height='40%'>
					<BarChart data={data.slice(0, 6)}>
						<XAxis
							dataKey='name'
							stroke='#25345F'
							tick={{ fill: '#A2AAD4' }}
							style={{ fontSize: '16px' }}
						/>
						<Bar dataKey='future' stackId='a' fill='#5b5b5b' barSize={40} />
						<Bar dataKey='empty' stackId='a' fill='#080e46' />
						<Bar dataKey='half' stackId='a' fill='#3f4cbf' />
						<Bar dataKey='full' stackId='a' fill='#36d5d6' />
					</BarChart>
				</ResponsiveContainer>
				<ResponsiveContainer width='70%' height='40%'>
					<BarChart data={data.slice(6)}>
						<XAxis
							dataKey='name'
							stroke='#25345F'
							tick={{ fill: '#A2AAD4' }}
							style={{ fontSize: '16px' }}
						/>
						<Bar dataKey='future' stackId='a' fill='#5b5b5b' barSize={40} />
						<Bar dataKey='empty' stackId='a' fill='#080e46' />
						<Bar dataKey='half' stackId='a' fill='#3f4cbf' />
						<Bar dataKey='full' stackId='a' fill='#36d5d6' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default AnnualGraph;
