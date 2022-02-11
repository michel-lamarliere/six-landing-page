import React, { useEffect, useState } from 'react';

import { addDays, addMonths, addYears, getYear, isBefore } from 'date-fns';

import classes from './AnnualChartCalendar.module.scss';

const AnnualChartCalendar: React.FC<{
	date: Date;
	setDate: any;
	text: string;
}> = (props) => {
	const previousHandler = () => {
		props.setDate(addYears(props.date, -1));
	};

	const nextHandler = () => {
		props.setDate(addYears(props.date, 1));
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<button
					onClick={previousHandler}
					disabled={isBefore(addMonths(props.date, -1), new Date(2020, 1, 1))}
				>
					{'<'}
				</button>
				<p>{props.text}</p>
				<button
					onClick={nextHandler}
					disabled={!isBefore(addMonths(props.date, 1), new Date())}
				>
					{'>'}
				</button>
			</div>
		</div>
	);
};

export default AnnualChartCalendar;
