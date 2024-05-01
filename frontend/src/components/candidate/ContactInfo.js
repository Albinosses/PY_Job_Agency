import React from "react";
import styles from "./ContactInfo.module.css";

const ContactInfo = ({contact, owner}) => {
    const {name, surname, birthDate, gender, email} = contact;

    const getFullGender = (abr) => {
        switch (abr) {
            case 'F':
                return 'Female';
            case 'M':
                return 'Male';
            default:
                return '';
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{owner}</h2>
            <div className={styles.infoItem}>
                <span className={styles.label}>Name:</span>
                <span className={styles.info}>{name}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.label}>Surname:</span>
                <span className={styles.info}>{surname}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.label}>Birth Date:</span>
                <span className={styles.info}>{birthDate}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.label}>Gender:</span>
                <span className={styles.info}>{getFullGender(gender)}</span>
            </div>
            <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.info}>{email}</span>
            </div>
        </div>
    );
};

export default ContactInfo;
