import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../services/Axios";

const IngredientContext = createContext();

function IngredientContextProvider({ children }) {

    const [listIngredients, setListIngredients] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (page === 1) return;

        getIngredients(page);
    }, [page])

    const getIngredients = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`foodingredient?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListIngredients([...listIngredients, ...data.data.results])
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }

    const refresh = () => {
        setListIngredients([]);
        setPage(1)
    }

    return (
        <IngredientContext.Provider
            value={{
                listIngredients,
                setListIngredients,
                getIngredients,
                isLoading,
                setIsLoading,
                page,
                setPage,
                perPage,
                setPerPage,
                totalPages,
                setTotalPages,
                refresh
            }}
        >
            {children}
        </IngredientContext.Provider>
    )
}

export default IngredientContextProvider;
export { IngredientContext }