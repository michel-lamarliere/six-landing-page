import React from 'react';

import RoundedButton from '../../../components/buttons/RoundedButton/RoundedButton';
import HelpTaskItem from '../HelpTaskItem/HelpTaskItem';

import nutritionIcon from '../../../assets/icons/six/nutrition.svg';
import sleepIcon from '../../../assets/icons/six/sleep.svg';
import sportsIcon from '../../../assets/icons/six/sports.svg';
import projectsIcon from '../../../assets/icons/six/projects.svg';
import relaxationIcon from '../../../assets/icons/six/relaxation.svg';
import socialLifeIcon from '../../../assets/icons/six/social_life.svg';
import fullBubble from '../../../assets/icons/full-bubble.svg';
import halfBubble from '../../../assets/icons/half-bubble.svg';
import emptyBubble from '../../../assets/icons/empty-bubble.svg';

import classes from './HelpPage.module.scss';
import HelpLevelItem from '../HelpLevelItem/HelpLevelItem';

const HelpPage: React.FC = () => {
	return (
		<div className={classes.wrapper}>
			<h1 className={classes.title}>FAQ</h1>
			<div className={classes['question-wrapper']}>
				<h3 className={classes['question']}>À quoi sert SIX ?</h3>
				<p className={classes['answer--text']}>
					À avoir une vie saine et équilibrée en vous aidant à mettre en place
					une routine. Accomplir nos 6 objectifs chaque jour sur SIX vous incite
					à recommencer le lendemain. Ces 6 objectifs sont la base d’une journée
					équilibrée et au long terme, amélioreront votre vie.
				</p>
			</div>
			<h3 className={classes.question}>Quels sont les 6 objectifs ?</h3>
			<HelpTaskItem
				task={'Alimentation'}
				icon={nutritionIcon}
				iconAlt={'alimentation'}
			>
				Par exemple :
				<br />
				- Manger 5 fruits et légumes.
				<br />
				- Ne pas manger trop gras, trop sucré ou trop salé.
				<br />- Boire 1,5 L d’eau.
			</HelpTaskItem>
			<HelpTaskItem task={'Sommeil'} icon={sleepIcon} iconAlt={'sommeil'}>
				Par exemple :
				<br />
				- Dormir 8h.
				<br />- Arrêter les écrans 2h avant de s’endormir.
			</HelpTaskItem>
			<HelpTaskItem task={'Sport'} icon={sportsIcon} iconAlt={'sport'}>
				Par exemple : <br />- Faire 30 min d’exercice. <br />- Marcher au moins
				2km.
			</HelpTaskItem>
			<HelpTaskItem task={'Projets'} icon={projectsIcon} iconAlt={'projets'}>
				Par exemple : <br />- Consacrer 2h à un projet qui vous importe
				(associatif, personnel, loisir). <br />- Apprendre pendant 1h (langue,
				cuisine, histoire).
			</HelpTaskItem>
			<HelpTaskItem task={'Détente'} icon={relaxationIcon} iconAlt={'relaxation'}>
				Par exemple : <br />- Méditer ou lire. <br />- Se balader. <br />- Ne rien
				faire.
			</HelpTaskItem>
			<HelpTaskItem
				task={'Vie Sociale'}
				icon={socialLifeIcon}
				iconAlt={'Vie Social'}
			>
				Par exemple : <br />- Voir sa famille ou ses amis. <br />- Parler aux gens
				de votre quartier. <br />- Faire du bénévolat.
			</HelpTaskItem>
			<h3 className={classes.question}>Comment atteindre un objectif ?</h3>
			<div className={classes.tasks}>
				<HelpLevelItem
					icon={fullBubble}
					iconAlt={'tâche accomplie'}
					description={
						'Atteint à 100%. Vous avez fait votre maximum aujourd’hui et pouvez être fier de vous.'
					}
				/>
				<HelpLevelItem
					icon={halfBubble}
					iconAlt={'tâche à moitié accomplie'}
					description={
						'Presque atteint. Ce n’est pas parfait mais vous avez essayé. Continuez comme ça !'
					}
				/>
				<HelpLevelItem
					icon={emptyBubble}
					iconAlt={'tâche non accomplie'}
					description={
						'Vous n’avez rien ou quasi rien fait. Ce n’est pas grave, mais essayez de faire mieux demain si vous voulez progresser.'
					}
				/>
			</div>
			<h2 className={classes['question--contact']}>Un problème, une question ?</h2>
			<RoundedButton
				text={'Contactez-nous'}
				link={'/contact'}
				className={classes['contact-button']}
			/>
		</div>
	);
};

export default HelpPage;
