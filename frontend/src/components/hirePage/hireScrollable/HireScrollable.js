import React, {useContext, useEffect, useState} from "react";
import Hire from "../hire/Hire";
import styles from "./HireScrollable.module.css";
import {HireContext} from "../../../contexts/HireContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import dayjs from "dayjs";

function HireScrollable({hiresObj, filterChanged}) {
    const {hires, setHires, setCurrentHire} = useContext(HireContext)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentHire(undefined)
        const savedHires = localStorage.getItem("hires");
        const parsedHires = JSON.parse(savedHires);

        let apiUrl = `http://127.0.0.1:8003/api/get/hires?page=${currentPage}`;

        if(!hiresObj || Object.keys(hiresObj).length === 0){
            if (parsedHires.date !== null) {
                apiUrl += `&hireDateFilter=${dayjs(parsedHires.date).add(1, 'day')}`;
            }
            if (localStorage.hires_sortOrder !== '') {
                apiUrl += `&sortType=${localStorage.hires_sortOrder}`;
            }
        }

        console.log(apiUrl)

        if(!hiresObj || Object.keys(hiresObj).length === 0){
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {setHires(data.hires)} )
                .catch(err => console.log(err))
        }
    }, [hiresObj, setHires, currentPage, setCurrentHire, filterChanged]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <>
            {( !hires || hires.length === 0) &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            {(hires || hiresObj) &&
                <div className={styles.container}>
                    <div className={styles.scrollableContainer}>
                        {hiresObj ? (
                            hiresObj
                                .map(hire => (
                                    <Link key={hire.id} to={`/hire/${hire.id}`} onClick={() => setCurrentHire(hire)}>
                                        <Hire
                                            key={hire.id}
                                            hire={hire}
                                        />
                                    </Link>
                                ))) : (
                            hires.map(hire => (
                                <Link key={hire.id} to={`/hire/${hire.id}`} onClick={() => setCurrentHire(hire)}>
                                    <Hire
                                        key={hire.id}
                                        hire={hire}
                                    />
                                </Link>
                            )))}
                        {(!hiresObj || Object.keys(hiresObj).length === 0) &&
                            <div className={styles.pagination}>
                                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <button onClick={handleNextPage}>Next</button>
                            </div>
                        }
                    </div>
                </div>
            }
        </>

    );
}

export default HireScrollable;