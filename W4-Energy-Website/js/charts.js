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

    createHorizontalBrandChart(data);
  } catch (error) {
    console.error("Error loading data:", error);
    document.querySelectorAll(".chart-container").forEach((container) => {
      container.innerHTML =
        '<p style="color: #e76f51;">Error loading data. Please ensure the CSV file is accessible.</p>';
    });
  }
}

// Chart 1: Horizontal Bar Chart - TVs by Brand
function createHorizontalBrandChart(data) {
  const container = d3.select("#chart-brands-horizontal");
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
    .slice(0, 15);

  // Dimensions
  const margin = { top: 40, right: 40, bottom: 40, left: 120 };
  const width = 750 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

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
    .text("Top 15 Brands by Number of TV Models");

  // Scales
  const y = d3
    .scaleBand()
    .domain(brandData.map((d) => d.brand))
    .range([0, height])
    .padding(0.2);

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(brandData, (d) => d.count)])
    .nice()
    .range([0, width]);

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
      "#a8dadc",
      "#e9c46a",
      "#f4a261",
    ]);

  // Axes
  svg.append("g").attr("class", "axis").call(d3.axisLeft(y));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Axis label
  svg
    .append("text")
    .attr("fill", colors.text)
    .attr("x", width / 2)
    .attr("y", height + 35)
    .attr("text-anchor", "middle")
    .text("Number of Models");

  // Horizontal bars
  svg
    .selectAll(".bar")
    .data(brandData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => y(d.brand))
    .attr("x", 0)
    .attr("height", y.bandwidth())
    .attr("width", 0)
    .attr("fill", (d) => color(d.brand))
    .attr("rx", 4)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("opacity", 0.8);
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip
        .html(`<strong>${d.brand}</strong><br>${d.count} models`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr("width", (d) => x(d.count));

  // Value labels at end of bars
  svg
    .selectAll(".bar-label")
    .data(brandData)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("y", (d) => y(d.brand) + y.bandwidth() / 2)
    .attr("x", (d) => x(d.count) + 5)
    .attr("dy", "0.35em")
    .attr("fill", colors.text)
    .attr("font-size", "11px")
    .text((d) => d.count)
    .style("opacity", 0)
    .transition()
    .delay(800)
    .duration(400)
    .style("opacity", 1);
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
