import React, {useState} from "react";
import styles from "./SidePanel.module.css";
import vacanciesButton from "./imgs/vacanciesButton.png"
import hiresButton from "./imgs/hiresButton.png"
import interviewsButton from "./imgs/interviewsButton.png"
import mainButton from "./imgs/mainButton.png"
import {Link, useLocation} from "react-router-dom";

function SidePanel({onPageChange}) {
    const location = useLocation();
    const selectedItem = location.pathname.substring(1);

    const [dashboardsMenuIsOpen, setDashboardsMenuIsOpen] = useState(false)

    const handleOpenDashboardMenu = () => {
        setDashboardsMenuIsOpen(!dashboardsMenuIsOpen)
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>HR System</div>
            <Link to="/main">
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
            <Link to="/export">
                <div
                    className={`${styles.section} ${selectedItem === 'export' ? styles.blue : ''}`}>
                    <div className={styles.content}>
                        <div>Export</div>
                    </div>
                </div>
            </Link>
                <div className={styles.section}>
                    <div className={styles.content}
                        onClick={handleOpenDashboardMenu}
                    >
                        {/*<img src={submenuButton} alt="Submenu" />*/}
                        <div>Dashboards</div>
                    </div>
                </div>
            { dashboardsMenuIsOpen  && (
                <div className={styles.submenu}>
                    <Link to="/dashboard/vacancy">
                        <div
                            className={`${styles.section} ${selectedItem.endsWith('dashboard/vacancy') ? styles.blue : ''}`}
                        >
                            <div
                                className={styles.submenuItem}>
                                Vacancies
                            </div>
                        </div>
                    </Link>
                    <Link to="/dashboard/hire">
                        <div
                            className={`${styles.section} ${selectedItem.endsWith('dashboard/hire') ? styles.blue : ''}`}
                        >
                            <div className={styles.submenuItem}>
                                Hires
                            </div>
                        </div>
                    </Link>
                    <Link to="/dashboard/interview">
                        <div
                            className={`${styles.section} ${selectedItem.endsWith('dashboard/interview') ? styles.blue : ''}`}
                        >
                            <div className={styles.submenuItem}>
                                Interviews
                            </div>
                        </div>
                    </Link>
                    <Link to="/dashboard/graph">
                        <div
                            className={`${styles.section} ${selectedItem.endsWith('dashboard/graph') ? styles.blue : ''}`}
                        >
                            <div className={styles.submenuItem}>
                                Graphs
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default SidePanel;
