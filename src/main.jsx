import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
import StarRating from './components/StarRating.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		{/* <App /> */}
		<StarRating
			maxRating={5}
			messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
			defaultRating={3}
		/>
		<StarRating maxRating={10} size={48} color="red" />
	</React.StrictMode>
);
