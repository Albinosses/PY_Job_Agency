import React, {useEffect, useState} from "react";
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS} from 'chart.js/auto'
import GeoChart from "./GeoChart";


const VacanciesChart = () => {
    const [granularity, setGranularity] = useState('yearly')
    const [selectedYear, setSelectedYear] = useState(null);
    const [Data, SetData] = useState([])
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
    }, [granularity, selectedYear, Data]);

    useEffect(() => {
        fetch("http://127.0.0.1:8003/api/get/graph")
            .then(response => response.json())
            .then(data => {
                data.sort((a, b) => a.year - b.year);
                data.forEach(item => {
                    item.monthlyVacancies.sort((a, b) => a.month - b.month);
                });
                SetData(data)
            } )
            .catch(err => console.log(err))
    }, []);

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