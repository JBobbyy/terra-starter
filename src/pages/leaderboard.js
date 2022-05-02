import { Link } from 'react-router-dom';
import * as query from '../contract/query';
import { useState, useEffect } from 'react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import WalletAddress from '../components/WalletAddress';

const Leaderboard = () => {
	const [scores, setScores] = useState();
	const [loading, setLoading] = useState(true);
	const connectedWallet = useConnectedWallet();

	useEffect(() => {
	  setLoading(true);
	  const fetchScores = async () => {
		  if (connectedWallet && connectedWallet.network.name === 'testnet') {
			  return (await query.getScores(connectedWallet)).scores;
		  }
	  };

	  fetchScores().then(scores => {
	    // We're going to add a stateful variable to store scores
	    setScores(scores);
	    setLoading(false);
	  });
	    // We want to only run this only when the wallet is loaded
	}, [connectedWallet]);

	const renderScores = (scores) => {
		if (!scores || scores.length < 1) {
			return <div> No scores available :( </div>;
		}

		// Load the scores from the stateful React variable as they're updated
		return scores.map((score, index) => {
		  return (
		    <div key={index} className="score">
		      <span>
		        {score[0].slice(0, 5) + '...' + score[0].slice(-4)}:{' '}
			{score[1].toString().padStart(2, '0')}
		      </span>
		    </div>
		  );
		});
	};

	return (
	  <main className="App">
	    <header>
	    	<Link to="/" className="home-link">
	        	<div className="header-titles">
		  			<h1>🎮 Gamers War 🎮</h1>
		  			<p>Only you can save us from the tryhard gamers!</p>
				</div>
	      	</Link>
			<WalletAddress />
	    </header>

	    <div className="score-board-container">
	      <h3>Scoreboard</h3>
	      {loading ? (
	        <div>Loading...</div>
	      ) : (
		renderScores(scores)
	      )}
	      
	      <div></div>
	    </div>
	  </main>
	);
};

export default Leaderboard;
