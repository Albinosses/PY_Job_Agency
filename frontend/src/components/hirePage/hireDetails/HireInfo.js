import React from "react";
import ContactInfo from "../../contact/ContactInfo";
import styles from "./HireInfo.module.css"
import {StyledParagraph} from "../../StyledComponents";

function HireInfo({hire}) {
    return (
        <>
            <div className={styles.container}>
                <ContactInfo contact={hire.employee} owner={"Hired Employee"}/>
            </div>
            <StyledParagraph>Hire Date: {hire.hireDate}</StyledParagraph>
        </>
    );
}

export default HireInfo;
