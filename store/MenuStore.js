import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../services/Axios";

const MenuContext = createContext();

function MenuContextProvider({ children }) {

    const [listMenu, setListMenu] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (page === 1) return;

        getMenu(page);
    }, [page])

    const getMenu = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`menu?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListMenu([...listMenu, ...data.data.results])
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }

    const refresh = () => {
        setListMenu([]);
        setPage(1)
    }

    return (
        <MenuContext.Provider
            value={{
                listMenu,
                setListMenu,
                getMenu,
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
        </MenuContext.Provider>
    )
}

export default MenuContextProvider;
export { MenuContext }