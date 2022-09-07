Chart.register(ChartDataLabels);
// Chart.defaults.font.size = 16;

const fontColor = "black"
const fontSize = 20
const anchor = "end"
const weight = "bold"

let statisticChart

function tryDestroyChart() {
    let chartStatus = Chart.getChart("chart");
    // if (chartStatus !== undefined) {
    //     console.log("exist")
    //     chartStatus?.destroy()
    // }
}


function setStatisticChart(labels, dataConsumed, dataIncome) {

    let statisticsChartCtx

    if (statisticChart === undefined) {
        statisticsChartCtx = document.getElementById("chart").getContext("2d");
        statisticChart = new Chart(statisticsChartCtx, getUserConfig(labels, dataConsumed, dataIncome))
    } else {
        // statisticChart.data = {}
        statisticChart.destroy()

        document.getElementById("chartContainer").innerHTML = '<canvas id="chart"></canvas>';
        
        statisticsChartCtx = document.getElementById("chart").getContext("2d");
        // statisticChart.clear()
        // statisticChart.data = updateData(labels, dataConsumed, dataIncome)
        // statisticChart.update()
        statisticChart = new Chart(statisticsChartCtx, getUserConfig(labels, dataConsumed, dataIncome))
    }
}

function getUserConfig(labels, dataConsumed, dataIncome) {
    return {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Consumed",
                    data: dataConsumed,
                    datalabels: {
                        color: fontColor,
                        font: {
                            size: fontSize,
                            weight: weight
                        },
                        anchor: anchor
                    }
                },
                {
                    label: "Income",
                    data: dataIncome,
                    backgroundColor: "green",
                    datalabels: {
                        color: fontColor,
                        font: {
                            size: fontSize,
                            weight: weight
                        },
                        anchor: anchor
                    }
                },
            ],

            options: {},
        }
    };
}

function updateData(labels, dataConsumed, dataIncome) {
    return {
        labels: labels,
        datasets: [
            {
                label: "Consumed",
                data: dataConsumed,
                datalabels: {
                    color: fontColor,
                    font: {
                        size: fontSize,
                        weight: weight
                    },
                    anchor: anchor
                }
            },
            {
                label: "Income",
                data: dataIncome,
                backgroundColor: "green",
                datalabels: {
                    color: fontColor,
                    font: {
                        size: fontSize,
                        weight: weight
                    },
                    anchor: anchor
                }
            },
        ],

        options: {},
    }

}




