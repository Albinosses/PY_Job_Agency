import React from "react";
import styles from "./HireTitle.module.css";
import community from "./imgs/community.png"
import add from "./imgs/add.png"

function HireTitle() {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <img
                            src={community}
                            className={`${styles.icon} aspect-square`}
                            alt="Hires Icon"
                        />
                    </div>
                    <div className={styles.title}>Hires</div>
                </div>
            </div>
            <div className={styles.createButton}>
                <img
                    src={add}
                    className={`${styles.icon} aspect-square`}
                    alt="Create Hire Icon"
                />
                <div>Create Hire</div>
            </div>
        </div>
    );
}

export default HireTitle;
