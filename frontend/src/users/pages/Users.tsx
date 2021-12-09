import React, { useEffect } from 'react';
import UserItem from '../components/UserItem';
import classes from './Users.module.scss';

interface Props {
	usersList: {
		name: string;
		email: string;
	}[];
	fetchFn: () => void;
}

const Users: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<button onClick={props.fetchFn}>Fetch</button>
			<ul className={classes.userList}>
				{props.usersList.map((user) => (
					<UserItem name={user.name} email={user.email} />
				))}
			</ul>
		</div>
	);
};

export default Users;
