import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserClass } from '../../../classes/user-class-hook';

import backButtonIcon from '../../../assets/icons/log_in-sign_up-back-button.svg';

import classes from './FormContainer.module.scss';

interface Props {
	formHandler: (event: React.FormEvent) => void;
	headerTitle: string;
	footerText: string;
	footerTextLink: string;
	switchFormHandler: () => void;
	responseMessage: string;
}

const FormContainer: React.FC<Props> = (props) => {
	const navigate = useNavigate();

	const { User } = useUserClass();

	const backButton = (event: React.FormEvent) => {
		event.preventDefault();
		navigate(-1);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<button onClick={backButton} className={classes['header__back-button']}>
					<img
						src={backButtonIcon}
						alt='Retour'
						className={classes['header__back-button__img']}
					/>
				</button>
				<h1 className={classes.header__title}>{props.headerTitle}</h1>
			</div>
			{!User.isLoggedIn() && (
				<>
					<form onSubmit={props.formHandler} className={classes.form}>
						{props.children}
					</form>
					<div className={classes['response-message']}>
						{props.responseMessage}
					</div>
				</>
			)}
			<h3>michel@test.com</h3>
			<h3>Tester1@</h3>
			<div className={classes.footer}>
				{!User.isLoggedIn() && (
					<>
						<div className={classes.footer__text}>{props.footerText}</div>
						&nbsp;
						<button
							onClick={props.switchFormHandler}
							className={classes.footer__button}
						>
							{props.footerTextLink}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default FormContainer;
