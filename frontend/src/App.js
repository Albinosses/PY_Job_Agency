import SidePanel from "./components/sidePanel/SidePanel";
import styles from './App.module.css';
import VacancyPage from "./components/vacancyPage/VacancyPage";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useState} from "react";

function App() {
    const [activePage, setActivePage] = useState('vacancy');

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.App}>
                <div className={styles.sidePanel}>
                    <SidePanel onPageChange={handlePageChange} />
                </div>
                <div className={styles.content}>
                    {activePage === 'vacancy' && <VacancyPage/>}
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default App;
