function buildMetadata(sample) {
  var url = "/metadata/" + sample ;
  console.log(url)
  // @TODO: Complete the following function that builds the metadata panel
   d3.json(url).then((data) => {
     console.log(data)
     var panel = d3.select("#sample-metadata");
     panel.html("");

     Object.entries(data).forEach(([key, value]) => {
      // Log the key and value
        var node = document.createElement('h6');
        var textnode = document.createTextNode(key +' : '+ value);
        node.appendChild(textnode);
        console.log(`Key: ${key} and Value ${value}`);
        document.getElementById("sample-metadata").appendChild(node)
    });

   });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {
  var url = "/samples/" + sample ;
  d3.json(url).then((sample_data) => {

    console.log(sample_data.sample_values)

    var trace = {
      type: "scatter",
      x : sample_data.otu_ids,
      y : sample_data.sample_values,
      text: sample_data.otu_labels,
      mode : 'markers',
      marker: {
        color : sample_data.otu_ids,
        size: sample_data.sample_values,
        colorscale: "Rainbow",
        // showscale: True
      }
    };

    var trace1 = [trace];

    var layout = {
      showlegend: false,
      height: 600,
      width:1200
    };

    Plotly.newPlot("bubble", trace1, layout);

    var data = [{
      values: sample_data.sample_values.slice(0, 10),
      labels: sample_data.otu_ids.slice(0, 10),
      hovertext: sample_data.otu_labels.slice(0, 10),
      type: 'pie',
    }];

  
    Plotly.newPlot('pie', data);

    });
  
};

function buildGauge(sample){
   var url = "/wfreq/" + sample;
  console.log(url);
  // @TODO: Complete the following function that builds the metadata panel
   d3.json(url).then((wfreq) => {
    var level = wfreq[0]*19;
    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    var data = [{ type: 'scatter',
    x: [0], y:[0],
        marker: {size: 12, color:'850000'},
        showlegend: false,
        name: 'Freq',
        text: level,
        hoverinfo: 'text+name'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {
        colors:[
            'rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
            'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
            'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
    }];
    var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
            color: '850000'
        }
        }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };
    // var GAUGE = document.getElementById('gauge');
    Plotly.newPlot('gauge', data, layout);

    });
   };

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample)
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
