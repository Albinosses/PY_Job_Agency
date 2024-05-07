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
import Graphs from "./components/dashboards/Graphs";
import LoginPage from "./components/login/LoginPage";
import Export from "./components/export/Export";

function App() {

    return (
        <GeneralContextProvider>
            <InterviewProvider>
                <HireProvider>
                    <VacancyProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className={styles.App}>
                                {localStorage.isAuthenticated === "true" && (
                                    <div className={styles.sidePanel}>
                                        <SidePanel/>
                                    </div>
                                )}
                                <div className={styles.content}>
                                <Routes>
                                        <Route path="/" element={<LoginPage/>}/>
                                        <Route path="/main" element={<MainPage/>}/>
                                        <Route path="/interview" element={<InterviewPage/>}/>
                                        <Route path="/interview/:id" element={<InterviewDetails/>}/>
                                        <Route path="/hire" element={<HirePage/>}/>
                                        <Route path="/hire/:id" element={<HireDetails/>}/>
                                        <Route path="/vacancy" element={<VacancyPage/>}/>
                                        <Route path="/vacancy/:id" element={<VacancyDetails/>}/>
                                        <Route path="/dashboard/vacancy" element={<VacancyDashboard/>}/>
                                        <Route path="/dashboard/interview" element={<InterviewDashboard/>}/>
                                        <Route path="/dashboard/hire" element={<HireDashboard/>}/>
                                        <Route path="/dashboard/graph" element={<Graphs/>}/>
                                        <Route path="/export" element={<Export/>}/>
                                    </Routes>
                                </div>
                            </div>
                        </LocalizationProvider>
                    </VacancyProvider>
                </HireProvider>
            </InterviewProvider>
        </GeneralContextProvider>
    );
}

export default App;
