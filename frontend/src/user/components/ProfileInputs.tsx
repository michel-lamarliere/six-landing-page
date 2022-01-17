import React from 'react';
import classes from './ProfileInputs.module.scss';

// export const NameInput: React.FC<{
// 	onClick: (event: React.FormEvent) => void;
// 	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// 	onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
// 	onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
// 	value: string;
// }> = (props) => {
// 	return (
// 		<form className={classes.wrapper}>
// 			<label htmlFor='name'>Nom</label>
// 			<input
// 				type='text'
// 				id='name'
// 				onChange={props.onChange}
// 				value={props.value}
// 			></input>
// 			<button onClick={props.onClick}>Changer Nom</button>
// 		</form>
// 	);
// };

export const PasswordInputs: React.FC<{ onClick?: (event: React.FormEvent) => void }> = (
	props
) => {
	return (
		<form className={classes.wrapper} onClick={props.onClick}>
			<label htmlFor='old-password'>Ancien Mot de Passe</label>
			<input type='password' id='old-password' placeholder='********'></input>
			<label htmlFor='new-password'>Nouveau Mot de Passe</label>
			<input type='password' id='new-password' placeholder='********'></input>
			<label htmlFor='new-password-confirmation'>
				Confimer le Nouveau Mot de Passe
			</label>
			<input
				type='text'
				id='new-password-confirmation'
				placeholder='********'
			></input>
			<button>Changer Mot de Passe</button>
		</form>
	);
};
