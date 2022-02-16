import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorPopupActionTypes } from '../../_shared/store/error';
import { RootState } from '../../_shared/store/store';

import { useRequest } from '../../_shared/hooks/http-hook';

import PasswordForm from '../components/PasswordForm';

import classes from './ForgotPasswordForm.module.scss';

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
				type: ErrorPopupActionTypes.SET_ERROR,
				message: 'Chemin interdit.',
			});
			return;
		}

		const responseData = await sendRequest(
			`http://localhost:8080/api/user_modify/${email}/${uniqueId}`,
			'GET'
		);

		if (responseData.error) {
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
				<PasswordForm
					setShowChangePassword={setShowChangePassword}
					setResponse={setResponse}
					forgotForm={true}
					userId={id}
					redirect={redirect}
				/>
			)}
			<p>{response}</p>
			{changedPassword && <Link to='/'>Me connecter</Link>}
		</div>
	);
};

export default ForgotPasswordForm;
