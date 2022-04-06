import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { PopUpActionTypes } from '../../../_shared/store/pop-ups';
import { RootState } from '../../../_shared/store/_store';

import { useRequest } from '../../../_shared/hooks/http-hook';

import PasswordForm from '../../components/PasswordForm';

import classes from './ChangeForgottenPassword.module.scss';

const ForgotPasswordForm: React.FC = () => {
	const { sendRequest } = useRequest();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { email, uniqueId } = useParams();

	const userState = useSelector((state: RootState) => state.user);

	const [showChangePassword, setShowChangePassword] = useState(false);
	const [response, setResponse] = useState('');
	const [changedPassword, setChangedPassword] = useState(false);

	const [id, setId] = useState('');

	const userData =
		userState.token &&
		userState.expiration &&
		userState.id &&
		userState.name &&
		userState.email &&
		userState.confirmedEmail;

	const checkEmail = async () => {
		if (userData) {
			navigate('/');
			dispatch({
				type: PopUpActionTypes.SET_AND_SHOW_ERROR,
				message: 'Chemin interdit.',
			});
			return;
		}

		const responseData = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/user-modify/forgot-password/confirmation/${email}/${uniqueId}`,
			'GET'
		);

		console.log(responseData);

		if (responseData.error) {
			dispatch({
				type: PopUpActionTypes.SET_AND_SHOW_ERROR,
				message: 'Chemin interdit.',
			});
			navigate('/');
			return;
		}

		setId(responseData.id);
	};

	const redirect = () => {
		setChangedPassword(true);

		setTimeout(() => {
			navigate('/');
		}, 5000);
	};

	useEffect(() => {
		checkEmail();
	}, []);

	useEffect(() => {
		checkEmail();
	}, [userState.token]);

	return (
		<div>
			{email}
			{!changedPassword && (
				<PasswordForm forgotForm={true} userId={id} redirect={redirect} />
			)}
			<p>{response}</p>
			{changedPassword && <Link to='/'>Me connecter</Link>}
		</div>
	);
};

export default ForgotPasswordForm;
