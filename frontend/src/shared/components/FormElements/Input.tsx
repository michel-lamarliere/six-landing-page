import id from 'date-fns/esm/locale/id/index.js';
import React, { useEffect, useState } from 'react';
import classes from './Input.module.scss';

const FormInput: React.FC<{
	id: string;
	type: 'text' | 'email' | 'password';
	placeholder: string;
	value: string;
	errorText: string;
	isValid: boolean;
	isTouched: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
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
	} = props;

	return (
		<div className={classes.wrapper}>
			<p>{!isValid && isTouched && errorText}</p>
			<label htmlFor={id}>{id}</label>
			<input
				className={!isValid && isTouched ? classes.invalid : ''}
				type={type}
				name={id}
				placeholder={placeholder}
				id={id}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
		</div>
	);
};

export default FormInput;
