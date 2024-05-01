import React from "react";
import InterviewScrollable from "./interviewScrollable/InterviewScrollable";
import InterviewTitle from "./interviewTitle/InterviewTitle";
import SearchFilters from "./searchFilters/SearchFilters";

function InterviewPage() {
    return (
        <div className="flex flex-col w-full">
            <InterviewTitle/>
            <SearchFilters/>
            <InterviewScrollable/>
        </div>
    );
}

export default InterviewPage;
