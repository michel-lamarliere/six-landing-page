import React from 'react';
import classes from './WeeklyViewTasks.module.scss';

import { isAfter } from 'date-fns';

import { DataButton } from '../../../shared/components/UIElements/Buttons';

interface Props {
	className?: (event: React.MouseEvent<HTMLButtonElement>) => string;
	isLoading: boolean;
	array: {
		date: string;
		six: {};
	}[];
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	taskName: string;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			{!props.isLoading &&
				props.array.map((item: { date: string; six: any }) => (
					<DataButton
						id={`${item.date}_${props.taskName}`}
						onClick={props.onClick}
						value={item.six[props.taskName]}
						disabled={
							!isAfter(
								new Date(
									+item.date.slice(0, 4),
									+item.date.slice(5, 7) === 12
										? 11
										: +item.date.slice(5, 7) - 1,
									+item.date.slice(8, 10)
								),
								new Date()
							)
						}
					/>
				))}
		</div>
	);
};

export default WeekViewButtons;
