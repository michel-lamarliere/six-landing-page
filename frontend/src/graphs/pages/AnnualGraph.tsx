import React, { useEffect, useState } from 'react';
import { isAfter, addYears } from 'date-fns';

import LogHeader from '../../log/components/LogHeader';

import classes from './AnnualGraph.module.scss';

const AnnualGraph: React.FC = () => {
	const [selectedYear, setSelectedYear] = useState<any>(new Date());

	const previousYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, -1));
	};

	const nextYearHandler = () => {
		setSelectedYear((prev: any) => addYears(prev, 1));
	};

	const test = [
		{
			1: {
				0: 1,
				2: 2,
			},
			2: {
				0: 1,
				2: 2,
			},
		},
	];

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
		</div>
	);
};

export default AnnualGraph;
