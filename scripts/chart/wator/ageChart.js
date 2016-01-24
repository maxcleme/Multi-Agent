AgeChart = function () {
  var categories = [];
  for (var i = 0; i < 50; i++) {
    categories[i] = i;
  }

  $("#charts").append('<div id="chart-age" class="col-md-12 margin-top-50"/>');
  var $ageChart = $('#chart-age').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Population pyramid of Shark and Fish'
    },
    xAxis: [{
      categories: categories,
      reversed: false,
      labels: {
        step: 5
      }
    }, { // mirror axis on right side
      opposite: true,
      reversed: false,
      categories: categories,
      linkedTo: 0,
      labels: {
        step: 5
      }
    }],
    yAxis: {
      title: {
        text: null
      },
      labels: {
        formatter: function () {
          return Math.abs(this.value);
        }
      },
      tickInterval: 20
    },

    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },

    tooltip: {
      formatter: function () {
        return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br>' +
          'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
      }
    },

    series: [{
      name: 'Shark'
    }, {
      name: 'Fish'
    }]
  });
  $ageChart = $ageChart.highcharts();
  return $ageChart;
}