import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';

const Shilloute = () => {

  const [targetPokemon, setTargetPokemon] = useState();
  const [guessPokemon, setGuessPokemon] = useState();
  const [searchPokemon, setSearchPokemon] = useState();
  const [correctGuess, setCorrectGuess] = useState();

  const TargetPokemon = async () => {
  const id = Math.floor(Math.random() * 1024) + 1

    try {
      const target_Pokemon_Response = await fetch( `${import.meta.env.VITE_POKE_API_KEY}${id}` )
      const target_Pokemon_Result = await target_Pokemon_Response.json()
      setTargetPokemon(target_Pokemon_Result)
    } catch (error) {
      console.log("Error",error)
    }
  }

  const GuessPokemon = async () => {
    try {
      const guess_Pokemon_Response = await fetch (`${import.meta.env.VITE_POKE_API_KEY}${searchPokemon}`)
      const guess_Pokemon_Result = await guess_Pokemon_Response.json()
      setGuessPokemon(guess_Pokemon_Result)

      if(guess_Pokemon_Result.name == targetPokemon.name){
        setCorrectGuess(true)
      }
      else{
        setCorrectGuess(false)
      }
      
    } catch (error) {
      
    }
  }


  useEffect(() => {
    TargetPokemon()
  }, []);
  return (
    <div>
       <div className="flex justify-center">
        <Link to='/'><button className="border-2 border-white font-bold rounded-md text-white px-4 m-5">
          Go Back
        </button></Link>
        <button className="border-2 border-white font-bold rounded-md text-white px-4 m-5" >
          Reset
        </button>
      </div>

      <div className="flex justify-center">
        <h1 className="text-white font-bold text-3xl my-5">Guess The Pokemon</h1>
      </div>
      {targetPokemon &&(
        <>
          <div>
            <img src={targetPokemon.sprites.front_default} alt={targetPokemon.name} className={`h-[300px] w-[300px] border ${correctGuess ? "" : 'brightness-0'} `} />
          </div>
          <div className='font-bold text-8xl'>
            {targetPokemon.name}
          </div>
        </>
      )}

      <div>
        <form action="">
          <input type="text" className='border' disabled={correctGuess} onChange={(e) => {setSearchPokemon(e.target.value)}} 
          onKeyDown={(e) => {if (e.key =="Enter"){
            e.preventDefault()
            GuessPokemon()
            setSearchPokemon('')
          }}}
          />
        </form>
        {guessPokemon && (
          <>
            <div>
              <img src={guessPokemon.sprites.front_default} alt="" />
              {guessPokemon.name}
            </div>
            <div>
              {correctGuess && (
                <>
                  <div>
                    correct guess babygirl
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default Shilloute
