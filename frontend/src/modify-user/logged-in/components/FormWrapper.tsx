import React from 'react';
import { Link } from 'react-router-dom';

import backButton from '../../../_shared/assets/imgs/icons/back-button.svg';

import classes from './FormWrapper.module.scss';

export enum FormWrapperTypes {
	MODIFY = 'MODIFY',
	DELETE = 'DELETE',
}

interface Props {
	type: FormWrapperTypes;
	button_onClick?: any;
	response?: string;
}

const Form: React.FC<Props> = (props) => {
	let rendered =
		props.type === FormWrapperTypes.MODIFY ? (
			<div className={classes.wrapper}>
				<Link to='/profil' className={classes['back-button']}>
					<img src={backButton} alt='Retour' />
				</Link>
				{props.children}
				<button
					className={classes['submit-button']}
					onClick={props.button_onClick}
				>
					Enregistrer
				</button>
				<div className={classes.response}>{props.response}</div>
			</div>
		) : (
			<div className={classes.wrapper}>
				<Link to='/profil' className={classes['back-button']}>
					<img src={backButton} alt='Retour' />
				</Link>
				{props.children}
				<div className={classes.response}>{props.response}</div>
			</div>
		);

	return <>{rendered}</>;
};

export default Form;
