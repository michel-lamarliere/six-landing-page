import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../_shared/store/store';
import { UserActionTypes } from '../../_shared/store/user';
import { ErrorPopupActionTypes } from '../../_shared/store/error';

import { useRequest } from '../../_shared/hooks/http-hook';

import userIcon from '../../_shared/assets/icons/user-icon.svg';

import classes from './Sidebar.module.scss';
import RefreshSpinner from '../../_shared/assets/svgs/refresh-spinner';

const Sidebar: React.FC = () => {
	const { sendRequest } = useRequest();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [spinButton, setSpinButton] = useState(false);
	const [spinnerClasses, setSpinnerClasses] = useState('');

	const refreshDataHandler = async () => {
		setSpinButton(true);
		setSpinnerClasses(classes['user__refresh__spinner--active']);

		const responseData = await sendRequest(
			`http://localhost:8080/api/user/${userState.id}`,
			'GET'
		);

		if (!responseData) {
			return;
		}

		if (responseData.error) {
			dispatch({
				type: ErrorPopupActionTypes.SET_ERROR,
				message: responseData.error,
			});
			return;
		}

		dispatch({
			type: UserActionTypes.REFRESH_DATA,
			name: responseData.user.name,
			email: responseData.user.email,
			confirmedEmail: responseData.user.confirmation.confirmed,
		});

		const spinner = setTimeout(() => {
			setSpinnerClasses(classes['user__refresh__spinner--done']);
		}, 1000);

		const test = setTimeout(() => {
			setSpinnerClasses('');
			setSpinButton(false);
		}, 1500);

		return () => {
			clearTimeout(test);
			clearTimeout(spinner);
		};
	};

	const logLinks = [
		{
			text: 'Jour',
			url: '/journal/quotidien',
			key: 'log-daily-key',
		},
		{
			text: 'Semaine',
			url: '/journal/hebdomadaire',
			key: 'log-weekly-key',
		},
		{
			text: 'Mois',
			url: '/journal/mensuel',
			key: 'log-monthly-key',
		},
	];

	return ReactDOM.createPortal(
		<>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<Link to='/profil' className={classes['user__name-img']}>
						<img src={userIcon} alt='Icône Utilisateur' />
						<div>{userState.name}</div>
					</Link>
					<button
						onClick={refreshDataHandler}
						className={`${classes.user__refresh} ${
							spinButton && classes['user__refresh--active']
						}`}
						disabled={spinButton}
					>
						<RefreshSpinner className={spinButton ? spinnerClasses : ''} />
					</button>
				</div>
				<div className={classes.links}>
					{logLinks.map((link) => (
						<React.Fragment key={link.key}>
							{link.url && (
								<NavLink
									className={({ isActive }) =>
										isActive
											? classes['links__link--active']
											: classes['links__link']
									}
									to={link.url}
								>
									{link.text}
								</NavLink>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
			<footer className={classes.footer}>
				<div className={classes['footer__help-contact']}>
					<Link to='/'>Aide</Link>
					<Link to='/'>Nous Contacter</Link>
				</div>
				<Link to='/' className={classes['footer__legal-notice']}>
					Mentions Légales
				</Link>
			</footer>
		</>,
		document.getElementById('sidebar')!
	);
};

export default Sidebar;
