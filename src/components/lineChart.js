import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    Legend,
} from '@devexpress/dx-react-chart-material-ui';
import {withStyles} from '@material-ui/core/styles';
import {Animation, ValueScale} from '@devexpress/dx-react-chart';



const format = () => tick => tick;
const legendStyles = () => ({
    root: {
        display: 'flex',
        margin: 'auto',
        flexDirection: 'row',
    },
});

const legendLabelStyles = theme => ({
    label: {
        paddingTop: theme.spacing(1),
        whiteSpace: 'nowrap',
    },
});
const legendItemStyles = () => ({
    item: {
        flexDirection: 'column',
    },
});

const legendRootBase = ({classes, ...restProps}) => (
    <Legend.Root {...restProps} className={classes.root}/>
);
const legendLabelBase = ({classes, ...restProps}) => (
    <Legend.Label className={classes.label} {...restProps} />
);
const legendItemBase = ({classes, ...restProps}) => (
    <Legend.Item className={classes.item} {...restProps} />
);

const Root = withStyles(legendStyles, {name: 'LegendRoot'})(legendRootBase);
const Label = withStyles(legendLabelStyles, {name: 'LegendLabel'})(legendLabelBase);
const Item = withStyles(legendItemStyles, {name: 'LegendItem'})(legendItemBase);



const lineChartStyles = () => ({
    chart: {
        paddingRight: '20px',
    },
    title: {
        whiteSpace: 'pre',
    },
});


const ValueLabel = (props) => {
    const {text} = props;

    return (
        <ValueAxis.Label
            {...props}
            text={`${text}`}
        />
    );
};

const titleStyles = {
    title: {
        whiteSpace: 'pre',
    },
};

const TitleText = withStyles(titleStyles)(({classes, ...props}) => (
    <Title.Text {...props} className={classes.title}/>
));


class LineChart extends React.PureComponent {

    render() {
        const {classes, chartData} = this.props;

        // console.log(classes.chart);

        return (
            <Paper>
                <Chart
                    data={chartData.data}
                    className={classes.chart}
                    height={250}
                >
                    <ArgumentAxis />
                    <ValueScale />
                    <ValueAxis
                        max={50}
                        labelComponent={ValueLabel}
                    />

                    <LineSeries
                        name="join"
                        valueField="join_cnt"
                        argumentField="date"
                    />
                    {/*<Legend position="bottom" rootComponent={Root} itemComponent={Item} labelComponent={Label}/>*/}
                    <Title
                        text={chartData.title}
                        textComponent={TitleText}
                    />
                    <Animation
                    />
                </Chart>
            </Paper>
        );
    }
}

export default withStyles(lineChartStyles, {name: 'lineChart'})(LineChart);
