function populateFilters() {
    // 1. Populate Screen Tech Filters
    const techDiv = d3.select("#filters_screen").html("");
    
    const techButtons = techDiv.selectAll("button")
        .data(filters_screen)
        .enter()
        .append("button")
        .attr("class", d => d.isActive ? "filter-btn active" : "filter-btn")
        .text(d => d.label)
        .on("click", function(event, d) {
            filters_screen.forEach(f => f.isActive = false);
            d.isActive = true;
            techButtons.attr("class", f => f.isActive ? "filter-btn active" : "filter-btn");
            updateHistogram();
        });

    // 2. Populate Screen Size Filters
    const sizeDiv = d3.select("#filters_size").html("");
    
    const sizeButtons = sizeDiv.selectAll("button")
        .data(filters_size)
        .enter()
        .append("button")
        .attr("class", d => d.isActive ? "filter-btn active" : "filter-btn")
        .text(d => d.label)
        .on("click", function(event, d) {
            filters_size.forEach(f => f.isActive = false);
            d.isActive = true;
            sizeButtons.attr("class", f => f.isActive ? "filter-btn active" : "filter-btn");
            updateHistogram();
        });
}

function updateHistogram() {
    // Determine the active tech filter ID
    const activeTech = filters_screen.find(f => f.isActive).id;
    // Determine the active size filter ID
    const activeSize = filters_size.find(f => f.isActive).id;

    let filteredData = globalData;
    
    // Filter by Screen Tech (if not "all")
    if (activeTech !== "all") {
        filteredData = filteredData.filter(d => d.screenTech === activeTech);
    }

    // Filter by Screen Size (if not "all")
    if (activeSize !== "all") {
        filteredData = filteredData.filter(d => d.screenSize === +activeSize);
    }

    // Update bins and redraw
    const updatedBins = binGenerator(filteredData);
    drawHistogram(updatedBins);
}
