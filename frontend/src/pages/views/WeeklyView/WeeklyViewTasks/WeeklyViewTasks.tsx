import React from 'react';

import { addDays, format, isAfter, isBefore, isSameDay } from 'date-fns';

import LogDataButton from '../../LogDataButtons/LogDataButtons';

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
	datesArray: Date[];
	dataArray: {
		food: any[];
		sleep: any[];
		sport: any[];
		relaxation: any[];
		social: any[];
		work: any[];
	};
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	firstOfWeek: Date;
}

const WeekViewTasks: React.FC<Props> = (props) => {
	const sixIcons = [
		foodIcon,
		sleepIcon,
		sportsIcon,
		relaxationIcon,
		workIcon,
		socialIcon,
	];

	return (
		<div className={classes.wrapper}>
			<div className={classes.days}>
				<li></li>
				<li className={classes.days__day}>
					LUN <br />
					{addDays(props.firstOfWeek, 0).getDate()}
				</li>
				<li className={classes.days__day}>
					MAR <br />
					{addDays(props.firstOfWeek, 1).getDate()}
				</li>
				<li className={classes.days__day}>
					MER <br />
					{addDays(props.firstOfWeek, 2).getDate()}
				</li>
				<li className={classes.days__day}>
					JEU
					<br /> {addDays(props.firstOfWeek, 3).getDate()}
				</li>
				<li className={classes.days__day}>
					VEN <br />
					{addDays(props.firstOfWeek, 4).getDate()}
				</li>
				<li className={classes.days__day}>
					SAM <br />
					{addDays(props.firstOfWeek, 5).getDate()}
				</li>
				<li className={classes.days__day}>
					DIM <br />
					{addDays(props.firstOfWeek, 6).getDate()}
				</li>
			</div>
			{Object.entries(props.dataArray).map((task: any[], index) => (
				<div className={classes.task} key={`${task[0]}_div`}>
					<img src={sixIcons[index]} alt='icon' className={classes.task__img} />
					{task[1].map((data: any, dataIndex: number) => (
						<LogDataButton
							id={`${format(
								new Date(props.datesArray[dataIndex]),
								'yyyy-MM-dd'
							)}_${task[0]}`}
							onClick={props.onClick}
							value={data}
							key={`${format(
								new Date(props.datesArray[dataIndex]),
								'yyyy-MM-dd'
							)}_${task[0]}`}
							disabled={
								isAfter(
									new Date(props.datesArray[dataIndex]),
									new Date()
								) &&
								!isSameDay(
									new Date(props.datesArray[dataIndex]),
									new Date()
								)
							}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default WeekViewTasks;
