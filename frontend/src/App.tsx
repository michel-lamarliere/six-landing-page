import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './shared/store/store';

import Navigation from './shared/components/layout/Navigation';

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Navigation />
			</BrowserRouter>
		</Provider>
	);
};

export default App;
