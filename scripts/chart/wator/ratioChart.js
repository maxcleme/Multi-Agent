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
    plotOptions: {
      scatter: {
        marker: {
          radius: 2,
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
      color: 'rgba(0, 0, 0, .5)'
    }]
  });


  $rateChart = $rateChart.highcharts();

  return $rateChart;
}
