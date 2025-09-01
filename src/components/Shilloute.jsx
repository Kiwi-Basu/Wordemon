import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import shilloute from '../assets/Shilloute.png'

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
      setGuessPokemon(null)
      setSearchPokemon("")
      setCorrectGuess(false)
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
    <div className="min-h-screen w-full bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${shilloute})` }}>
      <div className="flex justify-center">
        <Link to={'/'}><button className="border-2 border-black/10 border-b-white/20 border-r-white/20 font-semibold rounded-md text-3xl  text-rose-500 text-shadow-rose-300 text-shadow-md px-10 py-2 m-5 backdrop-blur-[2px]">
          Go Back
        </button></Link>
        <button className="border-2 border-black/10 border-b-white/20 border-r-white/20 rounded-md text-3xl  text-rose-500 text-shadow-rose-300 text-shadow-md font-semibold px-10 py-2 m-5 backdrop-blur-[2px]" onClick={TargetPokemon }>
          Reset
        </button>
      </div>
 
      <div className="flex justify-center">
        <h1 className="text-blue-400 text-shadow-2xs text-shadow-white/90  font-bold text-3xl my-5">Guess The Pokemon</h1>
      </div>
      {targetPokemon &&(
        <>
          <div className= 'w-full flex justify-center '>
            <div className='backdrop-blur-[5px] border border-black/10 border-b-white/50 border-r-white/50 rounded-lg'>
              <img width={300} height={300}  src={targetPokemon.sprites.front_default}  className={` ${correctGuess ? ' ' : 'brightness-0 '} `} />
            </div>
          </div>
        </>
      )}

      <div className='flex flex-col my-5 items-center'> 
        {guessPokemon &&correctGuess && (
          <>
            <div className='text-[#000000] text-shadow-md text-shadow-white text-4xl tracking-tight font-mono font-bold '>
              You have Guessed Correctly
            </div>
          </>
        )}
        <form action="">
          <input type="text" placeholder='Enter the pokemon name' className='border placeholder:text-xl placeholder:text-black/30 backdrop-blur-[5px] mt-5 rounded-lg px-2 text-white text-3xl  h-[50px] w-[300px]' disabled={correctGuess} onChange={(e) => {setSearchPokemon(e.target.value)}} 
          value={searchPokemon}
          onKeyDown={(e) => {if (e.key =="Enter"){
            e.preventDefault()
            GuessPokemon()
            setSearchPokemon('')
          }}}
          />
        </form>
        
      </div>

    </div>
  )
}

export default Shilloute
