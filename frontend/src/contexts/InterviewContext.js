import {createContext, useState} from "react";

export const InterviewContext = createContext({})


const mockInterviews = [
    {
        id: 1,
        vacancyId : 1,
        candidate : {
            name : "Oleg",
            surname : "Ivanchuk",
            birthDate : "2004-04-27",
            gender : "M",
            email : "example@gmail.com"
        },
        interviewer : {
            name : "Some",
            surname : "Interviewer",
            birthDate : "2000-05-22",
            gender : "F",
            email : "example44@gmail.com"
        },
        InterviewType : "S",
        InterviewDate : "2024-06-27",
        duration : 35,
        feedback : "Everything is cool",
        score : 8
    },
    {
        id : 2,
        vacancyId : 1,
        candidate : {
            name : "Para",
            surname : "Mud",
            birthDate : "2002-01-14",
            gender : "F",
            email : "example55@gmail.com"
        },
        interviewer : {
            name : "Second",
            surname : "Interview",
            birthDate : "1900-05-22",
            gender : "M",
            email : "example4466@gmail.com"
        },
        InterviewType : "H",
        InterviewDate : "2024-07-29",
        duration : 20,
        feedback : "Everything not so cool",
        score : 2
    }
];

export const InterviewProvider = ({ children }) => {
    const [interviews, setInterviews] = useState(mockInterviews);

    const updateInterview = (updatedInterview) => {
        setInterviews((prevInterviews) =>
            prevInterviews.map((interview) =>
                interview.id === updatedInterview.id ? updatedInterview : interview
            )
        );
    };

    return (
        <InterviewContext.Provider value={{ interviews, setInterviews, updateInterview }}>
            {children}
        </InterviewContext.Provider>
    );
};