import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store/store';
import classes from './Error404.module.scss';

const Error404: React.FC = () => {
	const userState = useSelector((state: RootState) => state.user);

	return (
		<div>
			<h1>Erreur 404: Page Introuvable.</h1>
			{!userState.token && <Link to='/'>Se connecter / S'inscrire</Link>}
		</div>
	);
};

export default Error404;
