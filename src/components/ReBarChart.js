import React, {PureComponent} from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer
} from 'recharts';

export default class ReBarChart extends PureComponent {
    // static jsfiddleUrl = 'https://jsfiddle.net/alidingling/30763kr7/';

    render() {

        const {classes, chartData} = this.props;

        // console.log(chartData);

        return (
            <ResponsiveContainer width='100%'
                                 aspect={15.0/7.0}
            >
                <BarChart
                    barGap={4}
                    maxBarSize={40}
                    data={chartData}
                    margin={{
                        top: 5, right: 50, left: 50, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar name={"접속 수"} dataKey="access_cnt" fill="#8884d8"/>
                    {/*<Bar dataKey="uv" fill="#82ca9d" />*/}
                </BarChart>
            </ResponsiveContainer>
        );
    }
}
