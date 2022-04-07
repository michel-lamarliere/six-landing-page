import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../../_shared/store/_store';
import { MobileSidebarActionTypes } from '../../../_shared/store/mobile-sidebar';

import { useUserClass } from '../../../_shared/classes/user-class-hook';

import UserIcon from '../../../_shared/components/UserIcon/UserIcon';
import RefreshSpinnerSVG from '../../../_shared/components/_svgs/RefreshSpinnerSVG';

import sixIcon from '../../../_shared/assets/imgs/icons/app/logo.svg';

import classes from './Sidebar.module.scss';

const Sidebar: React.FC<{ className: string }> = (props) => {
	const dispatch = useDispatch();
	const { User } = useUserClass();

	const userState = useSelector((state: RootState) => state.user);

	const [userName, setUserName] = useState('');
	const [spinButton, setSpinButton] = useState(false);
	const [spinnerClasses, setSpinnerClasses] = useState('');

	const refreshDataHandler = async () => {
		setSpinButton(true);
		setSpinnerClasses(classes['user__refresh-spinner__img--active']);

		User.refreshData();

		const spinner = setTimeout(() => {
			setSpinnerClasses(classes['user__refresh-spinner__img--done']);
		}, 1500);

		const doneSpinning = setTimeout(() => {
			setSpinnerClasses('');
			setSpinButton(false);
		}, 2500);

		return () => {
			clearTimeout(spinner);
			clearTimeout(doneSpinning);
		};
	};

	const closeMobileSidebar = () => {
		dispatch({
			type: MobileSidebarActionTypes.HIDE_MOBILE_SIDEBAR,
		});
	};

	const logLinks = [
		{
			text: 'Jour',
			url: '/journal/quotidien',
			key: 'log-daily-key',
			onClick: closeMobileSidebar,
		},
		{
			text: 'Semaine',
			url: '/journal/hebdomadaire',
			key: 'log-weekly-key',
			onClick: closeMobileSidebar,
		},
		{
			text: 'Mois',
			url: '/journal/mensuel',
			key: 'log-monthly-key',
			onClick: closeMobileSidebar,
		},
	];

	useEffect(() => {
		if (userState.name) {
			setUserName(userState.name);
		}
	}, [userState.name]);

	return (
		<div className={props.className}>
			<div className={classes.wrapper}>
				<div className={classes.user}>
					<div onClick={closeMobileSidebar}>
						<Link to='/profil' className={classes['user__name-img']}>
							{/* <img
								src={`${userIcon}${User.getInfo().icon}`}
								alt='Icône Utilisateur'
								className={classes['user__name-img__img']}
							/> */}
							<UserIcon
								className={classes['user__name-img__img']}
								icon={User.getInfo().icon}
							/>
							<div className={classes['user__name-img__name']}>
								{userName}
							</div>
						</Link>
					</div>
					<button
						onClick={refreshDataHandler}
						className={`${classes['user__refresh-spinner']} ${
							spinButton && classes['user__refresh-spinner--active']
						}`}
						disabled={spinButton}
					>
						<RefreshSpinnerSVG className={spinButton ? spinnerClasses : ''} />
					</button>
				</div>
				<div className={classes.links}>
					{logLinks.map((link) => (
						<React.Fragment key={link.key}>
							{link.url && (
								<div onClick={link.onClick}>
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
								</div>
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
				<div className={classes['footer__legal-notice']}>
					<Link to='/' className={classes['footer__legal-notice__text']}>
						Mentions Légales
					</Link>
					<img src={sixIcon} alt='six' />
				</div>
			</footer>
		</div>
	);
};

export default Sidebar;
