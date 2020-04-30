//, 543, 123, 345, 678, 50, 150, 800

let margin = {
  left: 100,
  right: 10,
  top: 60,
  bottom: 100
}

let svgW = 600;
let svgH = 600;

let chartW = svgW - margin.left - margin.right;
let chartH = svgH - margin.top - margin.bottom;

const getColor = (countries) => d3.scaleOrdinal()
  .domain(countries.map((d) => d.country))
  .range(d3.schemeCategory10)

const getY = (countries) => d3.scaleLinear()
  .domain([0, d3.max(countries, d => d.life_exp || 0)])
  .range([chartH, 0])

const populationScale = (countries) => d3.scaleLinear()
  .domain([0, d3.max(countries, d => d.population || 0)])
  .range([5, 30])

const getX = (countries) => d3.scaleLinear()
  .domain([0, d3.max(countries, d => d.income || 0)])
  .range([0, chartW])

let svg = d3.select("#chart-area")
  .append("svg")
  .attr("width", svgW)
  .attr("height", svgH)

let group = svg.append('g')
  .attr("transform", `translate(${margin.left},${margin.top})`)

let groupX = group.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${chartH})`)

let groupY = group.append("g")
  .attr("class", "y axis")

let isRevenue = true;

d3.interval(() => {
  update(data)
}, 1000);

let currentIndex = 0;

const update = (data) => {

  if(currentIndex >= data.length){
    currentIndex = 0;
  }

  let countries = data[currentIndex].countries;

  currentIndex = currentIndex + 1;

  let x = getX(countries);
  let y = getY(countries);
  let color = getColor(countries);
  let population = populationScale(countries);

  let logS = d3.scaleLog().domain([0, 12000]).range([50, 500])
  .base(10)

  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y);

  let t = d3.transition().duration(1000);

  groupX.call(xAxis);
  groupY.call(yAxis);

  let circles = group.selectAll('circle')
    .data(countries)

  circles.exit()
    .transition(t)
    .attr("height", 0)
    .remove();

  circles.transition(t)
    .attr("cx", (d) => x(d.income || 0))
    .attr("cy", (d) => chartH - y(d.life_exp))
    .attr("r", d => population(d.population))
    .attr("fill", d => color(d.country))

  circles.enter()
    .append('circle')
    .attr("cx", x(0))
    .attr("cy", y(0))
    .attr("r", population(0))
    .attr("fill", d => color(d.country))
    .transition(t)
    .attr("cx", (d) => x(d.income || 0))
    .attr("cy", (d) => chartH - y(d.life_exp))
    .attr("r", d => population(d.population))
}
