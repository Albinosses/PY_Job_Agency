import React from "react";
import Interview from "../interview/Interview";
import styles from "./InterviewScrollable.module.css";

function InterviewScrollable() {
    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                {[...Array(20)].map((_, index) => (
                    <Interview key={index} />
                ))}
            </div>
        </div>
    );
}

export default InterviewScrollable;