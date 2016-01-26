CurveChart = function () {
  $("#charts").append('<div id="chart-curves" class="col-md-12 margin-top-50"/>');



  var $curveChart = $("#chart-curves").highcharts({
    chart: {
      type: 'spline',
      animation: false,
      marginRight: 10
    },
    title: {
      text: 'Shark and Fish by Time'
    },
    xAxis: {
      title: {
        enabled: true,
        text: 'Time ( count )'
      },
      startOnTick: true,
      endOnTick: true,
      showLastLabel: true,
      min: 0
    },
    yAxis: {
      title: {
        text: 'Population'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }],
      min: 0
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{id: 'shark', name: 'shark', color: '#F08080'}, {id: 'fish', name: 'fish', color: '#1E90FF'}]
  });

  $curveChart = $curveChart.highcharts();
  return $curveChart;
}
