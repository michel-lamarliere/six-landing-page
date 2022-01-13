import React from 'react';
import classes from './WeeklyViewTasks.module.scss';

import { isAfter } from 'date-fns';

import { DataButton } from '../../../shared/components/UIElements/Buttons';

interface Props {
	className?: (event: React.MouseEvent<HTMLButtonElement>) => string;
	isLoading: boolean;
	array: {
		date: string;
		six: any;
	}[];
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			{props.array.map((item: { date: string; six: number }, index: number) => (
				<React.Fragment key={item.date}>
					{Object.entries(item.six).map((item2) => (
						<DataButton
							id={`${item.date}_${item2[0]}`}
							onClick={props.onClick}
							value={item2[1]}
							key={`${item.date}_${item2[0]}`}
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
				</React.Fragment>
			))}
		</div>
	);
};

export default WeekViewButtons;
