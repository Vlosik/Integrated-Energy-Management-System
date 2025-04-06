import React, { Component } from "react";
import "./UserCharts.css";
import Calendar from "react-calendar";
import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from "recharts";
import "react-calendar/dist/Calendar.css";
import axiosMicroService from "../../axiosMicroService";
import {Link} from "react-router-dom";

class UserCharts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDate: null,
            chartData: null,
            lineChartData: null,
            token: localStorage.getItem("token"),
            deviceId: localStorage.getItem("deviceId"),
        };
    }

    handleDateChange = (date) => {
        this.setState({ selectedDate: date }, this.fetchChartData);
    };

    fetchChartData = () => {
        const { selectedDate, deviceId } = this.state;
        if (!selectedDate) return;
        selectedDate.setDate(selectedDate.getDate() + 1);
        const formattedDate = selectedDate.toISOString();
        console.log(selectedDate);
        console.log(formattedDate);
        const payload = {
            day: formattedDate,
            deviceId,
        };
        console.log(payload);
        axiosMicroService
            .post("measurements/getDatas", payload,{
                headers: {
                    Authorization: `Bearer ${this.state.token}`,
                },
            })
            .then((response) => {
                console.log(response);
                const responseData = response.data;
                if (responseData && responseData.length > 0) {
                    this.processChartData(responseData);
                } else {
                    this.setState({ chartData: null, lineChartData: null });
                }
            })
            .catch((error) => {
                console.error("Error fetching chart data:", error);
                this.setState({ chartData: null, lineChartData: null });
            });
    };

    processChartData = (data) => {
        this.setState({chartData: data, lineChartData: data});
    };

    handleBackClick = () => {
         this.setState({ selectedDate: null });
    };

    render() {
        const { selectedDate, chartData, lineChartData } = this.state;

        return (
            <div className="device-charts">
                <div className="left-panel">
                    <h2>Select a Date</h2>
                    <Calendar className="react-calendar" onChange={this.handleDateChange} maxDate={new Date()} />
                    <Link to="/client" className="btn-link">Back</Link>
                </div>
                <div className="right-panel">
                    {selectedDate ? (
                        <div className="charts">
                            {chartData && chartData.length > 0 ? (
                                <>
                                    {/* Bar Chart */}
                                    <div className="bar-chart">
                                        <h3>Hourly Consumption (Bar Chart)</h3>
                                        <ResponsiveContainer width={800} height={250}>
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="data"/>
                                                <YAxis/>
                                                <Tooltip/>
                                                <Bar dataKey="consumption" fill="#8884d8"/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <hr/>
                                    <div className="line-chart">
                                        <h3>Consumption Trends (Line Chart)</h3>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="data"
                                                       label={{value: "Hour", position: "insideBottom", dy: 10, style: { fill: 'white' }}}/>
                                                <YAxis label={{value: "kWh", angle: -90, position: "insideLeft", style: { fill: 'white' }}}/>
                                                <Tooltip/>
                                                <Line type="monotone" dataKey="consumption" stroke="#8884d8"/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            ) : (
                                <div className="no-data">
                                    <p>No data available for the selected date.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-charts">
                            <p>Please select a date from the calendar to view data.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default UserCharts;
