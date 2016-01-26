RatioChart = function () {
  $("#charts").append('<div id="chart-rate" class="col-md-12 margin-top-50"/>');

  var $rateChart = $('#chart-rate').highcharts({
    chart: {
      type: 'scatter',
      animation: false
    },
    title: {
      text: 'Number of shark by number of Fish'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Shark'
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
      min: 0
    },
    yAxis: {
      title: {
        text: 'Fish'
      },
      min: 0
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'top',
      x: 100,
      y: 70,
      floating: true,
      backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
      borderWidth: 1
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 5,
          states: {
            hover: {
              enabled: true,
              lineColor: 'rgb(100,100,100)'
            }
          }
        },
        states: {
          hover: {
            marker: {
              enabled: false
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{series.name}</b><br>',
          pointFormat: '{point.x} shark, {point.y} tuna'
        }
      }
    },
    series: [{
      name: 'Shark/Tuna',
      color: 'rgba(0, 0, 0, .5)'
    }]
  });


  $rateChart = $rateChart.highcharts();

  return $rateChart;
}
