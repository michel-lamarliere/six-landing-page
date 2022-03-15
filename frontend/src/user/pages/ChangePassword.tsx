import React from 'react';
import { Link } from 'react-router-dom';

import PasswordForm from '../components/PasswordForm';

import formClasses from '../components/UserForms.module.scss';
import classes from './ChangePassword.module.scss';

const ChangePassword: React.FC = () => {
	return (
		<div className={formClasses.basic}>
			<Link to='/profil'>{'< Profil'}</Link>
			<PasswordForm />
		</div>
	);
};

export default ChangePassword;
