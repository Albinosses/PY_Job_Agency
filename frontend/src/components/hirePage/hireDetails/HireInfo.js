import React, {useEffect, useState} from "react";
import ContactInfo from "../../contact/ContactInfo";
import styles from "./HireInfo.module.css"
import {StyledParagraph} from "../../StyledComponents";
import dayjs from "dayjs";

function HireInfo({hire, employeeContactId}) {

    const [employeeContact, setEmployeeContact] = useState()

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/contact?id=${employeeContactId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setEmployeeContact(data)
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            { employeeContact &&
                <>
                    <div className={styles.container}>
                        <ContactInfo contact={employeeContact} owner={"Hired Employee"}/>
                    </div>
                    <StyledParagraph>Hire Date: {dayjs(hire.hireDate).format('YYYY-MM-DD')}</StyledParagraph>
                </>
            }
        </>
    );
}

export default HireInfo;
