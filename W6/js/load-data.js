// Load and process the data
d3.csv("data/Ex6_TVdata.csv").then(data => {
    // Process the data to convert strings to numbers
    const processedData = data.map(d => ({
        brand: d.brand,
        model: d.model,
        screenSize: +d.screenSize, 
        screenTech: d.screenTech, 
        energyConsumption: +d.energyConsumption, 
        star: +d.star 
    }));
    
    // Save to global state
    globalData = processedData;
    
    // Populate filter buttons on initial loading
    populateFilters();
    
    // Trigger initial calculation (it will grab default active states)
    updateHistogram();

}).catch(err => {
    console.error("Error loading data:", err);
    d3.select("#chart-container")
        .append("p")
        .style("color", "red")
        .text("Error loading data. Please check the console.");
});
