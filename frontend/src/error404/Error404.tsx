import React from 'react';

import { useUserClass } from '../_shared/classes/user-class-hook';

import RoundedButton from '../_shared/components/UIElements/RoundedButton';

import errorIcon from '../_shared/assets/imgs/icons/error.svg';

import classes from './Error404.module.scss';

const Error404: React.FC = () => {
	const { User } = useUserClass();

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<h1 className={classes.header__title}>Erreur 404</h1>
				<h2 className={classes['header__sub-title']}>Cette page n'existe pas.</h2>
			</div>
			<img src={errorIcon} alt='Erreur' />
			{User.isLoggedIn() && (
				<RoundedButton
					text={'Revenir sur mon journal'}
					link={'/journal/quotidien'}
					className={classes['submit-button']}
				/>
			)}
			{!User.isLoggedIn() && (
				<RoundedButton
					text={"Retour à l'accueil"}
					link={'/'}
					className={classes['submit-button']}
				/>
			)}
		</div>
	);
};

export default Error404;
