import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../_shared/store/_store';

import classes from './Error404.module.scss';

const Error404: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email &&
		userState.confirmedEmail;

	return (
		<div>
			<h1>Erreur 404: Page Introuvable.</h1>
			{!userData && <Link to='/'>Se connecter / S'inscrire</Link>}
		</div>
	);
};

export default Error404;
