import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classes from './Log.module.scss';

import DailyView from '../components/DailyView/DailyView';
import WeeklyView from '../components/WeeklyView/WeeklyView';
import MonthlyView from '../components/MonthlyView/MonthlyView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);
	const viewState = useSelector((state: RootState) => state.view.view);
	const dispatch = useDispatch();

	useEffect(() => {
		if (localStorage.getItem('log-view')) {
			const logView = localStorage.getItem('log-view');
			dispatch({ type: logView });
		}
	}, []);

	return (
		<>
			<div className={classes.view}>
				<button
					disabled={viewState === 'DAILY'}
					onClick={() => dispatch({ type: 'DAILY' })}
				>
					Jour
				</button>
				<button
					disabled={viewState === 'WEEKLY'}
					onClick={() => dispatch({ type: 'WEEKLY' })}
				>
					Semaine
				</button>
				<button
					disabled={viewState === 'MONTHLY'}
					onClick={() => dispatch({ type: 'MONTHLY' })}
				>
					Mois
				</button>
			</div>
			{userState.id && viewState === 'DAILY' && (
				<div className={classes.wrapper}>
					<h1>Journal | Vue Quotidienne</h1>
					<DailyView />
				</div>
			)}
			{userState.id && viewState === 'WEEKLY' && (
				<div className={classes.wrapper}>
					<h1>Journal | Vue Semaine</h1>
					<WeeklyView />
				</div>
			)}
			{userState.id && viewState === 'MONTHLY' && (
				<div className={classes.wrapper}>
					<h1>Journal | Vue Mois</h1>
					<MonthlyView />
				</div>
			)}
		</>
	);
};

export default Log;
