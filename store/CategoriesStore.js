import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../services/Axios";

const CategoryContext = createContext();

function CategoryContextProvider({ children }) {

    const [listCategory, setListCategory] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (page === 1) return;

        getCategories(page);
    }, [page])

    const getCategories = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`foodcategory?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListCategory([...listCategory, ...data.data.results])
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                console.log(err.response);
            })
    }

    const refresh = () => {
        setListCategory([]);
        setPage(1)
    }

    return (
        <CategoryContext.Provider
            value={{
                listCategory,
                setListCategory,
                getCategories,
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
        </CategoryContext.Provider>
    )
}

export default CategoryContextProvider;
export { CategoryContext }