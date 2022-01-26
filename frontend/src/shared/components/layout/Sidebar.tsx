import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';

import SidebarTitle from './SidebarTitle';

import classes from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user);

	const nameLinks = [
		{
			text: 'Éditer profil',
			url: '/profile',
		},
		{
			text: 'Déconnexion',
			onClick: () => {
				dispatch({ type: 'LOG_OUT' });
				navigate('/');
				localStorage.removeItem('userData');
			},
		},
	];

	const logLinks = [
		{
			text: 'Jour',
			url: '/log/daily',
		},
		{
			text: 'Semaine',
			url: '/log/weekly',
		},
		{
			text: 'Mois',
			url: '/log/monthly',
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
