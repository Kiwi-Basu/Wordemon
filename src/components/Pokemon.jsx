import React, { useEffect, useState } from 'react';

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
      <div className="flex justify-center">
        <Link to={'/'}><button className="border-2 border-white font-bold rounded-md text-white px-4 m-5">
          Go Back
        </button></Link>
        <button className="border-2 border-white font-bold rounded-md text-white px-4 m-5" onClick={resetGame}>
          Reset
        </button>
      </div>

      <div className="flex justify-center">
        <h1 className="text-white font-bold text-3xl my-5">Guess The Pokemon</h1>
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
            className="border-2 placeholder:text-white placeholder:text-center px-3 rounded-md border-white m-5 h-10 w-[300px] text-white bg-transparent"
            autoComplete="off"
          />
          {pokemonSearch && filteredSuggestions.length > 0 && (
            <ul className="absolute left-5 top-[55px] bg-white border rounded-md w-[300px] z-10 text-black max-h-[200px] overflow-y-auto">
              {filteredSuggestions.map(({ name }) => (
                <li
                  key={name}
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setPokemonSearch(name);
                    fetchPokemon(name);
                    setPokemonSearch(""); // clear input after selection
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

      <div className="w-full flex justify-center">
        <div className="w-[1080px]">
          <div className="grid grid-cols-5 border gap-5 place-items-center">
            <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
              Pokemon
            </div>
            <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
              Name
            </div>
            <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
              Generation
            </div>
            <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
              Type 1
            </div>
            <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
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
                <div className="w-full flex justify-center">
                  <div className="w-[1080px]">
                    <div className="grid grid-cols-5 border gap-5 place-items-center">
                      <div className="h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold">
                        <img src={guessed.image} alt={guessed.name} />
                      </div>
                      <div
                        className={`h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold ${
                          nameMatch ? "bg-green-500" : ""
                        }`}
                      >
                        {guessed.name}
                      </div>
                      <div
                        className={`h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold ${
                          generationMatch ? "bg-green-500" : ""
                        }`}
                      >
                        {guessed.generation}
                      </div>
                      <div
                        className={`h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold ${
                          type1Match ? "bg-green-500" : type1WrongPosition ? "bg-yellow-500" : ""
                        }`}
                      >
                        {guessed.types[0]?.type?.name}
                      </div>
                      <div
                        className={`h-10 flex items-center px-5 text-white text-2xl my-3 border border-transparent border-b-white font-bold ${
                          type2Match ? "bg-green-500" : type2WrongPosition ? "bg-yellow-500" : ""
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
            <div className="flex justify-center mt-10">
              <div className="border border-white p-5 rounded-md bg-gray-800 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">🎉 You guessed it!</h2>
                <img
                  src={targetPokemon.sprites.front_default}
                  alt={targetPokemon.name}
                  className="mx-auto mb-2 h-[125px] w-[125px]"
                />
                <p className="text-xl font-semibold">{targetPokemon.name.toUpperCase()}</p>
                <p>Generation: {targetPokemonSpecies.generation.name.toUpperCase()}</p>
                <p>Type 1: {targetPokemon.types[0]?.type.name.toUpperCase()}</p>
                <p>Type 2: {targetPokemon.types[1]?.type.name.toUpperCase() || "NONE"}</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* You can add loading and error UI if you want */}
      {isLoading && (
        <div className="flex justify-center mt-4 text-white font-bold">Loading...</div>
      )}

      {isError && (
        <div className="flex justify-center mt-4 text-red-500 font-bold">
          Error fetching Pokémon. Try again.
        </div>
      )}
    </>
  );
};

export default Pokemon;
