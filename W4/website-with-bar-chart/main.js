d3.csv("data/tvBrandCount.csv", (d) => {
  return {
    brand: d.brand,
    count: +d.count,
  };
}).then((data) => {
  console.log(data);
  console.log(data.length);
  console.log(d3.max(data, (d) => d.count));
  console.log(d3.min(data, (d) => d.count));
  console.log(d3.extent(data, (d) => d.count)); //=> array with min and max

  data.sort((a, b) => b.count - a.count);

  createBarChart(data);
});

const createBarChart = (data) => {
  // Define scales
  const maxCount = d3.max(data, (d) => d.count);
  const xScale = d3.scaleLinear().domain([0, maxCount]).range([0, 800]); // Matches viewBox width (accounting for offset)

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, 1600]) // Adjusted for appropriate bar height spread based on 76 brands
    .padding(0.2); // Padding between bars

  // Select container and append an SVG
  const svg = d3
    .select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1000 1600") // Adjusted height overall
    .style("border", "1px solid black");

  // Create groups for each bar and label
  const barAndLabel = svg
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d) => `translate(0, ${yScale(d.brand)})`);

  // Add the rectangles
  barAndLabel
    .append("rect")
    .attr("class", (d) => `bar bar-${d.count}`)
    .attr("width", (d) => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("x", 120) // Offset to make room for longer brand labels
    .attr("y", 0); // Y is 0 because the group is translated

  // Add the category (brand) text
  barAndLabel
    .append("text")
    .attr("x", 110)
    .attr("y", yScale.bandwidth() / 2 + 4) // Center text vertically
    .attr("text-anchor", "end")
    .style("font-family", "sans-serif")
    .style("font-size", "11px")
    .each(function (d) {
      if (d.brand === "Shenzhen Xinchaoda Technology Co., Ltd") {
        const text = d3.select(this);
        text.append("tspan").text("Shenzhen Xinchaoda").attr("x", 110).attr("dy", "-0.4em");
        text.append("tspan").text("Technology Co., Ltd").attr("x", 110).attr("dy", "1.1em");
      } else {
        d3.select(this).text(d.brand);
      }
    });

  // Add the count text
  barAndLabel
    .append("text")
    .text((d) => d.count)
    .attr("x", (d) => 125 + xScale(d.count)) // Position past the end of the bar
    .attr("y", yScale.bandwidth() / 2 + 4) // Center text vertically
    .style("font-family", "sans-serif")
    .style("font-size", "11px");
};
