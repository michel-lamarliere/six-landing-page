import React from 'react';
import classes from './WeeklyViewTasks.module.scss';

interface Props {
	className?: (event: React.MouseEvent<HTMLButtonElement>) => string;
	isLoading: boolean;
	array: { date: string; six: any }[];
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
	taskName: any;
	zero?: string;
	one?: string;
	two?: string;
}

const WeekViewButtons: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			{!props.isLoading &&
				props.array.map((item) => (
					<button
						className={`${classes.button} ${
							item.six[`${props.taskName}`] === 0 ? classes.zero : ''
						}
							${item.six[`${props.taskName}`] === 1 ? classes.one : ''} 
							
							${item.six[`${props.taskName}`] === 2 ? classes.two : ''}
						`}
						id={`${item.date}_${props.taskName}`}
						onClick={props.onClick}
						value={item.six[`${props.taskName}`]}
					></button>
				))}
		</div>
	);
};

export default WeekViewButtons;
