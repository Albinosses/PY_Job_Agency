import React, {useState} from "react";
import styles from "./VacancyTitle.module.css";
import community from "./imgs/community.png"
import add from "./imgs/add.png"
import VacancyAddModal from "../vacancyAddModal/VacancyAddModal";

function VacancyTitle() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <img
                            src={community}
                            className={`${styles.icon} aspect-square`}
                            alt="Vacancies Icon"
                        />
                    </div>
                    <div className={styles.title}>Vacancies</div>
                </div>
            </div>
            <div className={styles.createButton} onClick={handleOpen}>
                <img
                    src={add}
                    className={`${styles.icon} aspect-square`}
                    alt="Create Vacancy Icon"
                />
                <div>Create Vacancy</div>
            </div>
            {open &&
                <VacancyAddModal
                    open={open}
                    setOpen={setOpen}
                    modalType={'create'}
                />
            }
        </div>
    );
}

export default VacancyTitle;
