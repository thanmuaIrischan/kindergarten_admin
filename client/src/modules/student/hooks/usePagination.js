import { useState, useCallback } from 'react';

export const SORT_OPTIONS = {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc'
};

const usePagination = (initialPageSize = 10) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(initialPageSize);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);

    const handlePageChange = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    const handleSortChange = useCallback((newSortOption) => {
        setSortBy(newSortOption);
    }, []);

    const resetPage = useCallback(() => {
        setPage(0);
    }, []);

    const getPaginatedData = useCallback((data) => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return data.slice(start, end);
    }, [page, rowsPerPage]);

    return {
        page,
        rowsPerPage,
        sortBy,
        SORT_OPTIONS,
        handlePageChange,
        handleRowsPerPageChange,
        handleSortChange,
        resetPage,
        getPaginatedData
    };
};

export default usePagination; 