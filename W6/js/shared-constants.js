// Set up dimensions
const width = 800;
const height = 400;
const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Define Colours
const bodyBackgroundColor = "#ffffff"; // Stroke colour for gaps
const barColor = "#818cf8"; // Indigo 400
const barHoverColor = "#4f46e5"; // Indigo 600

// Define Scales
const xScale = d3.scaleLinear()
    .range([0, innerWidth]);

const yScale = d3.scaleLinear()
    .range([innerHeight, 0]);

// Define Bin Generator
const binGenerator = d3.bin()
    .value(d => d.energyConsumption); // Can change the value being used to plot the histogram here

// State variables to be used across modules
let globalData = [];

// Filters config (Label and state)
const filters_screen = [
    { id: "all", label: "All Technologies", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: "24", label: '24"', isActive: false },
    { id: "32", label: '32"', isActive: false },
    { id: "55", label: '55"', isActive: false },
    { id: "65", label: '65"', isActive: false },
    { id: "98", label: '98"', isActive: false }
];

// Create SVG container
const svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("max-width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add axes labels
svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + margin.bottom - 10)
    .text("Labeled Energy Consumption (kWh/year)");

svg.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -margin.left + 20)
    .text("Frequency");

// Create axis groups
const xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`);
    
const yAxisGroup = svg.append("g")
    .attr("class", "y-axis");
