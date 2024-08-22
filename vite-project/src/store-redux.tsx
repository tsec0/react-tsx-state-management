import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
    createSlice,
    configureStore,
    type PayloadAction
} from "@reduxjs/toolkit";

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

const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({ baseUrl:"/" }),
    endpoints: (builder) => ({
        getPokemon: builder.query<Pokemon[], undefined>({
            query: () => "pokemon.json",
        })
    })
});

export const usePokemonQuery = pokemonApi.endpoints.getPokemon.useQuery;

const searchSlice = createSlice({
    name: "search",
    initialState: {
        search: "",
    },
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        }
    },
});

export const { setSearch } = searchSlice.actions;

export const store = configureStore({
    reducer: {
        search: searchSlice.reducer,
        pokemonApi: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export const selectSearch = (state: RootState) => state.search.search;
