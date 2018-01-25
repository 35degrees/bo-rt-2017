function openCurtain(){
  document.getElementById("container1").classList.add("transform-active");
  
  document.getElementById("split").style.opacity = 0;
  document.getElementById("split").style.visibility = "hidden";
  document.getElementById("split").style.transition =
    "visibility 2100ms linear 2100ms, opacity 2100ms";
    document.getElementById("fadebutton").style.opacity = 0
  setTimeout(clearContainer1, 5100)
}
function clearContainer1(){
  
  document.getElementById("split").remove();
  document.getElementById("container1").remove();
  document.getElementById("container2").style.position = "relative";
}

function bubbleChart() {
  // Constants for sizing
  var width = 1160;
  var height = 750;

  var tooltip = floatingTooltip('gates_tooltip', 120);

  // Locations to move bubbles towards, depending
  // on which view mode is selected.
  var center = { x: width / 2, y: 325 };

  var yearCenters = {
    5: { x: 332, y: 100 },
    4: { x: 478, y: 100 },
    3: { x: 608, y: 80 },
    2: { x: 720, y: 70 },
    1: { x: 825, y: 200 }
  };

  var yearsTitleX = {
   '81-100%': 245,
    '61-80%': 522,
    '41-60%': 695,
    '21-40%': 845,
    '0-20%': 960
  };

  var studioCenters = {
    1: { x: 325, y: 0 },
    2: { x: 420, y: 0 },
    3: { x: 490, y: 0 },
    4: { x: 575, y: 0 },
    5: { x: 645, y: 0 },
    6: { x: 725, y: 0 },
  7: { x: 798, y: 0 },
  8: { x: 865, y: 0 }
  };

  var studioTitleX = {
   'Disney': 200,
    'WB': 375,
    'Universal': 500,
    'Sony': 635,
    'Paramount': 725,
    'Fox': 810,
    'Lionsgate': 925,
    'Ind.': 1046
  };
  var forceStrength = 0.03;

  var legendLinear = d3.legendColor()
   .shapeWidth(15)
 	.shapeHeight(15)
   .cells(11)
   .orient('vertical')
   .scale(fillColor);

  // These will be set in create_nodes and create_vis
  var svg = null;
  var bubbles = null;
  var nodes = [];

  function charge(d) {
    return -Math.pow(d.radius, 2.0) * forceStrength;
  }

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  simulation.stop();

var fillColor = d3.scaleOrdinal()
    .domain(['Disney','Warner Bros.','Universal','Sony','Paramount','Fox','Lionsgate','Independent']
           )   .range(['FireBrick','SteelBlue','Orange','Cyan ','YellowGreen  ','PowderBlue','Plum','Yellow']);



  function createNodes(rawData) {
    var maxAmount = d3.max(rawData, function (d) { return +d.BO; });
    var radiusScale = d3.scalePow()
      .exponent(0.6)
      .range([1, 79])
      .domain([0, maxAmount]);
    var myNodes = rawData.map(function (d) {
      return {
        id: d.Rank,
        name: d.Title,
        radius: radiusScale(+d.BO),
        value: +d.BO,
        year: d.Tag,
        org: d.Studio,
        studioid: d.ID,
        group: d.Cat,
        open: d.Open,
        close: d.Close,
        score: d.RT,
        ow: d.Op,
        pct: ((d.Op/d.BO)*100).toFixed(1),
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });

    myNodes.sort(function (a, b) { return b.value - a.value; });
    return myNodes;
  }


  var chart = function chart(selector, rawData) {
    nodes = createNodes(rawData);


    svg = d3.select(selector)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class','centerme');
      svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(400,400)");

    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });


    var bubblesE = bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('class','shadow')
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.group); })
      .attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
      .attr('stroke-width', 1.5)
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles = bubbles.merge(bubblesE);

    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    simulation.nodes(nodes);


    groupBubbles();
  };


  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }


  function nodeYearPos(d) {
    return yearCenters[d.year].x;
  }
function nodeStudioPos(d) {
    return studioCenters[d.studioid].x;
  }


  function groupBubbles() {
    hideYearTitles();
    hideStudioTitles();


    simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));


    simulation.alpha(1).restart();
  }



  function splitBubblesa() {
    showYearTitles();
    hideStudioTitles();


    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeYearPos));
    simulation.alpha(1).restart();
  }

  function splitBubblesb() {
    hideYearTitles();
    showStudioTitles();

    simulation.force('x', d3.forceX().strength(forceStrength).x(nodeStudioPos));

    simulation.alpha(1).restart();
  }


  function hideYearTitles() {
    svg.selectAll('.year').remove();
  }
  function hideStudioTitles() {
    svg.selectAll('.studios').remove();
  }

  function showYearTitles() {
    var yearsData = d3.keys(yearsTitleX);
    var years = svg.selectAll('.year')
      .data(yearsData);

    years.enter().append('text')
      .attr('class', 'year')
      .attr('x', function (d) { return yearsTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
    	.style('font-family', 'Lato')
    .style('font-size','23px')
    	.style('fill','SteelBlue')
      .text(function (d) { return d; });
  }
  function showStudioTitles() {
    var studioData = d3.keys(studioTitleX);
    var studios = svg.selectAll('.studios')
      .data(studioData);

    studios.enter().append('text')
      .attr('class', 'studios')
      .attr('x', function (d) { return studioTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
    	.style('font-family', 'Lato')
    .style('font-size','18px')
    	.style('fill','SteelBlue')
      .text(function (d) { return d; });
  }



  function showDetail(d) {
    d3.select(this).attr('stroke-width',4);

    var content = '<span class="title">' + d.name +
                  '</span><br/>' + '<span class="name">Studio: ' + d.org +
                  '</span><br/>' +
                  '<span class="name">Box Office: </span><span class="value">$' +
                  addCommas(d.value) +
                  '</span><br/>' + '<span class="name">Open Date: </span><span class="value">' + d.open+
                  '</span>,  ' + '<span class="name">Close Date: </span><span class="value">' + d.close +
                  '</span><br/>' +
                  '<span class="name">Rotten Tomatoes Score: </span><span class="value">' +
                  d.score +
                  '%</span>';

    tooltip.showTooltip(content, d3.event);
  }


  function hideDetail(d) {

    d3.select(this)
      .attr('stroke-width',2);

    tooltip.hideTooltip();
  }


  chart.toggleDisplay = function (displayName) {
    if (displayName === 'year') {
      splitBubblesa();
    } else if (displayName === 'studiob') {
    	splitBubblesb();
      } else {
      groupBubbles();
    }
  };


  // return the chart function from closure.
  return chart;
}

/*
 * Below is the initialization code as well as some helper functions
 * to create a new bubble chart instance, load the data, and display it.
 */

var myBubbleChart = bubbleChart();

/*
 * Function called once data is loaded from CSV.
 * Calls bubble chart function to display inside #vis div.
 */
function display(error, data) {
  if (error) {
    console.log(error);
  }

  myBubbleChart('#vis', data);
}

/*
 * Sets up the layout buttons to allow for toggling between view modes.
 */
function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button2')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button2').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}


function addCommas(nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }

  return x1 + x2;
}

d3.csv('bo0118.csv', display);

setupButtons();
function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  var tt = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', tooltipId)
    .style('pointer-events', 'none');

  // Set a width if it is provided.
  if (width) {
    tt.style('width', width);
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */
  function showTooltip(content, event) {
    tt.style('opacity', 0.8)
      .html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style('opacity', 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse event.
   */
  function updatePosition(event) {
    var xOffset = -5;
    var yOffset = 5;

    var ttw = tt.style('width');
    var tth = tt.style('height');

    var wscrY = window.scrollY;
    var wscrX = window.scrollX;

    var curX = (document.all) ? event.clientX + wscrX : event.pageX;
    var curY = (document.all) ? event.clientY + wscrY : event.pageY;
    var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                 curX - ttw - xOffset * 2 : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                curY - tth - yOffset * 2 : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }

    tt
      .style('top', tttop + 'px')
      .style('left', ttleft + 'px');
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}