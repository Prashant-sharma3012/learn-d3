let data = [
  {
    name: "naruto",
    height: 234
  },
  {
    name: "itachi",
    height: 778
  },
  {
    name: "sakura",
    height: 123
  },
  {
    name: "sasuke",
    height: 345
  },
  {
    name: "kakashi",
    height: 678
  },
  {
    name: "konahamaru",
    height: 50
  },
  {
    name: "guy sensie",
    height: 800
  }
]

//, 543, 123, 345, 678, 50, 150, 800

let margin = {
  left: 100,
  right: 10,
  top: 60,
  bottom: 100

}

let svgW = 600;
let svgH = 600;

let chartW = 600 - margin.left - margin.right;
let chartH = 600 - margin.top - margin.bottom;

let color = d3.scaleOrdinal()
  .domain(data.map((d) => d.name))
  .range(d3.schemeCategory10)

let y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.height) + 100])
  .range([chartH, 0])

let x = d3.scaleBand()
  .domain(data.map((d) => d.name))
  .range([0, chartW])
  .paddingInner(1)
  .paddingOuter(1);

let svg = d3.select("#app-chart")
  .append("svg")
  .attr("width", svgW)
  .attr("height", svgH)

let group = svg.append('g')
  .attr("transform", `translate(${margin.left},${margin.top})`)

let xAxis = d3.axisBottom(x);
let yAxis = d3.axisLeft(y);

group.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${chartH})`)
  .call(xAxis)
  .selectAll("text")
  .attr("y", "10")
  .attr("x", "-5")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-40)")

group.append("g")
  .attr("class", "y axis")
  .call(yAxis)

let t = d3.transition().duration(1000)

let rects = group.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr("y", y(0))
  .attr("x", (d) => x(d.name))
  .attr("width", 30)
  .attr("height", 0)
  .attr("fill", d => color(d.name))
  .transition(t)
    .attr("y", (d) => y(d.height))
    .attr("height", d => chartH - y(d.height))  

