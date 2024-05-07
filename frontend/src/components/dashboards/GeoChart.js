import React, {useEffect, useState} from 'react';
import { Chart } from 'react-google-charts';

const GeoChartComponent = () => {
    const [Data, setData] = useState([])

    useEffect(() => {
        fetch("http://127.0.0.1:8003/api/get/graph_countries")
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map(entry => [entry.Country, entry.numberOfHires]);
                transformedData.unshift(['Country', 'NumberOfHires']);
                setData(transformedData)
            } )
            .catch(err => console.log(err))
    }, []);

    return (
        <Chart
            width={'100%'}
            height={'700px'}
            chartType="GeoChart"
            data={Data}
        />
    );
};

export default GeoChartComponent;