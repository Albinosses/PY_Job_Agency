import {createContext, useState} from "react";

export const InterviewContext = createContext({})

export const InterviewProvider = ({children}) => {
    const [interviews, setInterviews] = useState([]);
    const [currentInterview, setCurrentInterview] = useState()

    const updateInterview = (updatedInterview) => {
        setInterviews((prevInterviews) =>
            prevInterviews.map((interview) =>
                interview.id === updatedInterview.id ? updatedInterview : interview
            )
        );
    };

    const deleteInterview = (id) => {
        setInterviews((prevInterviews) =>
            prevInterviews.filter((interview) => interview.id !== id)
        );
    }

    return (
        <InterviewContext.Provider value={{interviews, setInterviews, updateInterview, deleteInterview, currentInterview, setCurrentInterview}}>
            {children}
        </InterviewContext.Provider>
    );
};