/**
 * Created by Quentin on 20/01/2015.
 */
$(document).ready(function () {

// On submit parameters
  $('#parameter-form').submit(function () {
    start(this);
    return false;
  });

// Initialize values
  $('input[type="range"]').each(function (index, element) {
    // Bind event
    $(element).bind("mousemove change", function () {
      updateValueFromSlider(this);
      updateProportion();
    });

    // Update value first time
    updateValueFromSlider(this);
    updateProportion();
  });

  $('input[type="number"]').each(function (index, element) {
    $(element).bind("click keyup change", function () {
      updateValueFromSpinner(this);
      updateProportion();
    });
  });

  function updateValueFromSpinner(element) {
    var name = element.getAttribute("id").replace("-value", "");
    $('input[id="' + name + '"]').each(function (index, value) {
      value.value = element.value;
    });
  }

  function updateValueFromSlider(element) {
    var name = element.getAttribute("id");
    $('input[id^="' + name + '-value"]').each(function (index, value) {
      value.value = element.value;
    });
  }

  function updateProportion() {
    var size = $('input[id="size"]').val();
    var empty = $('input[id="empty"]').val();
    var proportion = $('input[id="proportion"]').val();
    var totalCell = size * size;
    var remainingCells = Math.floor(totalCell * (100 - empty) / 100);
    var sharkCount = Math.floor(remainingCells * proportion / 100);
    var tunaCount = Math.floor(remainingCells * (100 - proportion) / 100);

    $('span[id="proportion-value1"]').html(sharkCount);
    $('span[id="proportion-value2"]').html(tunaCount);
  }

});