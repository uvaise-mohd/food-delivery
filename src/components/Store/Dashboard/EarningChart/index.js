import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class EarningChart extends Component {
	state = {
		series: [
			{
				name: "Earnings",
				data: [0, 0, 0, 0, 0, 0, 0],
			},
		],
		options: {
			chart: {
				height: 350,
				type: "bar",
				zoom: {
					enabled: false,
				},
				dropShadow: {
					enabled: false,
					top: 0,
					left: 0,
					blur: 3,
					opacity: 0.8,
				},
				toolbar: {
					show: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: "smooth",
				colors: ["#42a5f5"],
			},
			
			grid: {
				row: {
					colors: ["transparent"], // takes an array which will be repeated on columns
					opacity: 1,
				},
			},
			xaxis: {
				labels: {
					style: {
						colors: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: ["#000000", "#000000", "#000000", "#000000", "#000000", "#000000", "#000000"],
					},
				},
			},
			
		},
	};

	componentWillReceiveProps(nextProps) {
		const series = [{ name: "Earnings", data: nextProps.data.chartData }];
		this.setState({ series });
	}

	render() {
		return (
			<React.Fragment>
				<ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={350} />
			</React.Fragment>
		);
	}
}

export default EarningChart;
