import React from 'react';
import classes from './WeekViewButtons.module.scss';

const WeekViewButtons: React.FC<{ onClick: any; header: string }> = (props) => {
	return (
		<tr className={classes.row}>
			<th>{props.header}</th>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
			<td onClick={props.onClick}></td>
		</tr>
	);
};

export default WeekViewButtons;
