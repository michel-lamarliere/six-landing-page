import { getYear } from 'date-fns';
import React from 'react';
import classes from './WeeklyViewButtons.module.scss';

interface Props {
	weekNumber: number;
	month: Date;
	previousWeekHandler: () => void;
	nextWeekHandler: () => void;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<button onClick={props.previousWeekHandler}>Semaine précédente</button>
			<div>
				Semaine: {props.weekNumber} | {getYear(props.month)}
			</div>
			<button onClick={props.nextWeekHandler}>Semaine suivante</button>
		</div>
	);
};

export default WeekViewButtons;
