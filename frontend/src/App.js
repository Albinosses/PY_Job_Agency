import SidePanel from "./components/sidePanel/SidePanel";
import styles from './App.module.css';
import VacancyPage from "./components/vacancyPage/VacancyPage";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.App}>
                <div className={styles.sidePanel}>
                    <SidePanel/>
                </div>
                <div className={styles.content}>
                    <VacancyPage/>
                </div>
            </div>
        </LocalizationProvider>
    );
}

export default App;
