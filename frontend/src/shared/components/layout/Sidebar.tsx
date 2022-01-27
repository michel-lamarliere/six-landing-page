import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { EmailConfirmationActionTypes } from '../../store/email-confirmation';

import SidebarTitle from './SidebarTitle';

import classes from './Sidebar.module.scss';
import { UserActionTypes } from '../../store/user';

const Sidebar: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user);

	const nameLinks = [
		{
			text: 'Éditer profil',
			url: '/profile',
			key: 'profile-key',
		},
		{
			text: 'Déconnexion',
			onClick: () => {
				dispatch({ type: UserActionTypes.LOG_OUT });
				dispatch({
					type: EmailConfirmationActionTypes.HIDE,
				});
				navigate('/');
				localStorage.removeItem('userData');
				sessionStorage.removeItem('confirmedEmail');
			},
			key: 'logout-key',
		},
	];

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
		<div className={classes.wrapper}>
			<SidebarTitle title={userState.name!} links={nameLinks} />
			<SidebarTitle title='Historique' links={logLinks} />
		</div>,
		document.getElementById('sidebar')!
	);
};

export default Sidebar;
