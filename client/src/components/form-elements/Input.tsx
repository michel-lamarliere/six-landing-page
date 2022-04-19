import React, { useState } from 'react';

import passwordShowIcon from '../../assets/icons/form&input/password_show.svg';
import passwordHideIcon from '../../assets/icons/form&input/password_hide.svg';

import classes from './Input.module.scss';

export enum InputStyles {
	PURPLE_FORM = 'PURPLE_FORM',
	BLACK_FORM = 'BLACK_FORM',
}

const FormInput: React.FC<{
	styling: InputStyles;
	id: string;
	type: 'text' | 'email' | 'password' | 'textarea';
	placeholder: string;
	value: string;
	errorText: string;
	isValid: boolean;
	isTouched: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	onPaste?: (
		event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
}> = (props) => {
	const {
		id,
		type,
		placeholder,
		value,
		errorText,
		isValid,
		isTouched,
		onChange,
		onBlur,
		onPaste,
	} = props;

	const [showPassword, setShowPassword] = useState(false);

	const showPasswordHandler = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowPassword((prev) => !prev);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.input}>
				{props.type !== 'textarea' && (
					<>
						<input
							className={`${classes.input__input} ${
								props.styling === InputStyles.PURPLE_FORM
									? classes['input__input--purple']
									: classes['input__input--black']
							} ${
								props.type === 'password' &&
								classes['input__input--password']
							}
							${!isValid && isTouched && classes['input__input--invalid']}`}
							type={showPassword ? 'text' : type}
							name={id}
							placeholder={placeholder}
							id={id}
							value={value}
							onChange={onChange}
							onBlur={onBlur}
							onPaste={onPaste}
						/>
						{props.type === 'password' && (
							<div
								onClick={showPasswordHandler}
								className={`${classes['input__show-password']} ${
									showPassword && classes['input__show-password--open']
								}`}
							>
								<img
									src={
										showPassword ? passwordShowIcon : passwordHideIcon
									}
									alt='Icone mot de passe'
								/>
							</div>
						)}
					</>
				)}
				{props.type === 'textarea' && (
					<textarea
						className={`${classes.input__input} ${
							classes['input__input--black']
						} ${!isValid && isTouched && classes['input__input--invalid']}`}
						name={id}
						placeholder={placeholder}
						id={id}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
						onPaste={onPaste}
						rows={10}
					/>
				)}
			</div>
			<div className={classes['error-text']}>
				{!isValid && isTouched && errorText}
			</div>
		</div>
	);
};

export default FormInput;
