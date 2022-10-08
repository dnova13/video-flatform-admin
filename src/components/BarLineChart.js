import React, {PureComponent} from 'react';
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer,
} from 'recharts';

export default class Example extends PureComponent {

    render() {

        const {classes, chartData} = this.props;

        return (
            <ResponsiveContainer width='100%'
                                 aspect={15.0 / 7.0}
            >
                <ComposedChart
                    barGap={5}
                    data={chartData}
                    // barCategoryGap={"20%"}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5"/>
                    <XAxis dataKey="name"
                           padding={{
                               left:50, right:50
                           }}
                    />
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="access_cnt" maxBarSize={50} fill="#413ea0" name={"접속 수"}/>
                    <Line type="monotone"
                          dataKey="access_cnt"
                          activeDot={"renderDot"}
                          stroke="#ff7300"
                          name={"접속 수"}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}

