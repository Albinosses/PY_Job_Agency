import React, {useEffect} from "react";
import MainTitle from "./mainTitle/MainTitle";
import MainContent from "./mainContent/MainContent";
import Graphs from "../dashboards/Graphs";

function MainPage({setIsLoggedIn}) {

    useEffect(() => {
        setIsLoggedIn(true)
    }, []);

    return (
        <div className="flex flex-col w-full">
            <MainTitle/>
            <MainContent/>
        </div>
    );
}

export default MainPage;
