/**
 * PowerSmart TV Energy Visualization Charts
 * D3.js visualizations for the Smart Buyer's Guide
 */

// Color palette
const colors = {
  primary: "#e9c46a",
  secondary: "#f4a261",
  accent: "#e76f51",
  highlight: "#2ec4b6",
  text: "#a8dadc",
  lcd: "#4cc9f0",
  oled: "#f77f00",
};

// Tooltip setup
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load and process data
async function loadData() {
  try {
    const data = await d3.csv("data/tv_energy.csv");

    // Process data
    data.forEach((d) => {
      d.Avg_mode_power = +d.Avg_mode_power;
      d.Advertised_Size_Int = +d.Advertised_Size_Int;
      d.Star2 = +d.Star2;
    });

    // Create all charts
    createSizeChart(data);
    createTechChart(data);
    createPowerChart(data);
    createBrandChart(data);
  } catch (error) {
    console.error("Error loading data:", error);
    document.querySelectorAll(".chart-container").forEach((container) => {
      container.innerHTML =
        '<p style="color: #e76f51;">Error loading data. Please ensure the CSV file is accessible.</p>';
    });
  }
}

// Chart 1: Screen Sizes Distribution
function createSizeChart(data) {
  const container = d3.select("#chart-sizes");
  container.html("");

  // Aggregate by size
  const sizeCounts = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.Advertised_Size_Int,
  );
  const sizeData = Array.from(sizeCounts, ([size, count]) => ({ size, count }))
    .filter((d) => d.size >= 32 && d.size <= 100)
    .sort((a, b) => a.size - b.size);

  // Dimensions
  const margin = { top: 40, right: 30, bottom: 60, left: 70 };
  const width = 750 - margin.left - margin.right;
  const height = 320 - margin.top - margin.bottom;

  const svg = container
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("Number of TV Models by Screen Size");

  // Scales
  const x = d3
    .scaleBand()
    .domain(sizeData.map((d) => d.size))
    .range([0, width])
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(sizeData, (d) => d.count)])
    .nice()
    .range([height, 0]);

  // Color scale - highlight 55 and 65
  const barColor = (d) => {
    if (d.size === 55 || d.size === 65) return colors.accent;
    if (d.size === 75 || d.size === 85) return colors.secondary;
    return colors.primary;
  };

  // Axes
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(sizeData.filter((d, i) => i % 2 === 0).map((d) => d.size)),
    )
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

  // Axis labels
  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .text("Screen Size (Inches)");

  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Number of Models");

  // Bars
  svg
    .selectAll(".bar")
    .data(sizeData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.size))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", barColor)
    .attr("rx", 4)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 0.8);
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(`<strong>${d.size}" Screen</strong><br>${d.count} models`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 30)
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count));
}

// Chart 2: Technology Distribution
function createTechChart(data) {
  const container = d3.select("#chart-tech");
  container.html("");

  // Aggregate by technology
  const techCounts = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.Screen_Tech,
  );
  const techData = Array.from(techCounts, ([tech, count]) => ({
    tech,
    count,
  })).sort((a, b) => b.count - a.count);

  const total = d3.sum(techData, (d) => d.count);

  // Dimensions
  const width = 700;
  const height = 320;
  const radius = Math.min(width, height) / 2 - 60;

  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(techData.map((d) => d.tech))
    .range([colors.lcd, colors.oled, colors.secondary, colors.primary]);

  // Pie generator
  const pie = d3
    .pie()
    .value((d) => d.count)
    .sort(null);

  const arc = d3
    .arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.75)
    .outerRadius(radius * 0.75);

  // Draw slices
  const slices = svg
    .selectAll(".slice")
    .data(pie(techData))
    .enter()
    .append("g")
    .attr("class", "slice");

  slices
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.tech))
    .attr("stroke", "#1a1a2e")
    .attr("stroke-width", 2)
    .style("opacity", 0)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 0.8);
      const percent = ((d.data.count / total) * 100).toFixed(1);
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(
          `<strong>${d.data.tech}</strong><br>${d.data.count} models (${percent}%)`,
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(800)
    .style("opacity", 1);

  // Labels
  slices
    .append("text")
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .attr("font-size", "12px")
    .attr("font-weight", "600")
    .text((d) => {
      const percent = ((d.data.count / total) * 100).toFixed(0);
      return percent > 5 ? `${percent}%` : "";
    })
    .style("opacity", 0)
    .transition()
    .delay(500)
    .duration(400)
    .style("opacity", 1);

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${radius + 30}, ${-techData.length * 12})`);

  techData.forEach((d, i) => {
    const legendRow = legend
      .append("g")
      .attr("transform", `translate(0, ${i * 25})`);

    legendRow
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("rx", 4)
      .attr("fill", color(d.tech));

    legendRow
      .append("text")
      .attr("x", 25)
      .attr("y", 14)
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text(d.tech);
  });
}

// Chart 3: Size vs Power Consumption
function createPowerChart(data) {
  const container = d3.select("#chart-power");
  container.html("");

  // Sample data for better performance (too many points)
  const sampleSize = Math.min(500, data.length);
  const sampledData = data
    .filter((d) => d.Avg_mode_power > 0 && d.Advertised_Size_Int >= 24)
    .sort(() => Math.random() - 0.5)
    .slice(0, sampleSize);

  // Dimensions
  const margin = { top: 40, right: 30, bottom: 60, left: 70 };
  const width = 750 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("Screen Size vs Power Consumption");

  // Scales
  const x = d3
    .scaleLinear()
    .domain([20, d3.max(sampledData, (d) => d.Advertised_Size_Int) + 5])
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(sampledData, (d) => d.Avg_mode_power) * 1.1])
    .range([height, 0]);

  // Axes
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

  // Axis labels
  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .text("Screen Size (Inches)");

  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Power Consumption (Watts)");

  // Points
  svg
    .selectAll(".dot")
    .data(sampledData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.Advertised_Size_Int))
    .attr("cy", (d) => y(d.Avg_mode_power))
    .attr("r", 0)
    .attr("fill", (d) =>
      d.Screen_Tech.includes("OLED") ? colors.oled : colors.lcd,
    )
    .attr("opacity", 0.6)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 1).attr("r", 8);
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(
          `<strong>${d.Brand_Reg}</strong><br>
        ${d.Advertised_Size_Int}" ${d.Screen_Tech}<br>
        Power: ${d.Avg_mode_power.toFixed(1)}W<br>
        Star Rating: ${d.Star2}`,
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 0.6).attr("r", 5);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(1000)
    .delay((d, i) => i * 2)
    .attr("r", 5);

  // Legend
  const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, 10)`);

  [
    { label: "LCD/LED", color: colors.lcd },
    { label: "OLED", color: colors.oled },
  ].forEach((item, i) => {
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", i * 22)
      .attr("r", 6)
      .attr("fill", item.color);

    legend
      .append("text")
      .attr("x", 15)
      .attr("y", i * 22 + 4)
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text(item.label);
  });
}

// Chart 4: Top Brands
function createBrandChart(data) {
  const container = d3.select("#chart-brands");
  container.html("");

  // Aggregate by brand
  const brandCounts = d3.rollup(
    data,
    (v) => v.length,
    (d) => d.Brand_Reg,
  );
  const brandData = Array.from(brandCounts, ([brand, count]) => ({
    brand,
    count,
  }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  // Dimensions
  const margin = { top: 40, right: 30, bottom: 100, left: 70 };
  const width = 750 - margin.left - margin.right;
  const height = 350 - margin.top - margin.bottom;

  const svg = container
    .append("svg")
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -15)
    .attr("text-anchor", "middle")
    .text("Top 12 TV Brands by Number of Models");

  // Scales
  const x = d3
    .scaleBand()
    .domain(brandData.map((d) => d.brand))
    .range([0, width])
    .padding(0.25);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(brandData, (d) => d.count)])
    .nice()
    .range([height, 0]);

  // Color scale
  const color = d3
    .scaleOrdinal()
    .domain(brandData.map((d) => d.brand))
    .range([
      "#e9c46a",
      "#f4a261",
      "#e76f51",
      "#2ec4b6",
      "#4cc9f0",
      "#9b5de5",
      "#f15bb5",
      "#fee440",
      "#00bbf9",
      "#00f5d4",
      "#9b5de5",
      "#f72585",
    ]);

  // Axes
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.5em");

  svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

  // Axis label
  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Number of Models");

  // Bars
  svg
    .selectAll(".bar")
    .data(brandData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.brand))
    .attr("y", height)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .attr("fill", (d) => color(d.brand))
    .attr("rx", 4)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 0.8);
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(`<strong>${d.brand}</strong><br>${d.count} models registered`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 60)
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => height - y(d.count));
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load charts when televisions page is shown
  const observer = new MutationObserver(function () {
    const tvPage = document.getElementById("page-televisions");
    if (tvPage && tvPage.classList.contains("active")) {
      loadData();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  // Also load if navigated directly or page is already active
  setTimeout(() => {
    const tvPage = document.getElementById("page-televisions");
    if (tvPage && tvPage.classList.contains("active")) {
      loadData();
    }
  }, 100);
});

// Expose loadData for manual trigger
window.loadCharts = loadData;
