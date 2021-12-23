import React from 'react';
import classes from './WeeklyViewButtons.module.scss';

interface Props {
	weekNumber: number;
	previousWeekHandler: () => void;
	nextWeekHandler: () => void;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<button onClick={props.previousWeekHandler}>Semaine précédente</button>
			<div>Semaine: {props.weekNumber}</div>
			<button onClick={props.nextWeekHandler}>Semaine suivante</button>
		</div>
	);
};

export default WeekViewButtons;
