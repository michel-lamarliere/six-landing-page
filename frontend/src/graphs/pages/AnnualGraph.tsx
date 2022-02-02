import React, { useEffect, useState } from 'react';
import { isAfter, addYears, getYear } from 'date-fns';

import { RootState } from '../../shared/store/store';
import { useSelector } from 'react-redux';
import { useRequest } from '../../shared/hooks/http-hook';

import LogHeader from '../../log/components/LogHeader';

import classes from './AnnualGraph.module.scss';
import AnnualGraphMonth from '../components/AnnualGraphMonth';

const AnnualGraph: React.FC = () => {
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [selectedYear, setSelectedYear] = useState<any>(new Date());
	const [task, setTask] = useState('food');
	const [responseArray, setResponseArray] = useState<any>([]);
	const [isLoading, setIsLoading] = useState(true);

	const previousYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, -1));
	};

	const nextYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, 1));
	};

	const getGraph = async () => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/graphs/annual/${userState.id}/${getYear(
				selectedYear
			)}/${task}`,
			'GET'
		);

		setResponseArray(responseData.array);
		console.log(responseData.array);
		setIsLoading(false);
	};

	useEffect(() => {
		getGraph();
	}, [selectedYear]);

	return (
		<div>
			<LogHeader
				button_previous_text='Année Précédente'
				button_previous_handler={previousYearHandler}
				button_next_text='Année Suivante'
				button_next_handler={nextYearHandler}
				button_next_disabled={isAfter(addYears(selectedYear, 1), new Date())}
				text={selectedYear.getFullYear()}
				selector_task={
					<select>
						<option>Alimentation</option>
						<option>Sommeil</option>
						<option>Sport</option>
						<option>Relaxation</option>
						<option>Travail</option>
						<option>Vie Sociale</option>
					</select>
				}
			/>
			<div className={classes.month}>
				{!isLoading &&
					responseArray &&
					responseArray.map((object: any) =>
						Object.values(object).map((item: any) => (
							<AnnualGraphMonth data={item} />
						))
					)}
			</div>
		</div>
	);
};

export default AnnualGraph;
