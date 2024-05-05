import React from "react";
import MainTitle from "./mainTitle/MainTitle";
import MainContent from "./mainContent/MainContent";
import Graphs from "../dashboards/Graphs";

function MainPage() {
    return (
        <div className="flex flex-col w-full">
            <MainTitle/>
            <MainContent/>
        </div>
    );
}

export default MainPage;
