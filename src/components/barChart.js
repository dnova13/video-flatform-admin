import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis
} from "@devexpress/dx-react-chart-material-ui";

import { Animation } from "@devexpress/dx-react-chart";

export default class BarChart extends React.PureComponent {

   /* constructor(props) {
        super(props);

        this.state = {
            data
        };
    }*/

    render() {
        const {classes, chartData} = this.props;

        // console.log(chartData)
        // console.log(chartData.data)

        return (
            <Paper>
                <Chart data={chartData.data}
                       height={250}
                >
                    <ArgumentAxis />
                    <ValueAxis max={15} />

                    <BarSeries
                        valueField="access_cnt"
                        argumentField="date"
                    />
                    <Title text={chartData.title} />
                    <Animation />

                </Chart>
            </Paper>
        );
    }
}
