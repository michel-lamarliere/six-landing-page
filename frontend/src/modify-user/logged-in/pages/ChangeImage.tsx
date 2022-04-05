import React from 'react';
import { Link } from 'react-router-dom';

import FormWrapper, { FormWrapperTypes } from '../components/FormWrapper';

import classes from './ChangeImage.module.scss';

const ChangeImage: React.FC = () => {
	return (
		<FormWrapper
			type={FormWrapperTypes.MODIFY}
			title={'Image'}
			displaySubmitButton={true}
			button_onClick={undefined}
			response={''}
		></FormWrapper>
	);
};

export default ChangeImage;
