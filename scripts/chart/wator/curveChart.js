CurveChart = function () {
  $("#charts").append('<div id="chart-curves" class="col-md-12 margin-top-50"/>');

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  var initData = function () {
    var data = [],
      time = (new Date()).getTime(),
      i;
    for (i = -19; i <= 0; i += 1) {
      data.push({
        x: time + i * 1000,
        y: 0
      });
    }
    return data;
  }

  var $curveChart = $("#chart-curves").highcharts({
    chart: {
      type: 'spline',
      animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10
    },
    title: {
      text: 'Shark and Fish by Time'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150
    },
    yAxis: {
      title: {
        text: 'Value'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + '</b><br>' +
          Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br>' +
          Highcharts.numberFormat(this.y, 2);
      }
    },
    legend: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    series: [{id: 'shark', name: 'shark', data: initData(), color: '#000000'}, {id: 'fish', name: 'fish', data: initData(), color: '#1E90FF'}]
  });

  $curveChart = $curveChart.highcharts();
  return $curveChart;
}
