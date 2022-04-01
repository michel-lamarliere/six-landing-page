import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRequest } from '../../_shared/hooks/http-hook';
import { RootState } from '../../_shared/store/store';
import ForgotPassword from './ForgotPassword';
import classes from './FormContainer.module.scss';

interface Props {
	formHandler: (event: React.FormEvent) => void;
	header_title: string;
	footer_text: string;
	footer_text_link: string;
	switchFormHandler: () => void;
}

const FormContainer: React.FC<Props> = (props) => {
	const navigate = useNavigate();

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);
	const uiElementsState = useSelector((state: RootState) => state.uiElements);

	const [responseMessage, setResponseMessage] = useState('');

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
					{'<'}
				</button>
				<h1 className={classes.header__title}>{props.header_title}</h1>
			</div>
			{!userData && (
				<form onSubmit={props.formHandler} className={classes.form}>
					{uiElementsState.showForgotPasswordForm && <ForgotPassword />}
					{props.children}
					<div className={classes['response-message']}>{responseMessage}</div>
				</form>
			)}
			<h3>michel@test.com</h3>
			<h3>Tester1@</h3>
			<div className={classes.footer}>
				{!userData && (
					<>
						<div className={classes.footer__text}>{props.footer_text}</div>
						<button
							onClick={props.switchFormHandler}
							className={classes.footer__button}
						>
							{props.footer_text_link}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default FormContainer;
