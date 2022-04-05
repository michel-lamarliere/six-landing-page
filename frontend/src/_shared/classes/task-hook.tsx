import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { PopUpActionTypes } from '../store/pop-ups';
import { RootState } from '../store/_store';
import { UserActionTypes } from '../store/user';

export const useTask = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userData = useSelector((state: RootState) => state.user);

	class Task {
		date: any;
		task: any;
		previousLevel: any;

		constructor(taskData: any) {
			this.date = taskData.date;
			this.task = taskData.task;
			this.previousLevel = taskData.previousLevel;
		}

		async save() {
			const response = await fetch(
				`${process.env.REACT_APP_BACKEND_URL}/log/task`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `BEARER ${userData.token}`,
					},
					body: JSON.stringify({
						_id: userData.id,
						date: this.date,
						task: this.task,
						levelOfCompletion:
							this.previousLevel !== 2 ? this.previousLevel + 1 : 0,
					}),
				}
			);

			const responseData = await response.json();

			if (responseData.fatal) {
				dispatch({ type: UserActionTypes.LOG_OUT });
				dispatch({
					type: PopUpActionTypes.SET_AND_SHOW_ERROR,
					message:
						"Il semble que votre compte n'existe plus, veuillez en créer un autre ou nous contacter.",
				});

				navigate('/');
				return;
			}

			return responseData;
		}
	}
	return { Task };
};
