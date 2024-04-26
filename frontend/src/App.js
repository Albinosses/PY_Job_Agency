import './App.css';
import Vacancy from "./components/vacancyPage/vacancy/Vacancy";
import SidePanel from "./components/sidePanel/SidePanel";
import VacancyTitle from "./components/vacancyPage/vacancyTitle/VacancyTitle";

function App() {
  return (
    <div className="App">
        <SidePanel />
        <VacancyTitle />
        <Vacancy />
    </div>
  );
}

export default App;
