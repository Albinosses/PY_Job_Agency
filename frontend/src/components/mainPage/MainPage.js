import React from "react";
import MainTitle from "./mainTitle/MainTitle";
import MainContent from "./mainContent/MainContent";

function MainPage() {
    return (
        <div className="flex flex-col w-full">
            <MainTitle />
            <MainContent />
        </div>
    );
}

export default MainPage;
