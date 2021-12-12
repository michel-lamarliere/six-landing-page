import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import Log from './log/pages/Log';

import store from './shared/store/store';

import Navigation from './shared/components/layout/Navigation';

const App: React.FC = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Navigation />
				<Routes>
					<Route path='/:userId/log' element={<Log />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	);
};

export default App;
