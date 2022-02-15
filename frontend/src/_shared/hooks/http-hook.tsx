import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorPopupActionTypes } from '../store/error';
import { RootState } from '../store/store';
import { UserActionTypes } from '../store/user';

export const useRequest = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userData = useSelector((state: RootState) => state.user);

	const sendRequest = async (
		url: string,
		method: 'POST' | 'GET' | 'PATCH',
		body: string | null = null
	) => {
		const response = await fetch(url, {
			method,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `BEARER ${userData.token}`,
			},
			body,
		});

		const responseData = await response.json();

		if (responseData.fatal) {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({
				type: ErrorPopupActionTypes.SET_ERROR,
				message:
					"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
			});

			navigate('/');
			return;
		}

		return responseData;
	};

	const sendData = async (_id: string, dateAndTaskStr: string, prevLevel: number) => {
		const date = dateAndTaskStr.split('_')[0];
		const task = dateAndTaskStr.split('_')[1];

		const response = await fetch('http://localhost:8080/api/log/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `BEARER ${userData.token}`,
			},
			body: JSON.stringify({
				_id,
				date,
				task,
				levelOfCompletion: prevLevel !== 2 ? prevLevel + 1 : 0,
			}),
		});

		const responseData = await response.json();

		if (responseData.fatal) {
			dispatch({ type: UserActionTypes.LOG_OUT });
			dispatch({
				type: ErrorPopupActionTypes.SET_ERROR,
				message:
					"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
			});

			navigate('/');
			return;
		}

		return responseData;
	};

	return { sendRequest, sendData };
};
