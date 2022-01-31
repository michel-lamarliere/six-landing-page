import React from 'react';
import classes from './WeeklyViewTasks.module.scss';

import { format, isAfter } from 'date-fns';

import { DataButton } from './Buttons';

interface Props {
	className?: (event: React.MouseEvent<HTMLButtonElement>) => string;
	isLoading: boolean;
	array: {
		date: Date;
		six: any;
	}[];
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			{props.array.map((item: { date: Date; six: number }) => (
				<React.Fragment key={format(new Date(item.date), 'yyyy-MM-dd')}>
					{Object.entries(item.six).map((item2) => (
						<DataButton
							id={`${format(new Date(item.date), 'yyyy-MM-dd')}_${
								item2[0]
							}`}
							onClick={props.onClick}
							value={item2[1]}
							key={`${format(new Date(item.date), 'yyyy-MM-dd')}_${
								item2[0]
							}`}
							disabled={!isAfter(item.date, new Date())}
						/>
					))}
				</React.Fragment>
			))}
		</div>
	);
};

export default WeekViewButtons;
