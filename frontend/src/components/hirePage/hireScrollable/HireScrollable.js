import React from "react";
import Hire from "../hire/Hire";
import styles from "./HireScrollable.module.css";

function HireScrollable() {
    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                {[...Array(20)].map((_, index) => (
                    <Hire key={index} />
                ))}
            </div>
        </div>
    );
}

export default HireScrollable;