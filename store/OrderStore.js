import React, { createContext, useState, useEffect, useRef } from "react";
import api from "../services/Axios";

const OrderContext = createContext();

function OrderContextProvider({ children }) {

    const [listOrder, setListOrder] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (page === 1) return;

        getOrder(page);
    }, [page])

    const getOrder = (pageParam) => {
        if (isLoading) return;
        setIsLoading(true)
        api.get(`order?page=${pageParam}&pageSize=${perPage}`)
            .then(data => {
                setTotalPages(data.data.pageCount);
                setListOrder([...listOrder, ...data.data.results])
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
            })
    }

    const refresh = () => {
        setListOrder([]);
        setPage(1)
    }

    return (
        <OrderContext.Provider
            value={{
                listOrder,
                setListOrder,
                getOrder,
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
        </OrderContext.Provider>
    )
}

export default OrderContextProvider;
export { OrderContext }