import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useRequest } from '../../shared/hooks/http-hook';
import { ErrorPopupActionTypes } from '../../shared/store/error';
import { RootState } from '../../shared/store/store';

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

	const checkEmail = async () => {
		if (userState.token) {
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

		console.log(userState.token);

		if (responseData.error) {
			navigate('/');
			return;
		}

		console.log(responseData);

		setId(responseData.id);
		console.log(id);
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
			{changedPassword && <Link to={'/'}>Me connecter</Link>}
		</div>
	);
};

export default ForgotPasswordForm;
