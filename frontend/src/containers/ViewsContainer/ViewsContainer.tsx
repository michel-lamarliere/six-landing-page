import React from 'react';
import classes from './ViewsContainer.module.scss';

const ViewsContainer: React.FC = (props) => {
	return <div className={classes.wrapper}>{props.children}</div>;
};

export default ViewsContainer;
