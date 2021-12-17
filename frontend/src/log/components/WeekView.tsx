import React, { useState, useEffect, useCallback } from 'react';
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
	const [weekData, setWeekData] = useState<{ date: string; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
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

	const getMappingArray = useCallback(
		(weekData: { date: string; six: {} }[], firstOfWeek: Date) => {
			let emptySix = {
				food: 0,
				sleep: 0,
				sport: 0,
				relaxation: 0,
				work: 0,
				social: 0,
			};
			let array = [];
			let y = 0;
			for (let i = 0; i < 7; i++) {
				if (
					weekData[i] &&
					weekData[i].date === format(addDays(firstOfWeek, i + y), 'yyyy-MM-dd')
				) {
					array.push(weekData[i].six);
					console.log(weekData[i].date);
					console.log('matched');
				} else {
					if (weekData[i]) console.log(weekData[i].date);
					y++;
					console.log(format(addDays(firstOfWeek, i), 'yyyy-MM-dd'));
					array.push(emptySix);
					console.log('not matched');
				}
			}
			console.log(array);
			setMappingArray(array);
			return array;
		},
		[]
	);

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
			console.log(responseJson);
			setIsLoading(false);
			setWeekData(responseJson);
		};

		getMappingArray(weekData, firstOfWeek);
		getWeekData();
	}, [userStateId, isLoading]);

	// FOOD
	// SLEEP
	// SPORT
	// RELAXATION
	// WORK
	// SOCIAL

	return (
		<div>
			<h2>Semaine: {weekNumber}</h2>
			<div>
				<th></th>
				<th>Lundi {addDays(firstOfWeek, 0).getDate()}</th>
				<th>Mardi {addDays(firstOfWeek, 1).getDate()}</th>
				<th>Mercredi {addDays(firstOfWeek, 2).getDate()}</th>
				<th>Jeudi {addDays(firstOfWeek, 3).getDate()}</th>
				<th>Vendredi {addDays(firstOfWeek, 4).getDate()}</th>
				<th>Samedi {addDays(firstOfWeek, 5).getDate()}</th>
				<th>Dimanche {addDays(firstOfWeek, 6).getDate()}</th>
			</div>
			{/* <div>{weekData && !isLoading && weekData.length > 0 && weekData.map(Object.entries(item)).map(key, value, array => <div>{key} {console.log(key)}</div>)}</div> */}
			<div>
				{mappingArray &&
					!isLoading &&
					mappingArray
						.map((item) => Object.entries(item))
						.map((item) => (
							// Object.entries((key: any, value: any) => (
							<div>
								{' '}
								{/* {key} {value} {console.log(key)} */}
								{item}
							</div>
						))}
			</div>
		</div>
	);
};

export default WeekView;
