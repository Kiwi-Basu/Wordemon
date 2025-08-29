// Home.jsx
import React from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Pokémon Game</h1>
      <div className="flex gap-4 justify-center">
        <Link to="/pokedle" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Pokedle Game
        </Link>
        <Link to="/guess-the-pokemon" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Guess The Pokemon
        </Link>
      </div>
    </div>
  );
};

export default Home;
