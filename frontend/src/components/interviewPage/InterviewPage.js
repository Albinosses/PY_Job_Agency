import React, {useState} from "react";
import InterviewScrollable from "./interviewScrollable/InterviewScrollable";
import InterviewTitle from "./interviewTitle/InterviewTitle";
import SearchFilters from "./searchFilters/SearchFilters";

function InterviewPage() {
    const [filterChanged, setFilterChanged] = useState(false);

    return (
        <div className="flex flex-col w-full">
            <InterviewTitle/>
            <SearchFilters setFilterChanged={setFilterChanged}/>
            <InterviewScrollable filterChanged={filterChanged}/>
        </div>
    );
}

export default InterviewPage;
