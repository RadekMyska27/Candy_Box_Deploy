const statisticsChartCtx = document.getElementById("chart").getContext("2d");
Chart.register(ChartDataLabels);
// Chart.defaults.font.size = 16;

const fontColor = "black"
const fontSize = 20
const anchor = "end"
const weight = "bold"

function setStatisticChart(labels, dataConsumed, dataIncome) {

    window.statisticChart = new Chart(statisticsChartCtx, {
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
    })
}




