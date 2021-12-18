import React, { useState, useEffect } from 'react';
import { addDays, getISOWeek, startOfWeek, format, compareAsc } from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/store/store';

import classes from './WeekView.module.scss';

const WeekView: React.FC = () => {
	const userState = useSelector((state: RootState) => state);
	const [weekData, setWeekData] = useState<{ date: string; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const currentDate = addDays(new Date(), 0);
	const weekNumber = getISOWeek(currentDate);
	const firstOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const getWeekData = async (userId: string, formattedFirstOfWeekStr: string) => {
		const response = await fetch(
			`http://localhost:8080/api/logs/${userId}/${formattedFirstOfWeekStr}/weekly`,
			{
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			}
		);
		setIsLoading(false);
		const responseJson = await response.json();
		console.log(responseJson);

		setWeekData(responseJson);
		getMappingArray(responseJson, firstOfWeek);
	};

	const getMappingArray = (
		weekData: { date: string; six: {} }[],
		firstOfWeek: Date
	) => {
		let emptySix = {
			food: 0,
			sleep: 0,
			sport: 0,
			relaxation: 0,
			work: 0,
			social: 0,
		};
		let array = [];
		let i = 0;
		let y = 0;
		do {
			if (
				weekData[i] &&
				weekData[i].date === format(addDays(firstOfWeek, y), 'yyyy-MM-dd')
			) {
				array.push(weekData[i].six);
				// console.log('matched');

				i++;
			} else {
				// }

				y++;
				// console.log(format(addDays(firstOfWeek, i), 'yyyy-MM-dd'));
				array.push(emptySix);
				// console.log('not matched');
			}
		} while (i < weekData.length);
		setMappingArray(array);
	};

	// const addColor = (event: React.MouseEvent<HTMLTableElement>) => {
	// 	const target = event.target as HTMLElement;
	// 	if (target.classList.contains(classes.two)) {
	// 		target.classList.remove(classes.two);
	// 	} else if (target.classList.contains(classes.one)) {
	// 		console.log('2');
	// 		target.classList.remove(classes.one);
	// 		target.classList.add(classes.two);
	// 	} else if (
	// 		!target.classList.contains(classes.one) ||
	// 		!target.classList.contains(classes.two)
	// 	) {
	// 		console.log('1');
	// 		target.classList.add(classes.one);
	// 	}
	// };

	useEffect(() => {
		if (typeof userState.id === 'string') {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMappingArray(weekData, firstOfWeek);
		}
	}, [userState.id]);

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
			<div style={{ display: 'flex', gap: '2rem' }}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
					<li>Food</li>
					<li>Sleep</li>
					<li>Sport</li>
					<li>Relaxation</li>
					<li>Work</li>
					<li>Social</li>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => <button>{item.food}</button>)}
					</div>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => <button>{item.sleep}</button>)}
					</div>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => <button>{item.sport}</button>)}
					</div>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => (
								<button>{item.relaxation}</button>
							))}
					</div>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => <button>{item.work}</button>)}
					</div>
					<div style={{ display: 'flex' }}>
						{!isLoading &&
							mappingArray.map((item) => <button>{item.social}</button>)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
