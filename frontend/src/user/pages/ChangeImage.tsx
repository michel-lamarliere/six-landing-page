import React from 'react';
import { Link } from 'react-router-dom';

import classes from './ChangeImage.module.scss';
import formClasses from '../components/UserForms.module.scss';

const ChangeImage: React.FC = () => {
	return (
		<div className={formClasses.basic}>
			<Link to='/profil'>{'< Profil'}</Link>
		</div>
	);
};

export default ChangeImage;
