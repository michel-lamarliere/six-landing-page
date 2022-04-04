import React from 'react';
import { Link } from 'react-router-dom';

import backButton from '../../../_shared/assets/imgs/icons/back-button.svg';

import classes from './FormWrapper.module.scss';

interface Props {
	button_onClick: any;
	response: string;
}

const Form: React.FC<Props> = (props) => {
	return (
		<div className={classes.wrapper}>
			<Link to='/profil' className={classes['back-button']}>
				<img src={backButton} alt='Retour' />
			</Link>
			{props.children}
			<button className={classes['submit-button']} onClick={props.button_onClick}>
				Enregistrer
			</button>
			<div className={classes.response}>{props.response}</div>
		</div>
	);
};

export default Form;
