import React, {createContext, useContext, useState} from "react"

const SearchContext = createContext()

export const useSearch = () => useContext(SearchContext) 

export const SearchProvider = ({children}) => {
    const [query, setQuery] = useState("")
    const [year, setYear] = useState("")
    const [movies, setMovies] = useState([])

    return (
        <SearchContext.Provider value={{ query, setQuery, year, setYear, movies, setMovies }}>
            {children}
        </SearchContext.Provider>
    );
}