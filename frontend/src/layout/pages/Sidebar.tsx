import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../_shared/store/store';
import { UserActionTypes } from '../../_shared/store/user';
import { ErrorPopupActionTypes } from '../../_shared/store/error';
import { EmailConfirmationActionTypes } from '../../_shared/store/email-confirmation';

import { useRequest } from '../../_shared/hooks/http-hook';

import userIcon from '../../_shared/assets/icons/user-icon.svg';
import refreshSpinner from '../../_shared/assets/icons/refresh-spinner.svg';

import classes from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
	const { sendRequest } = useRequest();
	const dispatch = useDispatch();

	const userState = useSelector((state: RootState) => state.user);

	const [spinButton, setSpinButton] = useState(false);

	const refreshDataHandler = async () => {
		setSpinButton(true);
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

		setTimeout(() => {
			setSpinButton(false);
		}, 1500);

		return clearTimeout();
	};

	const logLinks = [
		{
			text: 'Jour',
			url: '/log/daily',
			key: 'log-daily-key',
		},
		{
			text: 'Semaine',
			url: '/log/weekly',
			key: 'log-weekly-key',
		},
		{
			text: 'Mois',
			url: '/log/monthly',
			key: 'log-monthly-key',
		},
	];

	return ReactDOM.createPortal(
		<>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<Link to='/profile' className={classes['user__name-img']}>
						<img src={userIcon} alt='Icône Utilisateur' />
						<div>{userState.name}</div>
					</Link>
					<button
						onClick={refreshDataHandler}
						className={`${classes.user__button} ${
							spinButton && classes['user__button--clicked']
						}`}
						disabled={spinButton}
					>
						<img
							src={refreshSpinner}
							alt='Icône Rafraîchir'
							className={classes.test}
						/>
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
