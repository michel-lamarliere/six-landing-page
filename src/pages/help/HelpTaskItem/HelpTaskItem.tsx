import React from 'react';

import classes from './HelpTaskItem.module.scss';

interface Props {
	task: string;
	icon: string;
	iconAlt: string;
}

const HelpTaskItem: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<div className={classes.title}>
				<img
					src={props.icon}
					alt={props.iconAlt}
					className={classes.title__icon}
				/>
				<h1 className={classes.title__text}>{props.task}</h1>
			</div>
			<p className={classes.description}>{props.children}</p>
		</div>
	);
};

export default HelpTaskItem;
