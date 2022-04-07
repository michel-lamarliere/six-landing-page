import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../_shared/store/_store';

import ForgotPassword from './ForgotPasswordPopUp';

import BackButton from '../../_shared/assets/imgs/icons/back-button.svg';

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

	const userState = useSelector((state: RootState) => state.user);
	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	const backButton = (event: React.FormEvent) => {
		event.preventDefault();
		navigate(-1);
	};

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email &&
		userState.confirmedEmail;

	return (
		<div className={classes.wrapper}>
			<div className={classes.header}>
				<button onClick={backButton} className={classes['header__back-button']}>
					<img
						src={BackButton}
						alt='Retour'
						className={classes['header__back-button__img']}
					/>
				</button>
				<h1 className={classes.header__title}>{props.headerTitle}</h1>
			</div>
			{!userData && (
				<>
					<form onSubmit={props.formHandler} className={classes.form}>
						{uiElementsState.showForgotPasswordForm && <ForgotPassword />}
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
				{!userData && (
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
