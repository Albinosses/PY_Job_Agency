import React, {useEffect, useState} from "react";
import ContactInfo from "../../contact/ContactInfo";
import styles from "./HireInfo.module.css"
import {StyledParagraph} from "../../StyledComponents";

function HireInfo({hire}) {

    // const [employee, setEmployee] = useState()
    //
    // useEffect(() => {
    //     fetch(`http://127.0.0.1:8003/api/get/contact?id=${employee.employeeContactId}`)
    //         .then(response => response.json())
    //         .then(data => setCandidate(data))
    //         .catch(err => console.log(err));
    // }, []);

    return (
        <>
            {/*<div className={styles.container}>*/}
            {/*    <ContactInfo contact={hire.employee} owner={"Hired Employee"}/>*/}
            {/*</div>*/}
            <StyledParagraph>Hire Date: {hire.hireDate}</StyledParagraph>
        </>
    );
}

export default HireInfo;
