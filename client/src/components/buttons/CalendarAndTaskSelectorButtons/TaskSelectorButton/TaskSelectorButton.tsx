import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../../store/_store';
import { OverlayActionTypes } from '../../../../store/overlay';
import { TaskSelectorActionTypes } from '../../../../store/task-selector';

import topArrowIcon from '../../../../assets/icons/top-arrow.svg';
import nutritionIcon from '../../../../assets/icons/six/nutrition.svg';
import sleepIcon from '../../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../../assets/icons/six/sports.svg';
import relaxationIcon from '../../../../assets/icons/six/relaxation.svg';
import projectsIcon from '../../../../assets/icons/six/projects.svg';
import socialLifeIcon from '../../../../assets/icons/six/social_life.svg';

import classes from '../CalendarAndTaskSelectorButtons.module.scss';

const TaskSelectorButton: React.FC<{
	chosenTask: string;
	selectTaskHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}> = (props) => {
	const dispatch = useDispatch();

	const taskSelectorState = useSelector((state: RootState) => state.taskSelector);

	const taskButtonHandler = () => {
		dispatch({ type: TaskSelectorActionTypes.SHOW_TASK_SELECTOR });
		dispatch({ type: OverlayActionTypes.SHOW_OVERLAY });
	};

	const selectTaskHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		props.selectTaskHandler(event);

		dispatch({ type: OverlayActionTypes.HIDE_OVERLAY });
	};

	const getTaskImage = () => {
		switch (props.chosenTask) {
			case 'nutrition': {
				return nutritionIcon;
			}
			case 'sleep': {
				return sleepIcon;
			}
			case 'sports': {
				return sportsIcon;
			}
			case 'relaxation': {
				return relaxationIcon;
			}
			case 'projects': {
				return projectsIcon;
			}
			case 'social_life': {
				return socialLifeIcon;
			}
		}
	};

	return (
		<div className={classes.wrapper}>
			<button onClick={taskButtonHandler} className={classes.button}>
				<img
					src={getTaskImage()}
					alt='Tâche Sélectionnée'
					className={classes.button__icon}
				/>
				<img
					src={topArrowIcon}
					className={`${classes.button__arrow} ${
						taskSelectorState.show && classes['button__arrow--open']
					}`}
					alt='Flêche Calendrier'
				/>
			</button>
			{taskSelectorState.show && (
				<div className={classes.selector}>
					<button
						value='nutrition'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'nutrition' && classes.selector__active
						}`}
					>
						<img src={nutritionIcon} alt='Alimentation' />
						Alimentation
					</button>

					<button
						value='sleep'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'sleep' && classes.selector__active
						}`}
					>
						<img src={sleepIcon} alt='Sommeil' />
						Sommeil
					</button>

					<button
						value='sports'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'sports' && classes.selector__active
						}`}
					>
						<img src={sportsIcon} alt='Sport' />
						Sport
					</button>

					<button
						value='relaxation'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'relaxation' && classes.selector__active
						}`}
					>
						<img src={relaxationIcon} alt='Détente' />
						Détente
					</button>

					<button
						value='projects'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'projects' && classes.selector__active
						}`}
					>
						<img src={projectsIcon} alt='Projets' />
						Projets
					</button>

					<button
						value='social_life'
						onClick={selectTaskHandler}
						className={`${
							props.chosenTask === 'social_life' && classes.selector__active
						}`}
					>
						<img src={socialLifeIcon} alt='Vie Sociale' />
						Vie Sociale
					</button>
				</div>
			)}
		</div>
	);
};

export default TaskSelectorButton;
