import React from "react";
import styles from "./SidePanel.module.css";
import vacanciesButton from "./imgs/vacanciesButton.png"
import hiresButton from "./imgs/hiresButton.png"
import interviewsButton from "./imgs/interviewsButton.png"

function SidePanel() {
    return (
        <div className={styles.container}>
            <div className={styles.title}>HR System</div>
            <div className={`${styles.section} ${styles.blue}`}>
                <div className={styles.content}>
                    <img
                        src={vacanciesButton}
                        alt="Vacancies"
                    />
                    <div>Vacancies</div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.content}>
                    <img
                        src={hiresButton}
                        alt="Interviews"
                    />
                    <div>Interviews</div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.content}>
                    <img
                        src={interviewsButton}
                        alt="Hires"
                    />
                    <div>Hires</div>
                </div>
            </div>
        </div>
    );
}

export default SidePanel;
