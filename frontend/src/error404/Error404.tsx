import React from 'react';
import { Link } from 'react-router-dom';

import { useUserClass } from '../_shared/classes/user-class-hook';

import classes from './Error404.module.scss';

const Error404: React.FC = () => {
	const { User } = useUserClass();

	return (
		<div>
			<h1>Erreur 404: Page Introuvable.</h1>
			{User.isLoggedIn() && (
				<Link to='/journal/quotidien'>Voir mon journal quotidien</Link>
			)}
			{!User.isLoggedIn() && <Link to='/'>Se connecter / S'inscrire</Link>}
		</div>
	);
};

export default Error404;
