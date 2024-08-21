import { useContext } from 'react'
import { PokemonContext } from './store';

export function usePokemon(){
    return useContext(PokemonContext)!;
}