import React from "react";
import styles from "./SidePanel.module.css";
import vacanciesButton from "./imgs/vacanciesButton.png"
import hiresButton from "./imgs/hiresButton.png"
import interviewsButton from "./imgs/interviewsButton.png"
import mainButton from "./imgs/mainButton.png"
import {Link, useLocation} from "react-router-dom";

function SidePanel({onPageChange}) {
    const location = useLocation();
    const selectedItem = location.pathname.substring(1);

    return (
        <div className={styles.container}>
            <div className={styles.title}>HR System</div>
            <Link to="/">
                <div className={`${styles.section} ${selectedItem === '' ? styles.blue : ''}`}>
                    <div className={styles.content}>
                        <img
                            src={mainButton}
                            alt="Main"
                        />
                        <div>Main page</div>
                    </div>
                </div>
            </Link>
            <Link to="/vacancy">
                <div
                    className={`${styles.section} ${selectedItem === 'vacancy' ? styles.blue : ''}`}>
                    <div className={styles.content}>
                        <img
                            src={vacanciesButton}
                            alt="Vacancies"
                        />
                        <div>Vacancies</div>
                    </div>
                </div>
            </Link>
            <Link to="/interview">
                <div
                    className={`${styles.section} ${selectedItem === 'interview' ? styles.blue : ''}`}>
                    <div className={styles.content}>
                        <img
                            src={hiresButton}
                            alt="Interviews"
                        />
                        <div>Interviews</div>
                    </div>
                </div>
            </Link>
            <Link to="/hire">
                <div
                    className={`${styles.section} ${selectedItem === 'hire' ? styles.blue : ''}`}>
                    <div className={styles.content}>
                        <img
                            src={interviewsButton}
                            alt="Hires"
                        />
                        <div>Hires</div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default SidePanel;
