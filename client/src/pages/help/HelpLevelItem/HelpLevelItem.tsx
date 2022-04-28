import React from 'react';

import classes from './HelpLevelItem.module.scss';

interface Props {
	icon: string;
	iconAlt: string;
	description: string;
}

const HelpLevelItem: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<img src={props.icon} alt={props.iconAlt} className={classes.icon} />
			<p className={classes.description}>{props.description}</p>
		</div>
	);
};

export default HelpLevelItem;
