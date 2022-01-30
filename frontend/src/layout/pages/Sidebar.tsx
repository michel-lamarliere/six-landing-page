import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../shared/store/store';

import SidebarTitle from '../components/SidebarTitle';

import classes from './Sidebar.module.scss';
import { UserActionTypes } from '../../shared/store/user';
import { useRequest } from '../../shared/hooks/http-hook';
import { ErrorPopupActionTypes } from '../../shared/store/error';
import { EmailConfirmationActionTypes } from '../../shared/store/email-confirmation';

const Sidebar: React.FC = () => {
	const { sendRequest } = useRequest();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userState = useSelector((state: RootState) => state.user);

	const refreshDataHandler = async () => {
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
	};

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
				dispatch({ type: EmailConfirmationActionTypes.HIDE });
				navigate('/');
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
			<button onClick={refreshDataHandler}>Refresh</button>
		</div>,
		document.getElementById('sidebar')!
	);
};

export default Sidebar;
