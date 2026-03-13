document.addEventListener('DOMContentLoaded', () => {
    // Select the container
    const chartContainer = d3.select("#scatter-chart");
    
    // Define margins
    const margin = { top: 30, right: 30, bottom: 50, left: 80 };
    
    // We'll calculate width and height dynamically based on the container size
    // For SVG viewBox to work effectively with responsive design
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG to the container
    const svg = chartContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X/Y axes groups (empty for now)
    const xAxisGroup = svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", `translate(0,${height})`);
        
    const yAxisGroup = svg.append("g")
        .attr("class", "y-axis axis");
        
    // Add Axis Labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Star Rating");
        
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Energy Consumption (kWh/yr)");

    // Load data
    d3.csv("data/Ex5_TV_energy.csv").then(data => {
        // Parse data
        data.forEach(d => {
            d.energy_consumpt = +d.energy_consumpt;
            d.star2 = +d.star2;
        });

        // Scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.star2) + 1])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy_consumpt) * 1.05])
            .range([height, 0]);

        // Draw Axes
        xAxisGroup.call(d3.axisBottom(x));
        yAxisGroup.call(d3.axisLeft(y));

        // Tooltip setup
        const tooltip = d3.select("#tooltip");

        // Scatter Points
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.star2))
            .attr("cy", d => y(d.energy_consumpt))
            .attr("r", 4)
            .attr("fill", "var(--color-primary)")
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                       .html(`
                        <div class="tooltip-title">${d.brand.toUpperCase()} (${d.screen_tech})</div>
                        <p><strong>Screen Size:</strong> ${d.screensize}"</p>
                        <p><strong>Energy:</strong> ${d.energy_consumpt.toFixed(1)} kWh/yr</p>
                        <p><strong>Stars:</strong> ${d.star2}</p>
                       `);
            })
            .on("mousemove", (event) => {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
    }).catch(error => {
        console.error("Error loading CSV file:", error);
        chartContainer.append("p").text("Error loading data.").style("color", "red");
    });
});
