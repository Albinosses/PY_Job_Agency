import React, {useContext} from "react";
import Hire from "../hire/Hire";
import styles from "./HireScrollable.module.css";
import {HireContext} from "../../../contexts/HireContext";
import {Link} from "react-router-dom";

function HireScrollable({vacancyId}) {
    const {hires} = useContext(HireContext)

    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                {vacancyId ? (
                    hires
                        .filter(hire => hire.vacancyId === vacancyId)
                        .map(hire => (
                            <Link to={`/hire/${hire.id}`}>
                                <Hire
                                    key={hire.id}
                                    vacancy={hire}
                                />
                            </Link>
                        ))) : (
                    hires.map(hire => (
                        <Link to={`/hire/${hire.id}`}>
                            <Hire
                                key={hire.id}
                                vacancy={hire}
                            />
                        </Link>
                    )))}
            </div>
        </div>
    );
}

export default HireScrollable;