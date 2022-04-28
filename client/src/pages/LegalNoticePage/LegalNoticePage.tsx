import React from 'react';

import classes from './LegalNoticePage.module.scss';

const LegalNoticePage: React.FC = () => {
	return (
		<div className={classes.wrapper}>
			<h1 className={classes.title}>Mentions Légales</h1>
			<h2 className={classes.heading}>I. Présentation</h2>
			<p className={classes.paragraph}>
				Merci de lire avec attention les différentes modalités d’utilisation du
				présent site avant d’y parcourir ses pages. En vous connectant sur ce
				site, vous acceptez sans réserves les présentes modalités. Aussi,
				conformément à l’article n°6 de la Loi n°2004-575 du 21 Juin 2004 pour la
				confiance dans l’économie numérique, les responsables du présent site
				internet www.six-app.com sont :
				<h3 className={classes.subheading}>Éditeur du Site :</h3>
				Michel Lamarlière et Enola Louge
				<br />1 Rue Pharaon 31000 Toulouse
				<br />
				info@six-app.com
				<h3 className={classes.subheading}>Hébergement :</h3>
				Vercel Inc.
				<br />
				340 S Lemon Ave #4133
				<br />
				Walnut, CA 91789
				<br />
				privacy@vercel.com
				<br />
				vercel.com
				<h3 className={classes.subheading}>Développement :</h3>
				Michel Lamarlière
				<br />1 Rue Pharaon 31000 Toulouse
				<br />
				michel-lamarliere.com
			</p>
			<h2 className={classes.heading}>II. Conditions d’utilisation</h2>
			<p className={classes.paragraph}>
				Ce site est proposé en différents langages web (HTML, HTML5, Javascript,
				CSS, etc…) pour un meilleur confort d’utilisation et un graphisme plus
				agréable, nous vous recommandons de recourir à des navigateurs modernes
				comme Internet explorer, Safari, Firefox, Google Chrome, etc… <br />
				Michel Lamarlière met en oeuvre tous les moyens dont ils disposent pour
				assurer une information fiable et une mise à jour fiable de ses sites
				internet. Toutefois, des erreurs ou omissions peuvent survenir.
				L’internaute devra donc s’assurer de l’exactitude des informations auprès
				de , et signaler toutes modifications du site qu’il jugerait utile. n’est
				en aucun cas responsable de l’utilisation faite de ces informations, et de
				tout préjudice direct ou indirect pouvant en découler.
			</p>
			<h2 className={classes.heading}>III. Cookies</h2>
			<p className={classes.paragraph}>
				Le site www.six-app.com peut-être amené à vous demander l’acceptation des
				cookies pour des besoins de statistiques et d’affichage. Un cookies est
				une information déposée sur votre disque dur par le serveur du site que
				vous visitez. Il contient plusieurs données qui sont stockées sur votre
				ordinateur dans un simple fichier texte auquel un serveur accède pour lire
				et enregistrer des informations . Certaines parties de ce site ne peuvent
				être fonctionnelles sans l’acceptation de cookies.
			</p>
			<h2 className={classes.heading}>IV. Services fournis</h2>
			<p className={classes.paragraph}>
				L’ensemble des activités ainsi que ses informations sont présentés sur le
				site www.six-app.com Michel Lamarlière s’efforce de fournir sur le site
				www.six-app.com des informations aussi précises que possible. Les
				renseignements figurant sur le site ne sont pas exhaustifs et les photos
				non contractuelles. Ils sont donnés sous réserve de modifications ayant
				été apportées depuis leur mise en ligne. Par ailleurs, tous les
				informations indiquées sur le site www.six-app.com sont données à titre
				indicatif, et sont susceptibles de changer ou d’évoluer sans préavis.
			</p>
			<h2 className={classes.heading}>
				V. Limitation contractuelles sur les données
			</h2>
			<p className={classes.paragraph}>
				Les informations contenues sur ce site sont aussi précises que possible et
				le site remis à jour à différentes périodes de l’année, mais peut
				toutefois contenir des inexactitudes ou des omissions. Si vous constatez
				une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de
				bien vouloir le signaler par email, à l’adresse info@six-app.com, en
				décrivant le problème de la manière la plus précise possible (page posant
				problème, type d’ordinateur et de navigateur utilisé, …) Les liens
				hypertextes mis en place dans le cadre du présent site internet en
				direction d’autres ressources présentes sur le réseau Internet ne
				sauraient engager la responsabilité de Michel Lamarlière.
			</p>
			<h2 className={classes.heading}>VI. Propriété intellectuelle</h2>
			<p className={classes.paragraph}>
				Tout le contenu du présent sur le site www.six-app.com , incluant, de
				façon non limitative, les graphismes, images, textes, vidéos, animations,
				sons, logos, gifs et icônes ainsi que leur mise en forme sont la propriété
				exclusive de Michel Lamarlière à l’exception des marques, logos ou
				contenus appartenant à d’autres sociétés partenaires ou auteurs. <br />
				Toute reproduction, distribution, modification, adaptation, retransmission
				ou publication, même partielle, de ces différents éléments est strictement
				interdite sans l’accord exprès par écrit de Louge Enola. Cette
				représentation ou reproduction, par quelque procédé que ce soit, constitue
				une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code
				de la propriété intellectuelle. Le non-respect de cette interdiction
				constitue une contrefaçon pouvant engager la responsabilité civile et
				pénale du contrefacteur. En outre, les propriétaires des Contenus copiés
				pourraient intenter une action en justice à votre encontre.
			</p>
			<h2 className={classes.heading}>VII. Déclaration à la CNIL</h2>
			<p className={classes.paragraph}>
				Conformément à la loi 78-17 du 6 janvier 1978 (modifiée par la loi
				2004-801 du 6 août 2004 relative à la protection des personnes physiques à
				l’égard des traitements de données à caractère personnel) relative à
				l’informatique, aux fichiers et aux libertés, ce site n’a pas fait l’objet
				d’une déclaration auprès de la Commission nationale de l’informatique et
				des libertés http://www.cnil.fr
			</p>
			<h2 className={classes.heading}>VIII. Litiges</h2>
			<p className={classes.paragraph}>
				Les présentes conditions du site www.six-app.com sont régies par les lois
				françaises et toute contestation ou litiges qui pourraient naître de
				l’interprétation ou de l’exécution de celles-ci seront de la compétence
				exclusive des tribunaux. La langue de référence, pour le règlement de
				contentieux éventuels, est le français.
			</p>
			<h2 className={classes.heading}>IX. Données personnelles</h2>
			<p className={classes.paragraph}>
				Les informations fournis lors de la création d’un compte sont utilisées
				exclusivement à des fins de statistiques internes, de manière à améliorer
				la qualité des services qui vous sont proposés. Les bases de données sont
				protégées par les dispositions de la loi du 1er juillet 1998 transposant
				la directive 96/9 du 11 mars 1996 relative à la protection juridique des
				bases de données. Lors de la suppression de votre compte, vos données sont
				automatiquement supprimées.
			</p>
		</div>
	);
};

export default LegalNoticePage;
