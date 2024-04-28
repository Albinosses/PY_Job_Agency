import SidePanel from "./components/sidePanel/SidePanel";
import styles from './App.module.css';
import VacancyPage from "./components/vacancyPage/VacancyPage";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useState} from "react";
import InterviewPage from "./components/interviewPage/InterviewPage";
import HirePage from "./components/hirePage/HirePage";
import MainPage from "./components/mainPage/MainPage";

function App() {
    const [activePage, setActivePage] = useState('main');

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
                    {activePage === 'main' && <MainPage />}
                    {activePage === 'vacancy' && <VacancyPage/>}
                    {activePage === 'interview' && <InterviewPage/>}
                    {activePage === 'hire' && <HirePage/>}
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default App;
