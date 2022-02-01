import React, { useState, useEffect } from 'react';
import {
	addDays,
	getISOWeek,
	startOfWeek,
	format,
	getYear,
	isAfter,
	isSameDay,
} from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store/store';

import classes from './WeeklyView.module.scss';

import { useRequest } from '../../shared/hooks/http-hook';
import WeekViewTasks from '../components/WeeklyViewTasks';
import { ErrorPopupActionTypes } from '../../shared/store/error';
import LogHeader from '../components/LogHeader';

const WeekView: React.FC = () => {
	const { sendRequest, sendData } = useRequest();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);
	const [weekData, setWeekData] = useState<{ date: Date; six: {} }[]>([]);
	const [mappingArray, setMappingArray] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [chosenDate, setchosenDate] = useState(addDays(new Date(), 0));
	const [month, setMonth] = useState('');
	const firstOfWeek = startOfWeek(chosenDate, { weekStartsOn: 1 });
	const formattedFirstOfWeek = format(firstOfWeek, 'yyyy-MM-dd');

	const previousWeekHandler = () => {
		setchosenDate(addDays(chosenDate, -7));
	};

	const nextWeekHandler = () => {
		if (!isAfter(addDays(chosenDate, 7), new Date())) {
			setchosenDate(addDays(chosenDate, 7));
		}
	};

	const getWeekData = async (userId: string, formattedFirstOfWeekStr: string) => {
		const responseData = await sendRequest(
			`http://localhost:8080/api/log/weekly/${userId}/${formattedFirstOfWeekStr}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		setIsLoading(false);
		setWeekData(responseData);
		getMappingArray(responseData, firstOfWeek);
	};

	const emptySixObject = (logDate: Date) => {
		let emptySix = {
			date: logDate,
			six: {
				food: 0,
				sleep: 0,
				sport: 0,
				relaxation: 0,
				work: 0,
				social: 0,
			},
		};

		return emptySix;
	};

	const getMappingArray = (weekData: { date: Date; six: {} }[], firstOfWeek: Date) => {
		let array = [];
		let i = 0;
		let y = 0;

		do {
			if (
				weekData[i] &&
				isSameDay(new Date(weekData[i].date), addDays(firstOfWeek, y))
			) {
				array.push(weekData[i]);
				i++;
				y++;
			} else {
				array.push(emptySixObject(addDays(firstOfWeek, y)));
				y++;
			}
		} while (array.length < 7);

		setMappingArray(array);
	};

	const addData = async (event: React.MouseEvent<HTMLButtonElement>) => {
		const date = (event.target as HTMLElement).id.split('_')[0];
		const task = (event.target as HTMLButtonElement).id.split('_')[1];
		const prevLevel = parseInt((event.target as HTMLButtonElement).value);

		const dateFormat = new Date(
			+date.slice(0, 4),
			+date.slice(5, 7) === 12 ? 11 : +date.slice(5, 7) - 1,
			+date.slice(8, 10)
		);

		if (!isAfter(dateFormat, new Date()) && userState.id && userState.email) {
			const responseData = await sendData(
				userState.id,
				userState.email,
				date,
				task,
				prevLevel
			);

			if (!responseData) {
				return;
			}

			if (responseData.error) {
				dispatch({
					type: ErrorPopupActionTypes.SET_ERROR,
					message: responseData.error,
				});
			}
		}

		if (typeof userState.id === 'string') {
			getWeekData(userState.id, formattedFirstOfWeek);
		}
	};

	useEffect(() => {
		if (typeof userState.id === 'string') {
			getWeekData(userState.id, formattedFirstOfWeek);
			getMappingArray(weekData, firstOfWeek);
		}
	}, [userState.id, chosenDate]);

	useEffect(() => {
		switch (chosenDate.getMonth()) {
			case 0:
				setMonth('Janvier');
				break;
			case 1:
				setMonth('Février');
				break;
			case 2:
				setMonth('Mars');
				break;
			case 3:
				setMonth('Avril');
				break;
			case 4:
				setMonth('Mai');
				break;
			case 5:
				setMonth('Juin');
				break;
			case 6:
				setMonth('Juillet');
				break;
			case 7:
				setMonth('Août');
				break;
			case 8:
				setMonth('Septembre');
				break;
			case 9:
				setMonth('Octobre');
				break;
			case 10:
				setMonth('Novembre');
				break;
			case 11:
				setMonth('Décembre');
				break;
			default:
				break;
		}
	}, [chosenDate]);

	return (
		<div className={classes.wrapper}>
			<LogHeader
				button_previous_text='Semaine précédente'
				button_previous_handler={previousWeekHandler}
				button_next_text='Semaine suivante'
				button_next_handler={nextWeekHandler}
				button_next_disabled={isAfter(addDays(chosenDate, 7), new Date())}
				text={`Semaine: ${getISOWeek(chosenDate)} | ${month} ${getYear(
					chosenDate
				)}`}
			/>
			<div>
				<div className={classes.days}>
					<li>Lundi {addDays(firstOfWeek, 0).getDate()}</li>
					<li>Mardi {addDays(firstOfWeek, 1).getDate()}</li>
					<li>Mercredi {addDays(firstOfWeek, 2).getDate()}</li>
					<li>Jeudi {addDays(firstOfWeek, 3).getDate()}</li>
					<li>Vendredi {addDays(firstOfWeek, 4).getDate()}</li>
					<li>Samedi {addDays(firstOfWeek, 5).getDate()}</li>
					<li>Dimanche {addDays(firstOfWeek, 6).getDate()}</li>
				</div>
				<div className={classes.six}>
					<div className={classes.six_titles}>
						<li>Food</li>
						<li>Sleep</li>
						<li>Sport</li>
						<li>Relaxation</li>
						<li>Work</li>
						<li>Social</li>
					</div>
					<WeekViewTasks
						isLoading={isLoading}
						array={mappingArray}
						onClick={addData}
					/>
				</div>
			</div>
		</div>
	);
};

export default WeekView;
