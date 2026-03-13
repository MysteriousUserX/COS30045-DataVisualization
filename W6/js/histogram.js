function drawHistogram(bins) {
    // Define bounds for our bins and set the scale domain
    const xMax = d3.max(bins, d => d.x1) || 100;
    xScale.domain([0, xMax]);

    const yMax = d3.max(bins, d => d.length) || 10;
    yScale.domain([0, yMax]).nice();

    // Transition settings
    const t = svg.transition()
                 .duration(500)
                 .ease(d3.easeCubicInOut);

    // Update bottom axis (x-axis)
    xAxisGroup.transition(t).call(d3.axisBottom(xScale));
    
    // Update left axis (y-axis)
    yAxisGroup.transition(t).call(d3.axisLeft(yScale));

    // Draw the bars of the histogram
    const bars = svg.selectAll(".bar")
        .data(bins);

    // Exit old bars
    bars.exit()
        .transition(t)
        .attr("y", innerHeight)
        .attr("height", 0)
        .remove();

    // Enter new bars
    const barsEnter = bars.enter()
        .append("rect")
        .attr("class", "bar")
        // Gap constructed with stroke colour of the background!
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2)
        .attr("fill", barColor)
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("y", innerHeight)
        .attr("height", 0);

    // Update merged bars
    barsEnter.merge(bars)
        .transition(t)
        .attr("x", d => xScale(d.x0))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor);
}
