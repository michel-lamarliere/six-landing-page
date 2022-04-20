import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addYears, getYear, isBefore, isAfter } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts';

import { RootState } from '../../store/_store';
import { TaskSelectorActionTypes } from '../../store/task-selector';

import { useRequest } from '../../hooks/http-hook';
import { getMonthFnTypes, useDatesFn } from '../../hooks/dates-hook';

import ViewsContainer from '../../containers/ViewsContainer/ViewsContainer';
import DateNavigation, {
	DateNavigationTypes,
} from '../../components/DateNavigation/DateNavigation';
import TaskSelectorButton from '../../components/buttons/CalendarAndTaskSelectorButtons/TaskSelectorButton/TaskSelectorButton';

import classes from './AnnualChartPage.module.scss';

const AnnualGraph: React.FC = () => {
	const dispatch = useDispatch();
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDatesFn();

	const userState = useSelector((state: RootState) => state.user);

	const [chosenYear, setChosenYear] = useState<Date>(new Date());
	const [chosenTask, setChosenTask] = useState('nutrition');
	const [data, setData] = useState<{}[]>([]);

	const previousHandler = () => {
		setChosenYear(addYears(chosenYear, -1));
	};

	const nextHandler = () => {
		setChosenYear(addYears(chosenYear, 1));
	};

	const previousHandlerDisabled = () => {
		return isBefore(addYears(chosenYear, -1), new Date(2020, 0, 1));
	};

	const nextHandlerDisabled = () => {
		return isAfter(addYears(chosenYear, 1), new Date());
	};

	const selectTaskHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
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

			if (typeof month === 'string') {
				month = month.toUpperCase();
			}

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
		<ViewsContainer>
			<TaskSelectorButton
				chosenTask={chosenTask}
				selectTaskHandler={selectTaskHandler}
			/>
			<DateNavigation
				type={DateNavigationTypes.ANNUAL_CHART}
				headerText={chosenYear.getFullYear().toString()}
				previousHandler={previousHandler}
				nextHandler={nextHandler}
				previousHandlerDisabled={previousHandlerDisabled}
				nextHandlerDisabled={nextHandlerDisabled}
			/>
			<div className={classes.chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart data={data.slice(0, 6)} barSize={20}>
						<XAxis
							dataKey='name'
							stroke='#25345F'
							tick={{ fill: '#A2AAD4' }}
							style={{ fontSize: '12px' }}
						/>
						<Bar dataKey='future' stackId='a' fill='#24263e' />
						<Bar dataKey='empty' stackId='a' fill='#0b0e21' />
						<Bar dataKey='half' stackId='a' fill='#2945EB' />
						<Bar dataKey='full' stackId='a' fill='#36d5d6' />
					</BarChart>
				</ResponsiveContainer>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart data={data.slice(6)} barSize={20}>
						<XAxis
							dataKey='name'
							stroke='#25345F'
							tick={{ fill: '#A2AAD4' }}
							style={{ fontSize: '12px' }}
						/>
						<Bar dataKey='future' stackId='a' fill='#24263e' />

						<Bar dataKey='empty' stackId='a' fill='#0b0e21' />
						<Bar dataKey='half' stackId='a' fill='#3f4cbf' />
						<Bar dataKey='full' stackId='a' fill='#36d5d6' />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</ViewsContainer>
	);
};

export default AnnualGraph;
