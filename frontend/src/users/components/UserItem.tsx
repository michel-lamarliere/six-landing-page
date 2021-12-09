import React from 'react';
import classes from './UserItem.module.scss';

const UserItem: React.FC<{ name: string; email: string }> = (props) => {
	return (
		<li className={classes.wrapper}>
			<div>{props.name}</div>
			<div>{props.email}</div>
		</li>
	);
};

export default UserItem;
