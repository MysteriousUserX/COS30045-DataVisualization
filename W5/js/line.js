document.addEventListener('DOMContentLoaded', () => {
    // Select the container
    const chartContainer = d3.select("#line-chart");
    
    // Define margins
    const margin = { top: 30, right: 120, bottom: 50, left: 80 };
    
    // Calculate width and height dynamically based on the container size
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG to the container
    const svg = chartContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X/Y axes groups
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
        .text("Year");
        
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -height / 2)
        .text("Price ($/MWh)");

    // Load data
    d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(data => {
        // Parse data
        data.forEach(d => {
            d.Year = d3.timeParse("%Y")(d.Year);
            d.QLD = +d["Queensland ($ per megawatt hour)"];
            d.NSW = +d["New South Wales ($ per megawatt hour)"];
            d.VIC = +d["Victoria ($ per megawatt hour)"];
            d.SA = +d["South Australia ($ per megawatt hour)"];
            d.TAS = d["Tasmania ($ per megawatt hour)"] ? +d["Tasmania ($ per megawatt hour)"] : undefined;
            d.SNOWY = d["Snowy ($ per megawatt hour)"] ? +d["Snowy ($ per megawatt hour)"] : undefined;
            d.AVG = +d["Average Price (notTas-Snowy)"];
        });

        const states = ["QLD", "NSW", "VIC", "SA", "TAS", "SNOWY", "AVG"];
        const labels = {
            "QLD": "Queensland",
            "NSW": "New South Wales",
            "VIC": "Victoria",
            "SA": "South Australia",
            "TAS": "Tasmania",
            "SNOWY": "Snowy",
            "AVG": "Average"
        };
        const color = d3.scaleOrdinal()
            .domain(states)
            .range(["#ff7b72", "#79c0ff", "#d2a8ff", "#ffa657", "#3fb950", "#f0f6fc", "var(--text-primary)"]);

        // Format data into an array of objects for each line
        const linesData = states.map(state => {
            return {
                name: state,
                values: data.map(d => {
                    return { Year: d.Year, price: d[state] };
                }).filter(d => d.price !== undefined && !isNaN(d.price)) // Filter out empty years
            };
        });

        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(linesData, line => d3.max(line.values, d => d.price)) * 1.05])
            .range([height, 0]);

        // Draw Axes
        xAxisGroup.call(d3.axisBottom(x));
        yAxisGroup.call(d3.axisLeft(y));

        // Tooltip setup
        const tooltip = d3.select("#tooltip");

        // Line generator
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.price))
            .curve(d3.curveMonotoneX); // Add some smoothing

        // Draw lines
        svg.selectAll(".line-group")
            .data(linesData)
            .enter()
            .append("path")
            .attr("class", "line")
            .style("stroke", d => color(d.name))
            .style("stroke-width", d => d.name === "AVG" ? "3px" : "1.5px") // Make avg line prominent
            .style("stroke-dasharray", d => d.name === "AVG" ? "0" : "5, 5") // make other lines dashed
            .style("opacity", d => d.name === "AVG" ? 1 : 0.6)
            .attr("d", d => line(d.values))
            .on("mouseover", function(event, d) {
                const yearHovered = x.invert(d3.pointer(event, this)[0]);
                // Fade other lines
                svg.selectAll(".line")
                   .style("opacity", lineData => lineData.name === d.name ? 1 : 0.1)
                   .style("stroke-width", lineData => lineData.name === d.name ? "4px" : "1px");
                
                tooltip.style("opacity", 1)
                       .html(`
                        <div class="tooltip-title">${labels[d.name]}</div>
                        <p>Line highlighted</p>
                       `);
            })
            .on("mousemove", (event) => {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(event, d) {
                // Restore lines
                svg.selectAll(".line")
                   .style("opacity", lineData => lineData.name === "AVG" ? 1 : 0.6)
                   .style("stroke-width", lineData => lineData.name === "AVG" ? "3px" : "1.5px");
                tooltip.style("opacity", 0);
            });

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(states)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width + 10},${i * 20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", color)
            .style("opacity", d => d === "AVG" ? 1 : 0.6);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 7.5)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("fill", "var(--text-secondary)")
            .style("font-size", "11px")
            .style("font-weight", d => d === "AVG" ? "bold" : "normal")
            .text(d => labels[d]);

    }).catch(error => {
        console.error("Error loading CSV file:", error);
        chartContainer.append("p").text("Error loading data.").style("color", "red");
    });
});
