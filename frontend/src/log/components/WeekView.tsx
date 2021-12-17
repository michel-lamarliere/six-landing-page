import React, { useState, useEffect } from 'react';
import { addDays, getISOWeek, startOfWeek, format } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/store/store';

import classes from './WeekView.module.scss';
import WeekViewButtons from './WeekViewButtons';

const WeekView: React.FC<{
	monday?: number;
	tuesday?: number;
	wednesday?: number;
	thursday?: number;
	friday?: number;
	saturday?: number;
	sunday?: number;
}> = (props) => {
	const userStateId = useSelector((state: RootState) => state.id);
	// const [weekData, setWeekData] = useState<{ six: {} }[]>();
	const [weekData, setWeekData] = useState<any[]>();
	const [isLoading, setIsLoading] = useState(true);

	const currentDate = addDays(new Date(), 0);
	const weekNumber = getISOWeek(currentDate);
	const firstOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

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

	useEffect(() => {
		const getWeekData = async () => {
			const response = await fetch(
				`http://localhost:8080/api/logs/${userStateId}/${formattedFirstOfWeek}/weekly`,
				{
					method: 'GET',
					headers: { 'Content-Type': 'application/json' },
				}
			);
			const responseJson = await response.json();
			setIsLoading(false);
			setWeekData(responseJson);
		};
		getWeekData();
	}, [userStateId]);

	// FOOD
	// SLEEP
	// SPORT
	// RELAXATION
	// WORK
	// SOCIAL

	return (
		<div>
			<h2>Semaine: {weekNumber}</h2>
			{/* {weekData && weekData.length > 0 && console.log(weekData[0].six)} */}
			<div></div>
			<div>
				<th></th>
				<th>Lundi {props.monday}</th>
				<th>Mardi {props.tuesday}</th>
				<th>Mercredi {props.wednesday}</th>
				<th>Jeudi {props.thursday}</th>
				<th>Vendredi {props.friday}</th>
				<th>Samedi {props.saturday}</th>
				<th>Dimanche {props.sunday}</th>
				<div style={{ display: 'flex' }}>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[0].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[1].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[2].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[3].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[4].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
					<div className={classes.test}>
						{weekData &&
							weekData.length > 0 &&
							Object.entries(weekData[5].six).map((array: any[]) => (
								<button key={Math.random()}>
									{array}
									{console.log({ array })}
								</button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
