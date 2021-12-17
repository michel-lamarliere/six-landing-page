import React from 'react';
import classes from './Log.module.scss';

import WeekView from '../components/WeekView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state);

	return (
		<div className={classes.wrapper}>
			{userState.id && (
				<>
					<h1>Journal | Vue Semaine</h1>
					<WeekView />
				</>
			)}
		</div>
	);
};

export default Log;
