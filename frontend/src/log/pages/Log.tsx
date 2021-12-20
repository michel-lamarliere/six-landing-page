import React from 'react';
import classes from './Log.module.scss';

import WeekView from '../components/WeekView/WeekView';
import { useSelector } from 'react-redux';

import { RootState } from '../../shared/store/store';

const Log: React.FC = () => {
	const userState = useSelector((state: RootState) => state);

	return (
		<>
			{userState.id && (
				<div className={classes.wrapper}>
					<>
						<h1>Journal | Vue Semaine</h1>
						<WeekView />
					</>
				</div>
			)}
		</>
	);
};

export default Log;
