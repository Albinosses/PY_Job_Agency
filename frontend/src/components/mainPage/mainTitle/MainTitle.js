import React from "react";
import styles from "./MainTitle.module.css";

function MainTitle() {
    return (
            <div className={styles.container}>
                <div className={styles.section}>
                    <div className={styles.header}>
                        <div className={styles.title}>Main Page</div>
                    </div>
                </div>
            </div>
    );
}

export default MainTitle;
