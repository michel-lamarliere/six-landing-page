import React from 'react';

const RefreshSpinner: React.FC<{ className: string }> = (props) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='34.239'
			height='27.115'
			viewBox='0 0 34.239 27.115'
		>
			<g id='refresh-spinner' transform='translate(0.619 -2.946)'>
				<path
					id='Tracé_15'
					data-name='Tracé 15'
					d='M33.682,6v8H25.5'
					transform='translate(-2.182 -0.166)'
					fill='none'
					stroke='#8d88ff'
					stroke-linecap='round'
					stroke-linejoin='round'
					stroke-width='3'
					className={props.className}
				/>
				<path
					id='Tracé_16'
					data-name='Tracé 16'
					d='M1.5,29V21H9.682'
					transform='translate(0 -1.829)'
					fill='none'
					stroke='#8d88ff'
					stroke-linecap='round'
					stroke-linejoin='round'
					stroke-width='3'
					className={props.className}
				/>
				<path
					id='Tracé_17'
					data-name='Tracé 17'
					d='M4.923,12.5a12.184,12.184,0,0,1,8.861-7.7A12.457,12.457,0,0,1,25.173,8.021L31.5,13.836m-30,5.335,6.327,5.815a12.457,12.457,0,0,0,11.389,3.222,12.184,12.184,0,0,0,8.861-7.7'
					fill='none'
					stroke='#8d88ff'
					stroke-linecap='round'
					stroke-linejoin='round'
					stroke-width='3'
					className={props.className}
				/>
			</g>
		</svg>
	);
};

export default RefreshSpinner;
