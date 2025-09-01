// Home.jsx
import React from 'react';
import { Link } from 'react-router';
import pokemonbg from '../assets/pokemonbg.png'
import pokedle_reference from '../assets/pokedle-reference.png'
import guess_reference from '../assets/guess-reference.png'

const Home = () => {
  return (
    <div className="text-center select-none  h-screen w-screen flex flex-col  items-center " style={{backgroundImage:`url(${pokemonbg})`}}>
      <h1 className="text-5xl text-white font-bold my-20">Welcome to the Pokémon Game</h1>
      <div className='flex gap-10'>
      <div className="flex flex-col gap-4 justify-center">
        <h1 className='text-4xl font-mono text-white text-shadow-md text-shadow-blue-400'>Pokedle</h1>
        <div style={{backgroundImage: `url(${pokedle_reference})`}} className='h-[300px] border brightness-50 rounded-lg w-[500px] bg-cover'/>
          <Link to="/pokedle" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Pokedle 
          </Link>
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <h1 className='text-4xl font-mono text-white text-shadow-md text-shadow-blue-400'>Guessmon</h1>
        <div style={{backgroundImage: `url(${guess_reference})`}} className='h-[300px] border brightness-50 rounded-lg w-[500px] bg-cover'/>
          <Link to="/guess-the-pokemon" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Guessmon
          </Link>
      </div>
      </div>
    </div>
  );
};

export default Home;
