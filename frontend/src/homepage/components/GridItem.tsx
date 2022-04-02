import React from 'react';

import classes from './GridItem.module.scss';

interface Props {
	title: string;
	img: string;
}

export const Slide2GridItem: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<img src={props.img} alt={props.title} className={classes['img-2']} />
			<div className={classes.title}>{props.title}</div>
		</div>
	);
};

export const Slide3GridItem: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<img src={props.img} alt={props.title} className={classes['img-3']} />
			<div className={classes.title}>{props.title}</div>
		</div>
	);
};
