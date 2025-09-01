import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import pokedle from '../assets/pokedle.png'

const Pokemon = () => {
  
  const [pokemon, setPokemon] = useState(null);
  const [pokemonSpecies, setPokemonSpecies] = useState(null);

  const [allPokemonData, setAllPokemonData] = useState([]); // Array of {name, url}
  const [spriteCache, setSpriteCache] = useState({}); // { [name]: spriteURL }

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [targetPokemonSpecies, setTargetPokemonSpecies] = useState(null);

  const [pokemonSearch, setPokemonSearch] = useState("");
  const [guessedList, setGuessedList] = useState([]);
  const [isCorrectlyGuessed, setIsCorrectlyGuessed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Filter suggestions for autocomplete
  const filteredSuggestions = allPokemonData
    .filter(p => p.name.toLowerCase().startsWith(pokemonSearch.toLowerCase()))
    .slice(0, 10);

  // Fetch all Pokemon names + URLs once on mount
  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
        const data = await response.json();
        setAllPokemonData(data.results); // [{name, url}, ...]
      } catch (error) {
        console.error("Error fetching all Pokémon names", error);
      }
    }

    fetchAllPokemon();
    getPokemon();
  }, []);

  // Fetch sprite images for suggestions not in cache
  useEffect(() => {
    filteredSuggestions.forEach(async (p) => {
      if (!spriteCache[p.name]) {
        try {
          const res = await fetch(p.url);
          const data = await res.json();
          setSpriteCache(prev => ({
            ...prev,
            [p.name]: data.sprites.front_default,
          }));
        } catch (error) {
          console.error("Error fetching sprite for", p.name);
        }
      }
    });
  }, [filteredSuggestions]);

  // Fetch Pokemon by name for guesses
  async function fetchPokemon(name) {
    if (!name) return;

    const POKEMON_URL = `${import.meta.env.VITE_POKE_API_KEY}${name}`;
    const POKEMON_SPECIES_URL = `${import.meta.env.VITE_POKE_SPECIES_API_KEY}${name}`;

    setIsLoading(true);
    setIsError(false);
    try {
      const pokeResponse = await fetch(POKEMON_URL);
      const pokeSpeciesResponse = await fetch(POKEMON_SPECIES_URL);
      const pokeResult = await pokeResponse.json();
      const pokeSpeciesResult = await pokeSpeciesResponse.json();

      setPokemonSpecies(pokeSpeciesResult);
      setPokemon(pokeResult);

      setGuessedList(prev => [
        ...prev,
        {
          name: pokeResult.name,
          generation: pokeSpeciesResult.generation.name,
          types: pokeResult.types,
          image: pokeResult.sprites.front_default,
        },
      ]);
    } catch (error) {
      console.error("Error fetching pokemon", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // Get target random Pokemon for guessing
  async function getPokemon() {
    const id = Math.floor(Math.random() * 1024) + 1;
    setIsLoading(true);
    setIsError(false);
    try {
      const targetResponse = await fetch(`${import.meta.env.VITE_POKE_API_KEY}${id}`);
      const targetSpeciesResponse = await fetch(`${import.meta.env.VITE_POKE_SPECIES_API_KEY}${id}`);
      const targetResult = await targetResponse.json();
      const targetSpeciesResult = await targetSpeciesResponse.json();

      setTargetPokemonSpecies(targetSpeciesResult);
      setTargetPokemon(targetResult);
    } catch (error) {
      console.error("Error fetching pokemon", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const resetGame = () => {
    setIsError(false);
    setIsLoading(false);
    setTargetPokemon(null);
    setTargetPokemonSpecies(null);
    setPokemon(null);
    setPokemonSpecies(null);
    setGuessedList([]);
    setIsCorrectlyGuessed(false);
    setPokemonSearch("");
    getPokemon();
  };

  // Compare guessed Pokemon with target Pokemon
  const Matching = (guessed) => {
    const targetType1 = targetPokemon.types.map(t => t.type.name);

    const nameMatch = guessed.name === targetPokemon.name;
    const generationMatch = guessed.generation === targetPokemonSpecies.generation.name;

    const type1Match = guessed.types[0]?.type?.name === targetType1[0];
    const type2Match = guessed.types[1]?.type?.name === targetType1[1];

    const type1WrongPosition = !type1Match && targetType1.includes(guessed.types[0]?.type.name);
    const type2WrongPosition = !type2Match && targetType1.includes(guessed.types[1]?.type.name);

    if (nameMatch && !isCorrectlyGuessed) {
      setIsCorrectlyGuessed(true);
    }
    return {
      nameMatch,
      generationMatch,
      type1Match,
      type2Match,
      type1WrongPosition,
      type2WrongPosition,
    };
  };

  return (
    <>
      <div className="min-h-screen select-none w-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${pokedle})` }}>
        <div className="flex justify-center">
          <Link to={'/'}><button className="border-2 border-black/10 border-b-white/20 border-r-white/20 font-semibold rounded-md text-3xl  text-rose-500 text-shadow-rose-300 text-shadow-md px-10 py-2 m-5 backdrop-blur-[2px]">
            Go Back
          </button></Link>
          <button className="border-2 border-black/10 border-b-white/20 border-r-white/20 rounded-md text-3xl  text-rose-500 text-shadow-rose-300 text-shadow-md font-semibold px-10 py-2 m-5 backdrop-blur-[2px]" onClick={resetGame}>
            Reset
          </button>
        </div>

        <div className="flex justify-center">
          <h1 className="text-black text-shadow-2xs text-shadow-white/90  font-bold text-3xl my-5">Guess The Pokemon</h1>
        </div>

        <div className="flex justify-center items-center relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPokemon(pokemonSearch.toLowerCase());
              setPokemonSearch("");
            }}
            className="relative"
          >
            <input
              type="text"
              value={pokemonSearch}
              onChange={(e) => setPokemonSearch(e.target.value)}
              placeholder="Enter Pokemon Name"
              className="border-3 border-black/10 border-b-white/20 border-r-white/20 backdrop-blur-[2px] placeholder:text-white placeholder:text-2xl placeholder:text-center placeholder:font-bold px-3 py-5 rounded-md m-5 h-10 w-[300px] text-black bg-transparent"
              autoComplete="off"
            />
            {pokemonSearch && filteredSuggestions.length > 0 && (
              <ul className="absolute left-5 top-[55px] bg-black border rounded-md w-[300px] z-10 text-white max-h-[200px] overflow-y-auto">
                {filteredSuggestions.map(({ name }) => (
                  <li
                    key={name}
                    className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setPokemonSearch(name);
                      fetchPokemon(name);
                      setPokemonSearch("");
                    }}
                  >
                    {spriteCache[name] ? (
                      <img src={spriteCache[name]} alt={name} className="w-8 h-8" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200" />
                    )}
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
        <div>

          <div className="w-full flex justify-center">
            <div className="w-[1080px]">
              <div className="grid grid-cols-5 border-2 border-white/30 rounded-xl backdrop-blur-[3px]  gap-5 place-items-center">
                <div className="h-10 backdrop-blur-[5px] rounded-lg  flex items-center px-5 text-blue-700 text-shadow-blue-300 text-shadow-md   text-2xl my-3 border-2 border-transparent border-b-white  ">
                  Pokemon
                </div>
                <div className="h-10  backdrop-blur-[5px] rounded-lg flex items-center px-5 text-blue-700 text-shadow-blue-300 text-shadow-md  text-2xl my-3 border-3 border-transparent border-b-white   ">
                  Name
                </div>
                <div className="h-10 backdrop-blur-[5px] rounded-lg  flex items-center px-5 text-blue-700 text-shadow-blue-300 text-shadow-md   text-2xl my-3 border-3 border-transparent border-b-white ">
                  Generation
                </div>
                <div className="h-10 backdrop-blur-[5px] rounded-lg  flex items-center px-5 text-blue-700 text-shadow-blue-300 text-shadow-md   text-2xl my-3 border-3 border-transparent border-b-white ">
                  Type 1
                </div>
                <div className="h-10  backdrop-blur-[5px] rounded-lg flex items-center px-5 text-blue-700 text-shadow-blue-300 text-shadow-md  text-2xl my-3 border-3 border-transparent border-b-white   ">
                  Type 2
                </div>
              </div>
            </div>
          </div>

          {guessedList.length > 0 && (
            <>
              {guessedList.map((guessed, index) => {
                const {
                  nameMatch,
                  generationMatch,
                  type1Match,
                  type2Match,
                  type1WrongPosition,
                  type2WrongPosition,
                } = Matching(guessed);

                return (
                  <div key={index}>
                    <div className="w-full flex justify-center my-3">
                      <div className="w-[1080px]">
                        <div className="grid grid-cols-5 border-2 backdrop-blur-[2px] border-white/30 rounded-xl gap-5 place-items-center">
                          <div className="h-30 flex items-center ">
                            <img src={guessed.image} alt={guessed.name} />
                          </div>
                          <div
                            className={`h-10 flex items-center px-5 text-black text-[18px] my-3 border border-transparent rounded border-b-white font-mono tracking-wide ${
                              nameMatch ? "bg-green-300" : ""
                            }`}
                          >
                            {guessed.name}
                          </div>
                          <div
                            className={`h-10 flex items-center px-5 text-black font-mono tracking-wide text-[18px] my-3 border rounded border-transparent border-b-white ${
                              generationMatch ? "bg-green-300" : ""
                            }`}
                          >
                            {guessed.generation}
                          </div>
                          <div
                            className={`h-10 flex items-center px-5 text-black font-mono tracking-wide text-[18px] my-3 border rounded border-transparent border-b-white  ${
                              type1Match ? "bg-green-300" : type1WrongPosition ? "bg-yellow-200" : ""
                            }`}
                          >
                            {guessed.types[0]?.type?.name}
                          </div>
                          <div
                            className={`h-10 flex items-center px-5 text-black font-mono tracking-wide text-[18px] my-3 border rounded border-transparent border-b-white  ${
                              type2Match ? "bg-green-300" : type2WrongPosition ? "bg-yellow-200" : ""
                            }`}
                          >
                            {guessed.types[1]?.type?.name || "NONE"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Reveal target pokemon if guessed correctly */}
              {isCorrectlyGuessed && targetPokemon && targetPokemonSpecies && (
                <div className=" border-white/30 border-2 p-5 rounded-md  text-blue-300 text-shadow-blue-500 text-shadow-md text-center">
                  <h2 className="text-2xl font-bold mb-4">🎉 You guessed it!</h2>
                  <div className='flex w-full justify-center '>
                    <div className='flex W-[1080px] border-2 border-white/30  px-5 justify-center items-center gap-20 backdrop-blur-[3px] rounded-lg'>
                      <img
                        src={targetPokemon.sprites.front_default}
                        alt={targetPokemon.name}
                        className="mx-auto mb-2 h-30"
                      />
                      <p className="text-[18px] border-2 border-transparent border-b-white tracking-wide font-mono">{targetPokemon.name.toUpperCase()}</p>
                      <p className="text-[18px] border-2 border-transparent border-b-white tracking-wide font-mono">{targetPokemonSpecies.generation.name.toUpperCase()}</p>
                      <p className="text-[18px] border-2 border-transparent border-b-white tracking-wide font-mono">{targetPokemon.types[0]?.type.name.toUpperCase()}</p>
                      <p className="text-[18px] border-2 border-transparent border-b-white tracking-wide font-mono">{targetPokemon.types[1]?.type.name.toUpperCase() || "NONE"}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        </div>
    </>
  );
};

export default Pokemon;
