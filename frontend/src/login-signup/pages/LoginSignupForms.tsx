import React, { useState } from 'react';

import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

import classes from './LoginSignupForms.module.scss';

const Forms: React.FC = () => {
	const [showLoginForm, setShowLoginForm] = useState(true);

	// const logInUser = (responseData: {
	// 	error: string;
	// 	token: string;
	// 	id: string;
	// 	name: string;
	// 	email: string;
	// 	confirmedEmail: string;
	// }) => {
	// 	if (responseData.error) {
	// 		setResponseMessage(responseData.error);
	// 		return;
	// 	}

	// 	const { token, id, name, email, confirmedEmail } = responseData;

	// 	const tokenExpiration = addHours(new Date(), 1);

	// 	if (rememberEmail) {
	// 		localStorage.setItem('rememberEmail', email);
	// 	} else if (!rememberEmail) {
	// 		localStorage.removeItem('rememberEmail');
	// 	}

	// 	dispatch({
	// 		type: UserActionTypes.LOG_IN,
	// 		token: token,
	// 		expiration: tokenExpiration.toISOString(),
	// 		id: id,
	// 		name: name,
	// 		email: email,
	// 		confirmedEmail: confirmedEmail,
	// 	});

	// 	sessionStorage.setItem(
	// 		'showEmailConfirmationPopup',
	// 		JSON.stringify(!confirmedEmail)
	// 	);

	// 	if (!confirmedEmail) {
	// 		dispatch({ type: EmailConfirmationActionTypes.SHOW });
	// 	}

	// 	navigate('/journal/quotidien');
	// };

	return (
		<>
			{showLoginForm ? (
				<LoginForm switchFormHandler={() => setShowLoginForm(false)} />
			) : (
				<SignupForm switchFormHandler={() => setShowLoginForm(true)} />
			)}
		</>
	);
};

export default Forms;
