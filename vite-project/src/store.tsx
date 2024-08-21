import { useQuery } from '@tanstack/react-query';

import {
  createContext,
  useReducer, 
  useCallback,
  useMemo, // to calculate existing values or used for serching
} from 'react';

interface Pokemon {
  id: number,
  name: string,
  type: string[],
  hp: number,
  attack: number,
  defense: number,
  special_attack: number,
  special_defense: number,
  speed: number
}

function usePokemonSource(): {
  pokemon: Pokemon[];
  search: string;
  setSearch: (search: string) => void;
} {
  const { data: pokemon } = useQuery<Pokemon[]>({
    queryKey: ["pokemon"], 
    queryFn: () => fetch("/pokemon.json").then((res) => res.json(),),
    initialData: [],
  });

  type PokemonState = {
    search: string;
  }

  type PokemonAction = {
    type: "setSearch";
    payload: string
  };

  const [{ search }, dispatch] = useReducer(((state: PokemonState, action: PokemonAction) => {
    switch(action.type){
      case "setSearch":
        return { ...state, search: action.payload}
    }
  }),{
    search: "",
  })

  // when returning defined function a useCallback should be implemented 
  const setSearch = useCallback((search: string) => {
    dispatch({
      type: "setSearch",
      payload: search,
    });
  }, []); // dependancy array is empty because there are no dependancies

  const filteredPokemon = useMemo(
    () => pokemon.filter((p) => p.name.toLowerCase().includes(search)),
    [pokemon, search]).slice(0, 20); 
  // the dependancy array should be with dependancies: search, pokemon

  const sortedPokemon = useMemo(() => 
    [...filteredPokemon].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredPokemon]);

  return { pokemon: sortedPokemon, search, setSearch };
}

// wraps components with the contexts info
// should use a hook to not use directly the context
export const PokemonContext = createContext<
    ReturnType<typeof usePokemonSource>>(
      {} as unknown as ReturnType<typeof usePokemonSource>
    );

export function PokemonProvider({
    children,
} : {
    children: React.ReactNode;
}) {
    return(
        <PokemonContext.Provider value={usePokemonSource()}>
            {children}
        </PokemonContext.Provider>
    )
}
