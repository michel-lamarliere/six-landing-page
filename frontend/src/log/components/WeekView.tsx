import React, { useEffect } from 'react';
import classes from './WeekView.module.scss';

import WeekViewButtons from './WeekViewButtons';

const WeekView: React.FC<{
	weekNumber: number;
	monday?: number;
	tuesday?: number;
	wednesday?: number;
	thursday?: number;
	friday?: number;
	saturday?: number;
	sunday?: number;
}> = (props) => {
	const addColor = (event: React.MouseEvent<HTMLTableElement>) => {
		const target = event.target as HTMLElement;
		if (target.classList.contains(classes.two)) {
			target.classList.remove(classes.two);
		} else if (target.classList.contains(classes.one)) {
			console.log('2');
			target.classList.remove(classes.one);
			target.classList.add(classes.two);
		} else if (
			!target.classList.contains(classes.one) ||
			!target.classList.contains(classes.two)
		) {
			console.log('1');
			target.classList.add(classes.one);
		}
	};

	useEffect(() => {}, []);

	return (
		<>
			<h2>This Week: {props.weekNumber}</h2>
			<div>
				<table>
					<tr>
						<th></th>
						<th>Lundi {props.monday}</th>
						<th>Mardi {props.tuesday}</th>
						<th>Mercredi {props.wednesday}</th>
						<th>Jeudi {props.thursday}</th>
						<th>Vendredi {props.friday}</th>
						<th>Samedi {props.saturday}</th>
						<th>Dimanche {props.sunday}</th>
					</tr>

					<WeekViewButtons header='Sport' onClick={addColor} />
					<WeekViewButtons header='Sommeil' onClick={addColor} />
					<WeekViewButtons header='Alimentation' onClick={addColor} />
					<WeekViewButtons header='Détente' onClick={addColor} />
					<WeekViewButtons header='Travail' onClick={addColor} />
					<WeekViewButtons header='Social' onClick={addColor} />
				</table>
			</div>
		</>
	);
};

export default WeekView;
