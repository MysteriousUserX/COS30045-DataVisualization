document.addEventListener('DOMContentLoaded', () => {
    // Select the container
    const chartContainer = d3.select("#bar-chart");
    
    // Define margins
    const margin = { top: 30, right: 30, bottom: 50, left: 80 };
    
    // We'll calculate width and height dynamically based on the container size
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG to the container
    const svg = chartContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add Axis Groups
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
        .text("Screen Technology");
        
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Energy Consumption (kWh/yr)");

    // Load data
    d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(data => {
        // Parse data
        data.forEach(d => {
            d.energy = +d["Mean(Labelled energy consumption (kWh/year))"];
        });

        // Scales - doing a vertical bar chart
        const x = d3.scaleBand()
            .domain(data.map(d => d.Screen_Tech))
            .range([0, width])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.energy) * 1.1])
            .range([height, 0]);

        // Draw Axes
        xAxisGroup.call(d3.axisBottom(x));
        yAxisGroup.call(d3.axisLeft(y));

        // Tooltip setup
        const tooltip = d3.select("#tooltip");

        const color = d3.scaleOrdinal()
            .domain(["LCD", "LED", "OLED"])
            .range(["var(--color-primary)", "var(--color-secondary)", "var(--color-tertiary)"]);

        // Draw Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Screen_Tech))
            .attr("y", d => y(d.energy))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.energy))
            .attr("fill", d => color(d.Screen_Tech))
            .attr("rx", 4) // Rounded corners for aesthetics
            .attr("ry", 4)
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                       .html(`
                        <div class="tooltip-title">${d.Screen_Tech}</div>
                        <p><strong>Models:</strong> 55-inch</p>
                        <p><strong>Energy:</strong> ${d.energy.toFixed(1)} kWh/yr</p>
                       `);
            })
            .on("mousemove", (event) => {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });
            
        // Add Data Labels to the top of bars
        svg.selectAll(".bar-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => x(d.Screen_Tech) + x.bandwidth() / 2)
            .attr("y", d => y(d.energy) - 5)
            .attr("text-anchor", "middle")
            .style("fill", "var(--text-primary)")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .text(d => d.energy.toFixed(1));

    }).catch(error => {
        console.error("Error loading CSV file:", error);
        chartContainer.append("p").text("Error loading data.").style("color", "red");
    });
});
