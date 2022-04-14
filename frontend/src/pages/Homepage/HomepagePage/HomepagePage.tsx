import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import RoundedButton from '../../../components/buttons/RoundedButton/RoundedButton';
import { Slide2GridItem, Slide3GridItem } from '../HomepageGridItem/HomepageGridItem';
import HomepageCarouselButton from '../HomepageCarouselButton/HomepageCarouselButton';

import sixIcon from '../../../assets/icons/app/logo.svg';
import foodIcon from '../../../assets/icons/six/food.svg';
import sleepIcon from '../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../assets/icons/six/sports.svg';
import relaxationIcon from '../../../assets/icons/six/relaxation.svg';
import workIcon from '../../../assets/icons/six/work.svg';
import socialIcon from '../../../assets/icons/six/social.svg';
import taskFullIcon from '../../../assets/icons/tutorial/tutorial-full.svg';
import taskHalfIcon from '../../../assets/icons/tutorial/tutorial-half.svg';
import taskEmptyIcon from '../../../assets/icons/tutorial/tutorial-empty.svg';

import classes from './HomepagePage.module.scss';
import LoginForm from '../../log_in-sign_up/LogInForm/LogInForm';
import SignupForm from '../../log_in-sign_up/SignUpForm/SignUpForm';

const HomePage: React.FC = () => {
	const carousel = [
		<>
			<div className={classes.carousel__text__title}>
				C'est quoi {'    '}
				<img
					src={sixIcon}
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
				<Slide2GridItem title={'Alimentation'} img={foodIcon} />
				<Slide2GridItem title={'Sommeil'} img={sleepIcon} />
				<Slide2GridItem title={'Sport'} img={sportsIcon} />
				<Slide2GridItem title={'Relaxation'} img={relaxationIcon} />
				<Slide2GridItem title={'Projets'} img={workIcon} />
				<Slide2GridItem title={'Vie Sociale'} img={socialIcon} />
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
				<Slide3GridItem title={'Atteint'} img={taskFullIcon} />
				<Slide3GridItem title={'Presque atteint'} img={taskHalfIcon} />
				<Slide3GridItem title={'Non atteint'} img={taskEmptyIcon} />
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

	const [showLoginForm, setShowLoginForm] = useState(true);

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
				<Link
					to='/contact'
					className={`${classes.buttons__contact} ${classes['buttons__contact--desktop']}`}
				>
					Nous contacter
				</Link>
			</div>
			<div className={classes.buttons}>
				<RoundedButton
					text={'Se connecter'}
					link={'/connexion'}
					className={`${classes.buttons__button} ${classes['buttons__button--log-in']}`}
				/>
				<RoundedButton
					text={"S'inscrire"}
					link={'/inscription'}
					className={`${classes.buttons__button} ${classes['buttons__button--sign-up']}`}
				/>
				<Link
					to='/contact'
					className={`${classes.buttons__contact} ${classes['buttons__contact--mobile']}`}
				>
					Nous contacter
				</Link>
			</div>
			<div className={classes.forms}>
				{showLoginForm ? (
					<LoginForm
						mobile={false}
						switchFormHandler={() => setShowLoginForm(false)}
					/>
				) : (
					<SignupForm
						mobile={false}
						switchFormHandler={() => setShowLoginForm(true)}
					/>
				)}
			</div>
		</div>
	);
};

export default HomePage;
