import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";

class EarningChartLight extends Component {
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
				type: "line",
				zoom: {
					enabled: false,
				},
				dropShadow: {
					enabled: true,
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
				colors: ["#9D0B0B"],
			},
			title: {
				text: "Delivery Earnings",
				align: "left",
				style: {
					color: "black",
				},
			},
			grid: {
				row: {
					colors: ["#ffffff", "transparent"], // takes an array which will be repeated on columns
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
			test: {
				name: "saurabh",
				age: "27",
			},
		},
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.data) {
			const series = [{ name: "Earnings", data: nextProps.data.chartData }];
			this.setState({ series });
		}
	}

	render() {
		return (
			<React.Fragment>
				<ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
			</React.Fragment>
		);
	}
}

export default EarningChartLight;
