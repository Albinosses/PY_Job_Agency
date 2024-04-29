import React, {useState} from "react";
import styles from "./SidePanel.module.css";
import vacanciesButton from "./imgs/vacanciesButton.png"
import hiresButton from "./imgs/hiresButton.png"
import interviewsButton from "./imgs/interviewsButton.png"
import mainButton from "./imgs/mainButton.png"
import {Link} from "react-router-dom";

function SidePanel({ onPageChange }) {
    const [selectedItem, setSelectedItem] = useState('main');
    const handleClick = (page) => {
        onPageChange(page);
        setSelectedItem(page);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>HR System</div>
            <Link to="/" >
                <div
                    className={`${styles.section} ${selectedItem === 'main' ? styles.blue : ''}`}
                    onClick={() => handleClick('main')}
                >
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
                    className={`${styles.section} ${selectedItem === 'vacancy' ? styles.blue : ''}`}
                    onClick={() => handleClick('vacancy')}
                >
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
                    className={`${styles.section} ${selectedItem === 'interview' ? styles.blue : ''}`}
                    onClick={() => handleClick('interview')}
                >
                    <div className={styles.content} onClick={() => handleClick('interview')}>
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
                    className={`${styles.section} ${selectedItem === 'hire' ? styles.blue : ''}`}
                    onClick={() => handleClick('hire')}
                >
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
