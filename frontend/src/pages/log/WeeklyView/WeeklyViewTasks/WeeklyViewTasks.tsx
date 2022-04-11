import React from 'react';

import { format, isAfter, isBefore, isSameDay } from 'date-fns';

import { LogDataButton } from '../../LogDataButtons/LogDataButtons';

import foodIcon from '../../../../assets/icons/six/food.svg';
import sleepIcon from '../../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../../assets/icons/six/sports.svg';
import relaxationIcon from '../../../../assets/icons/six/relaxation.svg';
import workIcon from '../../../../assets/icons/six/work.svg';
import socialIcon from '../../../../assets/icons/six/social.svg';

import classes from './WeeklyViewTasks.module.scss';

interface Props {
	className?: (event: React.MouseEvent<HTMLButtonElement>) => string;
	isLoading: boolean;
	array: {
		date: Date;
		six: {};
	}[];
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const WeekViewTasks: React.FC<Props> = (props) => {
	const sixIcons = [
		foodIcon,
		sleepIcon,
		sportsIcon,
		workIcon,
		relaxationIcon,
		socialIcon,
	];
	return (
		<div className={classes.wrapper}>
			{props.array.map((item: { date: Date; six: {} }, index) => (
				<>
					{/* <img src={sixIcons[index]} alt='six' /> */}
					<React.Fragment
						key={`${format(new Date(item.date), 'yyyy-MM-dd')}_div`}
					>
						{Object.entries(item.six).map((item2: any[]) => (
							<LogDataButton
								id={`${format(new Date(item.date), 'yyyy-MM-dd')}_${
									item2[0]
								}`}
								onClick={props.onClick}
								value={item2[1]}
								key={`${format(new Date(item.date), 'yyyy-MM-dd')}_${
									item2[0]
								}`}
								disabled={
									isAfter(new Date(item.date), new Date()) &&
									!isSameDay(new Date(item.date), new Date())
								}
							/>
						))}
					</React.Fragment>
				</>
			))}
		</div>
	);
};

export default WeekViewTasks;
