import React from 'react';
import classes from './FormInput.module.scss';

const FormInput: React.FC<{
	id: string;
	type: 'text' | 'email' | 'password';
	placeholder: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = (props) => {
	return (
		<div className={classes.wrapper}>
			<label htmlFor={props.id}>{props.id}</label>
			<input
				type={props.type}
				name={props.id}
				placeholder={props.placeholder}
				id={props.id}
				value={props.value}
				onChange={props.onChange}
			/>
		</div>
	);
};

export default FormInput;
