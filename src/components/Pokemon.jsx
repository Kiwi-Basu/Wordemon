import React, { useEffect, useState } from 'react'

const Pokemon = () => {
  const [pokemon,setPokemon ] = useState(null);
  const [pokemonSpecies,setPokemonSpecies ] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pokemonSearch, setPokemonSearch] = useState("");

  const POKEMON_URL = `${import.meta.env.VITE_POKE_API_KEY}${pokemonSearch}`
  const POKEMON_SPECIES_URL = `${import.meta.env.VITE_POKE_SPECIES_API_KEY}${pokemonSearch}`
  
  async function fetchPokemon(){
    setIsLoading(true)
    try {
      const pokeResponse = await fetch(POKEMON_URL)
      const PokeSpeciesResponse = await fetch(POKEMON_SPECIES_URL)
      const pokeResult = await pokeResponse.json()
      const pokeSpeciesResult = await PokeSpeciesResponse.json()

      if(pokeSpeciesResult.generation) {
        setPokemonSpecies(pokeSpeciesResult)
      }

      if(pokeResult.name) {
        setPokemon(pokeResult)
      }

    } catch (error) {
      console.error("Error fetching pokeom",error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
if(isLoading) {
  return(
    <div>
      <div className='h-5 w-5 bg-transparent m-5 rounded-full border-3 animate-rotating border-t-blue-500'>
      </div>
    </div>
  )
}
if (isError) {
    return (
      <div>
        <h1>Error loading the pokemon</h1>
      </div>
    )
  }

  return (
    <>
      <div className=' flex justify-center items-center '>
        <input type="text" name="pokemon" id="pokemon" className='border-2 rounded-full m-5 h-10 w-[300px] ' 
        onChange={(e) =>{setPokemonSearch(e.target.value)}} 
        onKeyDown={(e) => {if(e.key =='Enter'){fetchPokemon()}}}/>
      <p>{pokemonSearch}</p>
      </div>
      {pokemon && pokemonSpecies &&(
        
        <div className='grid grid-cols-5 border gap-5 place-items-center '>
          <div>Pokemon</div>
          <div>Name</div>
          <div>Type 1</div>
          <div>Type 2</div>
          <div>Generation</div>
          <div className='h-[125px] w-[125px] border'>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} className='h-full w-full'/>
          </div>
          <div className='h-[125px] w-[125px]  border flex justify-center items-center'>
            <h2>{pokemon.name.toUpperCase()}</h2>
          </div>
          <div className='h-[125px] w-[125px] border flex justify-center items-center'>
            <p>{pokemon.types[0]?.type.name} </p>
          </div>
          <div className='h-[125px] w-[125px] border flex justify-center items-center'>
            <p>{pokemon.types[1]?.type.name ||"None"}</p>
          </div>
          <div className='h-[125px] w-[125px] border flex justify-center items-center'>
            <p>{pokemonSpecies.generation.name}</p>
          </div>
      </div>
      )}

      {/*  
        <p>Type: {pokemon.types[0]?.type.name} ,{pokemon.types[1]?.type.name }</p>
        <p>Generation : {pokemonSpecies.generation.name}</p> */}
    </>
  

      
  )
}

export default Pokemon
