import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../store/_store';

import { useInput, useInputTypes } from '../../hooks/input-hook';
import { useRequest } from '../../hooks/http-hook';

import Input, { InputStyles } from '../../components/form-elements/Input';
import RoundedButton from '../../components/buttons/RoundedButton/RoundedButton';

import backButtonIcon from '../../assets/icons/back-button.svg';
import fullBubbleIcon from '../../assets/icons/full-bubble.svg';
import halfBubbleIcon from '../../assets/icons/half-bubble.svg';
import emptyBubbleIcon from '../../assets/icons/empty-bubble.svg';

import classes from './TaskDetailContainer.module.scss';

interface Props {
	icon: string;
	title: string;
	task: string;
}

const TaskDetailContainer: React.FC<Props> = (props) => {
	const navigate = useNavigate();

	const { sendRequest } = useRequest();

	const userState = useSelector((state: RootState) => state.user);

	const [submitAttempt, setSubmitAttempt] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');

	const {
		input: goalsInput,
		setInput: setGoalsInput,
		inputOnChangeHandler: goalsInputOnChangeHandler,
		inputOnBlurHandler: goalsInputOnBlurHandler,
	} = useInput({
		type: useInputTypes.GOALS,
		validate: true,
		display: submitAttempt,
	});

	const backButtonHandler = () => {
		navigate(-1);
	};

	const getGoals = async () => {
		const responseData = await sendRequest({
			method: 'GET',
			url: `${process.env.REACT_APP_BACKEND_URL}/goals/goal/${userState.id}/${props.task}`,
		});

		if (responseData.goals !== null) {
			setGoalsInput((prev) => ({ ...prev, value: responseData.goals }));
		}
	};

	const submitHandler = async () => {
		setSubmitAttempt(true);

		if (goalsInput.value.trim().length > 100) {
			setGoalsInput((prev) => ({ ...prev, isValid: false }));
			return;
		}

		const responseData = await sendRequest({
			method: 'POST',
			url: `${process.env.REACT_APP_BACKEND_URL}/goals/edit-goal`,
			body: JSON.stringify({
				id: userState.id,
				task: props.task,
				goals: goalsInput.value.trim(),
			}),
		});

		if (responseData.error) {
			return;
		}

		setResponseMessage('Objectifs modifiés.');

		setTimeout(() => {
			setResponseMessage('');
		}, 3000);
	};

	useEffect(() => {
		getGoals();
	}, []);

	return (
		<div className={classes.wrapper}>
			<button onClick={backButtonHandler} className={classes['back-button']}>
				<img src={backButtonIcon} alt='Retour' />
			</button>
			<h1 className={classes.title}>Objectifs de tâche</h1>
			<div className={classes.task}>
				<img src={props.icon} alt={props.title} className={classes.task__icon} />
				<div>{props.title}</div>
			</div>
			<Input
				styling={InputStyles.PURPLE_FORM}
				id={'objectives'}
				type={'textarea'}
				placeholder={'Vos objectifs'}
				value={goalsInput.value}
				errorText={'100 caractères maximum.'}
				isValid={goalsInput.isValid}
				isTouched={goalsInput.isTouched}
				onChange={goalsInputOnChangeHandler}
				onBlur={goalsInputOnBlurHandler}
			/>
			<div className={classes.response}>{responseMessage}</div>
			<RoundedButton text={'Enregistrer'} onClick={submitHandler} />
			<div className={classes.bubbles}>
				<div className={classes.bubbles__item}>
					<img src={fullBubbleIcon} alt='Atteint' />
					<div>Atteint</div>
				</div>
				<div className={classes.bubbles__item}>
					<img src={halfBubbleIcon} alt='Preque atteint' />
					<div>Presque atteint</div>
				</div>
				<div className={classes.bubbles__item}>
					<img src={emptyBubbleIcon} alt='Pas atteint' />
					<div>Pas atteint</div>
				</div>
			</div>
		</div>
	);
};

export default TaskDetailContainer;
