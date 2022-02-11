import React, { useState } from 'react';
import AnnualChartCalendar from '../../charts/components/AnnualChartCalendar';

import classes from './LogHeader.module.scss';

const LogHeader: React.FC<{
	setDate: any;
	date: Date;
	text: string;
	selector_task?: boolean;
	selectHandler?: any;
	calendar: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL_CHART';
}> = (props) => {
	const [showCalendar, setShowCalendar] = useState(false);

	const calendarButtonHandler = () => {
		setShowCalendar((prev) => !prev);
	};

	return (
		<>
			<div className={classes.buttons}>
				{props.calendar === 'ANNUAL_CHART' && (
					<AnnualChartCalendar
						setDate={props.setDate}
						date={props.date}
						text={props.text}
					/>
				)}
			</div>
		</>
	);
};

export default LogHeader;
