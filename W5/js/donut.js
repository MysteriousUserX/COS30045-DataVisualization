document.addEventListener('DOMContentLoaded', () => {
    // Select the container
    const chartContainer = d3.select("#donut-chart");
    
    // Define dimensions and margins
    const width = 450;
    const height = 350;
    const margin = 20;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // Append SVG to container
    const svg = chartContainer
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(["LCD", "LED", "OLED"])
        .range(["var(--color-primary)", "var(--color-secondary)", "var(--color-tertiary)"]);

    // Load data
    d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(data => {
        
        // Compute the position of each group on the pie
        const pie = d3.pie()
            .value(d => +d["Mean(Labelled energy consumption (kWh/year))"])
            .sort(null);
            
        const data_ready = pie(data);

        // Define arc for donut chart (giving it an inner radius creates the donut hole)
        const arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .outerRadius(radius * 0.8);

        // Another arc that won't be drawn. Just for labels positioning
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        // Tooltip setup
        const tooltip = d3.select("#tooltip");

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll("allSlices")
            .data(data_ready)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.Screen_Tech))
            .attr("stroke", "var(--card-bg)")
            .style("stroke-width", "2px")
            .style("opacity", 0.9)
            .attr("class", "arc")
            .on("mouseover", (event, d) => {
                tooltip.style("opacity", 1)
                       .html(`
                        <div class="tooltip-title">${d.data.Screen_Tech}</div>
                        <p><strong>Energy:</strong> ${(+d.data["Mean(Labelled energy consumption (kWh/year))"]).toFixed(1)} kWh/yr</p>
                       `);
            })
            .on("mousemove", (event) => {
                tooltip.style("left", (event.pageX + 10) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

        // Add the polylines between chart and labels
        svg.selectAll("allPolylines")
            .data(data_ready)
            .enter()
            .append("polyline")
            .attr("stroke", "var(--text-secondary)")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr("points", d => {
                const posA = arc.centroid(d); // line insertion in the slice
                const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
                const posC = outerArc.centroid(d); // Label position = almost the same as posB
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC];
            });

        // Add the labels
        svg.selectAll("allLabels")
            .data(data_ready)
            .enter()
            .append("text")
            .text(d => d.data.Screen_Tech)
            .attr("transform", d => {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style("text-anchor", d => {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? "start" : "end");
            })
            .style("fill", "var(--text-primary)")
            .style("font-size", "12px")
            .style("font-weight", "600");
            
    }).catch(error => {
        console.error("Error loading CSV file:", error);
        chartContainer.append("p").text("Error loading data.").style("color", "red");
    });
});
