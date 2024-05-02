import React, {useEffect, useState} from "react";
import styles from "./ContactInfo.module.css";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import dayjs from "dayjs";

const ContactInfoEdit = ({type, owner, contact, setContact}) => {

    const [gender, setGender] = useState(contact?.gender || "")
    const [birthDate, setBirthDate] = useState(contact?.birthDate || "")

    useEffect(() => {
        if (type === 'edit') {
            setGender(contact.gender);
            setBirthDate(contact.birthDate);
        }
    }, [type, contact.gender, contact.birthDate]);

    const handleGenderChange = (e) => {
        setGender(e.target.value)
        setContact({...contact, gender: e.target.value})
    }

    const handleBirthDateChange = (date) => {
        setBirthDate(date)
        setContact({...contact, birthDate: date.format('YYYY-MM-DD')})
    }

    return (
        <div className={styles.editContactContainer}>
            <h2 className={styles.title}>{owner}</h2>
            <div className={styles.inputItem}>
                <TextField
                    sx={{width: 300}}
                    id="outlined-basic"
                    onChange={(e) => setContact({...contact, name: e.target.value})}
                    variant="outlined"
                    label="Name"
                    value={contact.name}
                />
            </div>
            <div className={styles.inputItem}>
                <TextField
                    sx={{width: 300}}
                    id="outlined-basic"
                    onChange={(e) => setContact({...contact, surname: e.target.value})}
                    variant="outlined"
                    label="Surname"
                    value={contact.surname}
                />
            </div>
            <div className={styles.inputItem}>
                <DatePicker
                    sx={{width: 300}}
                    label="Birth date"
                    onChange={handleBirthDateChange}
                    value={dayjs(birthDate)}
                />
            </div>
            <div className={styles.inputItem}>
                <FormControl sx={{width: 300}}>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        autoWidth
                        labelId="gender-select-label"
                        id="gender-select"
                        label="Gender"
                        value={gender}
                        onChange={handleGenderChange}
                    >
                        <MenuItem sx={{width: 300}} value={'M'}>Male</MenuItem>
                        <MenuItem sx={{width: 300}} value={'F'}>Female</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={styles.inputItem}>
                <TextField
                    sx={{width: 300}}
                    type="email"
                    id="outlined-basic"
                    onChange={(e) => setContact({...contact, email: e.target.value})}
                    variant="outlined"
                    label="Email"
                    value={contact.email}
                />
            </div>
        </div>
    );
};

export default ContactInfoEdit;
