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
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
