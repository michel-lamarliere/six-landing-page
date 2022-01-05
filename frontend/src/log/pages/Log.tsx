import React from 'react';
import classes from './Log.module.scss';

import DailyView from '../components/DailyView/DailyView';
import WeeklyView from '../components/WeeklyView/WeeklyView';
import MonthlyView from '../components/MonthlyView/MonthlyView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);
	const viewState = useSelector((state: RootState) => state.view.view);

	return (
		<>
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
