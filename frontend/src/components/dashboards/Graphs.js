import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import GeoChart from "./GeoChart";

// const Data = [
//     {
//         year: 2021,
//         numberOfVacancies: 1200,
//         monthlyVacancies:[
//             {
//                 month: 1,
//                 numberOfVacancies: 200
//             },
//             {
//                 month: 2,
//                 numberOfVacancies: 400
//             }
//         ]
//     }
// ]


const generateRandomNumber = () => Math.floor(Math.random() * 1000) + 200; // Generates a random number between 200 and 1200

const generateMonthlyData = () => {
    const monthlyVacancies = [];
    for (let i = 1; i <= 12; i++) {
        monthlyVacancies.push({
            month: i,
            numberOfVacancies: generateRandomNumber()
        });
    }
    return monthlyVacancies;
};

const Data = [
    {
        year: 2021,
        numberOfVacancies: 1200,
        monthlyVacancies: generateMonthlyData()
    },
    {
        year: 2022,
        numberOfVacancies: 1200,
        monthlyVacancies: generateMonthlyData()
    },
    {
        year: 2023,
        numberOfVacancies: 1200,
        monthlyVacancies: generateMonthlyData()
    },
    {
        year: 2024,
        numberOfVacancies: 1200,
        monthlyVacancies: generateMonthlyData()
    }
];

const VacanciesChart = () => {
    const [granularity, setGranularity] = useState('yearly')
    const [selectedYear, setSelectedYear] = useState(null);
    const [userData, setUserData] = useState({
        labels: [],
        datasets: [{
            label: "Number of new Vacancies",
            data: []
        }]
    });

    useEffect(() => {
        const filteredData = selectedYear ? Data.filter(data => data.year === selectedYear) : Data;
        const newData = {
            labels: filteredData.flatMap(data => {
                return granularity === 'yearly' ? [data.year] : data.monthlyVacancies.map(month => `${month.month}/${data.year}`);
            }),
            datasets: [{
                label: "Number of new Vacancies",
                data: filteredData.flatMap(data => {
                    return granularity === 'yearly' ? [data.numberOfVacancies] : data.monthlyVacancies.map(month => month.numberOfVacancies);
                })
            }]
        };
        setUserData(newData);
    }, [granularity, selectedYear]);

    const handleGranularityChange = (event) => {
        setGranularity(event.target.value);
        setSelectedYear(null);
    };

    const handleYearChange = (event) => {
        const year = event.target.value === "all" ? null : parseInt(event.target.value);
        setSelectedYear(year);
    };

    return (
        <div>
            <select value={granularity} onChange={handleGranularityChange} style={{ padding: '10px', fontSize: '16px' , margin: '5px'}}>
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
            </select>
            {granularity === 'monthly' && (
                <select value={selectedYear ? selectedYear : "all"} onChange={handleYearChange} style={{ padding: '10px', fontSize: '16px', margin: '5px' }}>
                    <option value="all">All Years</option>
                    {Data.map(data => (
                        <option key={data.year} value={data.year}>{data.year}</option>
                    ))}
                </select>
            )}
            <Bar data={userData}/>
            <GeoChart />
        </div>
    )
}

export default VacanciesChart