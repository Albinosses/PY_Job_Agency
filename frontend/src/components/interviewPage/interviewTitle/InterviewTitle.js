import React from "react";
import styles from "./InterviewTitle.module.css";
import community from "./imgs/community.png"
import add from "./imgs/add.png"

function InterviewTitle() {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <img
                            src={community}
                            className={`${styles.icon} aspect-square`}
                            alt="Interviews Icon"
                        />
                    </div>
                    <div className={styles.title}>Interviews</div>
                </div>
            </div>
            <div className={styles.createButton}>
                <img
                    src={add}
                    className={`${styles.icon} aspect-square`}
                    alt="Create Interview Icon"
                />
                <div>Create Interview</div>
            </div>
        </div>
    );
}

export default InterviewTitle;
