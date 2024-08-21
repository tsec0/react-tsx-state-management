import { 
  useEffect,
  createContext, 
  useContext, 
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
  pokemon: Pokemon[] | null;
  search: string;
  setSearch: (search: string) => void;
} {
  // const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  // const [search, setSearch ] = useState("");

  type PokemonState = {
    pokemon: Pokemon[];
    search: string;
  }

  type PokemonAction = {
    type: "setPokemon";
    payload: Pokemon[]
  } |  {
    type: "setSearch";
    payload: string
  };

  const [{ pokemon, search }, dispatch] = useReducer(((state: PokemonState, action: PokemonAction) => {
    switch(action.type){
      case "setPokemon":
        return { ...state, pokemon: action.payload}
        case "setSearch":
          return { ...state, search: action.payload}
    }
  }),{
    pokemon: [],
    search: "",

  })

  // geting the pokemon only once
  // should be used on mount or rebound
  useEffect(() => {
    fetch("/pokemon.json")
    .then((response) => response.json())
    .then((data) => dispatch({
      type: "setPokemon",
      payload: data,
    }))
  }, []);

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
const PokemonContext = createContext<
    ReturnType<typeof usePokemonSource>>(
      {} as unknown as ReturnType<typeof usePokemonSource>
    );

export function usePokemon(){
  return useContext(PokemonContext)!;
}

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
