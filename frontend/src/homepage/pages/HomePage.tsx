import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import RoundedButton from '../../_shared/components/UIElements/RoundedButton';
import { Slide2GridItem, Slide3GridItem } from '../components/HomepageGridItem';
import HomepageCarouselButton from '../components/HomepageCarouselButton';
import LoginSignupForms from '../../login-signup-forms/pages/LoginSignupForms';

import SixIcon from '../../_shared/assets/imgs/icons/app/logo.svg';
import FoodIcon from '../../_shared/assets/imgs/icons/six/food.svg';
import SleepIcon from '../../_shared/assets/imgs/icons/six/sleep.svg';
import SportsIcon from '../../_shared/assets/imgs/icons/six/sports.svg';
import RelaxationIcon from '../../_shared/assets/imgs/icons/six/relaxation.svg';
import WorkIcon from '../../_shared/assets/imgs/icons/six/work.svg';
import SocialIcon from '../../_shared/assets/imgs/icons/six/social.svg';
import TaskFullIcon from '../../_shared/assets/imgs/icons/tutorial/tutorial-full.svg';
import TaskHalfIcon from '../../_shared/assets/imgs/icons/tutorial/tutorial-half.svg';
import TaskEmptyIcon from '../../_shared/assets/imgs/icons/tutorial/tutorial-empty.svg';

import classes from './Homepage.module.scss';

const HomePage: React.FC = () => {
	const carousel = [
		<>
			<div className={classes.carousel__text__title}>
				C'est quoi {'    '}
				<img
					src={SixIcon}
					alt='six'
					className={classes.carousel__text__title__icon}
				/>{' '}
				?
			</div>
			<div className={classes.carousel__text__para}>
				Une appli qui vous aide à avoir une vie saine et équilibrée.
			</div>
			<div className={classes.carousel__text__title}>Comment ?</div>
			<div className={classes.carousel__text__para}>
				En essayant d’accomplir nos six objectifs chaque jour.
				<br />
				<br />
				Ces 6 objectifs facilitent la mise en place d’une routine. Ils sont la
				base d’une vie équilibrée.
			</div>
		</>,
		<>
			<div className={classes.carousel__text__header}>
				Nos six objectifs journaliers :
			</div>
			<div className={classes.carousel__text__grid}>
				<Slide2GridItem title={'Alimentation'} img={FoodIcon} />
				<Slide2GridItem title={'Sommeil'} img={SleepIcon} />
				<Slide2GridItem title={'Sport'} img={SportsIcon} />
				<Slide2GridItem title={'Relaxation'} img={RelaxationIcon} />
				<Slide2GridItem title={'Projets'} img={WorkIcon} />
				<Slide2GridItem title={'Vie Sociale'} img={SocialIcon} />
			</div>
		</>,
		<>
			<div className={classes.carousel__text__header}>
				Comment atteindre un objectif ?
			</div>
			<div className={classes['carousel__text__header-two']}>
				Il suffit de cliquer jusqu’à obtenir le niveau accompli.
			</div>
			<div className={classes.carousel__text__grid}>
				<Slide3GridItem title={'Atteint'} img={TaskFullIcon} />
				<Slide3GridItem title={'Presque atteint'} img={TaskHalfIcon} />
				<Slide3GridItem title={'Non atteint'} img={TaskEmptyIcon} />
			</div>
			<Link to='' className={classes.carousel__text__link}>
				En savoir plus
			</Link>
		</>,
	];

	const [carouselIndex, setCarouselIndex] = useState(0);

	const carouselHandler = (number: number) => {
		setCarouselIndex(number);
	};

	return (
		<div className={classes.wrapper}>
			<div className={classes.carousel}>
				<div className={classes.carousel__text}>{carousel[carouselIndex]}</div>
				<div className={classes.carousel__buttons}>
					<HomepageCarouselButton
						carouselIndex={carouselIndex}
						slideIndex={0}
						onClick={() => carouselHandler(0)}
					/>
					<HomepageCarouselButton
						carouselIndex={carouselIndex}
						slideIndex={1}
						onClick={() => carouselHandler(1)}
					/>
					<HomepageCarouselButton
						carouselIndex={carouselIndex}
						slideIndex={2}
						onClick={() => carouselHandler(2)}
					/>
				</div>
			</div>
			<div className={classes.buttons}>
				<RoundedButton
					text={'Se connecter'}
					link={'/login-signup'}
					className={`${classes.buttons__button} ${classes['buttons__button--log-in']}`}
				/>
				<RoundedButton
					text={"S'inscrire"}
					link={'/login-signup'}
					className={`${classes.buttons__button} ${classes['buttons__button--sign-up']}`}
				/>
			</div>
			<div className={classes.forms}>
				<LoginSignupForms />
			</div>
		</div>
	);
};

export default HomePage;
