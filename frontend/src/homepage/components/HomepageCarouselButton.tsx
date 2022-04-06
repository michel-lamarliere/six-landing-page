import React from 'react';
import classes from './HomepageCarouselButton.module.scss';

interface Props {
	carouselIndex: number;
	slideIndex: number;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CarouselButton: React.FC<Props> = (props) => {
	return (
		<button
			className={`${classes.button} ${
				props.carouselIndex === props.slideIndex && classes['button--active']
			}`}
			onClick={props.onClick}
		></button>
	);
};

export default CarouselButton;
