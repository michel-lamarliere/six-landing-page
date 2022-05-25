import React from 'react';
import { PuffLoader } from 'react-spinners';

import classes from './Spinner.module.scss';

const Spinner: React.FC = () => {
	return <PuffLoader color={'#1cc1e6'} size={'30px'} />;
};

export default Spinner;
