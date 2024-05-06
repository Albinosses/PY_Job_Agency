import React from 'react';
import { Chart } from 'react-google-charts';

const GeoChartComponent = () => {

    // const dataExample = [
    //     {
    //         Country: "SomeCountry",
    //         numberOfHires: 123
    //     }
    // ]

    const data = [
        ['Country', 'NumberOfHires'],
        ['China', 1409517397],
        ['India', 1339180127],
        ['United States', 324459463],
        ['Indonesia', 263991379],
        ['Pakistan', 207906209],
        // Add more data as needed
    ];

    return (
        <Chart
            width={'100%'}
            height={'700px'}
            chartType="GeoChart"
            data={data}
        />
    );
};

export default GeoChartComponent;