import React from 'react';
import { Link } from 'react-router-dom';

import RoundedButton from '../../components/buttons/RoundedButton/RoundedButton';

import backButtonIcon from '../../assets/icons/back-button.svg';

import classes from './EditUserContainer.module.scss';

export enum EditProfileFormWrapperTypes {
	MODIFY = 'MODIFY',
	DELETE = 'DELETE',
}

interface Props {
	type: EditProfileFormWrapperTypes;
	title: string;
	formAction?: (event: React.FormEvent) => void;
	displaySubmitButton?: boolean;
	response?: string;
	backButtonLink?: string;
}

const Form: React.FC<Props> = (props) => {
	let rendered =
		props.type === EditProfileFormWrapperTypes.MODIFY ? (
			<form className={classes.wrapper} onSubmit={props.formAction}>
				<div className={classes.title}>{props.title}</div>
				<Link
					to={props.backButtonLink || '/profil'}
					className={classes['back-button']}
				>
					<img src={backButtonIcon} alt='Retour' />
				</Link>
				{props.children}
				{props.displaySubmitButton && (
					<RoundedButton
						type='submit'
						text={'Enregistrer'}
						className={classes['submit-button']}
					/>
				)}
				<div className={classes.response}>{props.response}</div>
			</form>
		) : (
			<div className={classes.wrapper}>
				<div className={classes.title}>{props.title}</div>
				<Link to='/profil' className={classes['back-button']}>
					<img src={backButtonIcon} alt='Retour' />
				</Link>
				{props.children}
				<div className={classes.response}>{props.response}</div>
			</div>
		);

	return <>{rendered}</>;
};

export default Form;
