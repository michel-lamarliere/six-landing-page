import React from 'react';

import classes from './DaysOfWeek.module.scss';

const DaysOfWeek: React.FC = () => {
	const daysOfWeek = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

	return (
		<div className={classes.wrapper}>
			{daysOfWeek.map((day) => (
				<div className={classes.day}>{day}</div>
			))}
		</div>
	);
};

export default DaysOfWeek;
