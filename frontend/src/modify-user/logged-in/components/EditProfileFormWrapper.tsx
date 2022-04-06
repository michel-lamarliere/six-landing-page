import React from 'react';
import { Link } from 'react-router-dom';

import backButton from '../../../_shared/assets/imgs/icons/back-button.svg';
import RoundedButton from '../../../_shared/components/UIElements/RoundedButton';

import classes from './EditProfileFormWrapper.module.scss';

export enum EditProfileFormWrapperTypes {
	MODIFY = 'MODIFY',
	DELETE = 'DELETE',
}

interface Props {
	type: EditProfileFormWrapperTypes;
	title: string;
	displaySubmitButton?: boolean;
	button_onClick?: any;
	response?: string;
}

const Form: React.FC<Props> = (props) => {
	let rendered =
		props.type === EditProfileFormWrapperTypes.MODIFY ? (
			<div className={classes.wrapper}>
				<div className={classes.title}>{props.title}</div>
				<Link to='/profil' className={classes['back-button']}>
					<img src={backButton} alt='Retour' />
				</Link>
				{props.children}
				{props.displaySubmitButton && (
					<RoundedButton
						text={'Enregistrer'}
						onClick={props.button_onClick}
						className={classes['submit-button']}
					/>
				)}
				<div className={classes.response}>{props.response}</div>
			</div>
		) : (
			<div className={classes.wrapper}>
				<div className={classes.title}>{props.title}</div>
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
