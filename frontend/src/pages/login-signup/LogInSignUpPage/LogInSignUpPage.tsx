import React, { useState } from 'react';

import LoginForm from '../LogInForm/LoginForm';
import SignupForm from '../SignUpForm/SignupForm';

const Forms: React.FC = () => {
	const [showLoginForm, setShowLoginForm] = useState(true);

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
