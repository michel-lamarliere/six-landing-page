import React, { useEffect, useState } from 'react';
import { isAfter, addYears, getYear, isBefore, addMonths } from 'date-fns';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { RootState } from '../../shared/store/store';
import { useSelector } from 'react-redux';
import { useRequest } from '../../shared/hooks/http-hook';

import classes from './AnnualChart.module.scss';
import { useDates } from '../../shared/hooks/dates-hook';
import Calendar from '../../shared/components/Calendar/Calendar';

const AnnualGraph: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDates();

	const userState = useSelector((state: RootState) => state.user);

	const [chosenYear, setChosenYear] = useState<any>(new Date());
	const [task, setTask] = useState('food');
	const [data, setData] = useState<any>([]);

	const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTask(event.target.value);
	};

	const getGraph = async () => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/charts/annual/${userState.id}/${getYear(
				chosenYear
			)}/${task}`,
			'GET'
		);

		createChartData(responseData.array);
	};

	const createChartData = (array: any[]) => {
		const data: any = [];

		for (let i = 0; i < array.length; i++) {
			let month = getMonthFn(i, false, null, true);
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

	const previousHandler = () => {
		setChosenYear(addYears(chosenYear, -1));
	};

	const nextHandler = () => {
		setChosenYear(addYears(chosenYear, 1));
	};

	useEffect(() => {
		getGraph();
	}, [chosenYear, task]);

	return (
		<div className={classes.wrapper}>
			<Calendar
				calendar={'ANNUAL_CHART'}
				taskSelector={true}
				selectHandler={selectHandler}
				previousHandler={previousHandler}
				previousHandlerDisabled={isBefore(
					addMonths(chosenYear, -1),
					new Date(2020, 1, 1)
				)}
				headerText={chosenYear.getFullYear()}
				nextHandler={nextHandler}
				nextHandlerDisabled={!isBefore(addMonths(chosenYear, 1), new Date())}
				calendarPreviousYearHandler={null}
				calendarPreviousYearHandlerDisabled={true}
				calendarPreviousMonthHandler={null}
				calendarPreviousMonthHandlerDisabled={true}
				calendarText={''}
				calendarNextMonthHandler={null}
				calendarNextMonthHandlerDisabled={true}
				calendarNextYearHandler={null}
				calendarNextYearHandlerDisabled={true}
			></Calendar>
			<div className={classes.chart}>
				<ResponsiveContainer width='70%' height='40%' className={classes.test}>
					<BarChart data={data.slice(0, 6)} className={classes.test}>
						<XAxis
							dataKey='name'
							axisLine={false}
							tickLine={false}
							stroke='black'
							style={{ fontSize: '16px' }}
						/>
						<YAxis tickCount={8} domain={['0', '31']} stroke='black' />
						<Bar dataKey='future' stackId='a' fill='#5b5b5b' barSize={40} />
						<Bar dataKey='empty' stackId='a' fill='#080e46' />
						<Bar dataKey='half' stackId='a' fill='#3f4cbf' />
						<Bar dataKey='full' stackId='a' fill='#36d5d6' />
					</BarChart>
				</ResponsiveContainer>
				<ResponsiveContainer width='70%' height='40%' className={classes.test}>
					<BarChart data={data.slice(6)} className={classes.test}>
						<XAxis
							dataKey='name'
							axisLine={false}
							tickLine={false}
							stroke='black'
							style={{ fontSize: '16px' }}
						/>
						<YAxis tickCount={8} domain={['0', '31']} stroke='black' />
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
