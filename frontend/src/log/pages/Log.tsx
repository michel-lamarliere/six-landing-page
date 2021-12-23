import React from 'react';
import classes from './Log.module.scss';

import DailyView from '../components/DailyView/DailyView';
import WeeklyView from '../components/WeeklyView/WeeklyView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state);

	return (
		<>
			{userState.id && (
				<div className={classes.wrapper}>
					<h1>Journal | Vue Quotidienne</h1>
					<DailyView />
				</div>
			)}
			{userState.id && (
				<div className={classes.wrapper}>
					<h1>Journal | Vue Semaine</h1>
					<WeeklyView />
				</div>
			)}
		</>
	);
};

export default Log;
