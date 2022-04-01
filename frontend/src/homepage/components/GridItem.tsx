import React from 'react';

import classes from './GridItem.module.scss';

interface Props {
	title: string;
	img: string;
}

const GridItem: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<img src={props.img} alt={props.title} className={classes.img} />
			<div className={classes.title}>{props.title}</div>
		</div>
	);
};

export default GridItem;
