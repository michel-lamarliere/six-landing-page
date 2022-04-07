import React from 'react';
import { Link } from 'react-router-dom';

import classes from './UserProfileEditButton.module.scss';

interface Props {
	icon: string;
	text: string;
	to: string;
}

const UserProfileEditButton: React.FC<Props> = (props) => {
	return (
		<Link to={props.to} className={classes['edit-button']}>
			<img src={props.icon} alt='Icône' className={classes['edit-button__img']} />
			{props.text}
		</Link>
	);
};

export default UserProfileEditButton;
