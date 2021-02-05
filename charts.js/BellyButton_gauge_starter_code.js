function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var sample_values = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var filterData = sample_values.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filterMetadata = data.metadata.filter(metadataObj => metadataObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var firstSample = filterData[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata = filterMetadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels =firstSample.otu_labels;
    var sample_values =firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var frequency = parseFloat(metadata.wfreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks =otuIds.map(ids => (`OTU ${ids}`)).slice(0,10).reverse();
    
    // Create the trace for the bar chart. 
    var trace = {

        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otuLabels,
        colour: "blue",
        type: "bar",
        orientation: "h"

      };
      var barData = [trace];

    // Create the layout for the bar chart. 
     var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
   
  
    // Create the trace for the bubble chart.
    var trace2 = {
        x: otuIds,
        y: sample_values,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sample_values,
          colorscale: 'YlGnBu',
          color: otuIds
        
        }
      };
    
    var bubbleData = [trace2];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 100}
    };


    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
    //4. Create the trace for the gauge chart.
    var trace3 = {
        
          domain: { x: [0, 1], y: [0, 1] },
          value: frequency,
          title: { text: "<b>Belly Button Washing Frequency</b>" },
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 10] },
          bar: {color: "black"},
          steps: [
           {range: [0, 2], color: "red"},
           {range: [2, 4], color: "darkorange"},
           {range: [4, 6], color: "yellow"},
           {range: [6, 8], color: "limegreen"},
           {range: [8, 10], color: "forestgreen"},
       ]}
     
      };
    
    var gaugeData=[trace3]
      
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 400, margin: { t: 0, b: 0 }
     };

    //6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  
}