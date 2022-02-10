import React, { useEffect, useState } from 'react';
import { isAfter, addYears, getYear, isBefore } from 'date-fns';
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

import LogHeader from '../../log/components/LogHeader';

import classes from './AnnualChart.module.scss';
import { useDates } from '../../shared/hooks/dates-hook';

const AnnualGraph: React.FC = () => {
	const { sendRequest } = useRequest();
	const { getMonthFn } = useDates();

	const userState = useSelector((state: RootState) => state.user);

	const [selectedYear, setSelectedYear] = useState<any>(new Date());
	const [task, setTask] = useState('food');
	const [responseArray, setResponseArray] = useState<any>([]);
	const [data, setData] = useState<any>([]);

	const previousYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, -1));
	};

	const nextYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, 1));
	};

	const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTask(event.target.value);
	};

	const getGraph = async () => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/charts/annual/${userState.id}/${getYear(
				selectedYear
			)}/${task}`,
			'GET'
		);

		setResponseArray(responseData.array);
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

	useEffect(() => {
		getGraph();
	}, [selectedYear, task]);

	return (
		<div className={classes.wrapper}>
			<LogHeader
				setDate={setSelectedYear}
				date={selectedYear}
				text={selectedYear.getFullYear()}
				selectHandler={selectHandler}
				selector_task={true}
				calendar='YEARLY_CHART'
			/>
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
