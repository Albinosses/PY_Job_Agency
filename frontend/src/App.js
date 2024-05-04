import SidePanel from "./components/sidePanel/SidePanel";
import styles from './App.module.css';
import VacancyPage from "./components/vacancyPage/VacancyPage";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import InterviewPage from "./components/interviewPage/InterviewPage";
import HirePage from "./components/hirePage/HirePage";
import MainPage from "./components/mainPage/MainPage";
import {Route, Routes} from "react-router-dom";
import VacancyDetails from "./components/vacancyPage/vacancyDetails/VacancyDetails";
import {VacancyProvider} from "./contexts/VacancyContext";
import {InterviewProvider} from "./contexts/InterviewContext";
import InterviewDetails from "./components/interviewPage/interviewDetails/InterviewDetails";
import {HireProvider} from "./contexts/HireContext";
import HireDetails from "./components/hirePage/hireDetails/HireDetails";
import VacancyDashboard from "./components/dashboards/VacancyDashboard";
import InterviewDashboard from "./components/dashboards/InterviewDashboard";
import HireDashboard from "./components/dashboards/HireDashboard";
import {GeneralContextProvider} from "./contexts/GeneralContext";

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.App}>
                <div className={styles.sidePanel}>
                    <SidePanel/>
                </div>
                <div className={styles.content}>
                    <GeneralContextProvider>
                        <InterviewProvider>
                            <HireProvider>
                                <VacancyProvider>
                                    <Routes>
                                        <Route path="/" element={<MainPage/>}/>
                                        <Route path="/interview" element={<InterviewPage/>}/>
                                        <Route path="/interview/:id" element={<InterviewDetails/>}/>
                                        <Route path="/hire" element={<HirePage/>}/>
                                        <Route path="/hire/:id" element={<HireDetails/>}/>
                                        <Route path="/vacancy" element={<VacancyPage/>}/>
                                        <Route path="/vacancy/:id" element={<VacancyDetails/>}/>
                                        <Route path="/dashboard/vacancy" element={<VacancyDashboard/>}/>
                                        <Route path="/dashboard/interview" element={<InterviewDashboard/>}/>
                                        <Route path="/dashboard/hire" element={<HireDashboard/>}/>
                                    </Routes>
                                </VacancyProvider>
                            </HireProvider>
                        </InterviewProvider>
                    </GeneralContextProvider>
                </div>
            </div>
        </LocalizationProvider>

    );
}

export default App;
