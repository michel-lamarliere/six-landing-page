import React, { useEffect, useState } from 'react';
import { isAfter, addYears, getYear } from 'date-fns';

import LogHeader from '../../log/components/LogHeader';

import classes from './AnnualGraph.module.scss';
import { RootState } from '../../shared/store/store';
import { useSelector } from 'react-redux';
import { useRequest } from '../../shared/hooks/http-hook';

const AnnualGraph: React.FC = () => {
	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [selectedYear, setSelectedYear] = useState<any>(new Date());
	const [task, setTask] = useState('food');

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

		console.log(responseData);
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
			<div>
				{/* {test.map((item: {}) =>
					Object.entries(item).map((item2) => <div>
						{item2[0]}
					</div>)
				)} */}
			</div>
		</div>
	);
};

export default AnnualGraph;
