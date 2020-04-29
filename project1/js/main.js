//, 543, 123, 345, 678, 50, 150, 800

let data = [
  {
    "month": "January",
    "revenue": "13432",
    "profit": "8342"
  },
  {
    "month": "February",
    "revenue": "19342",
    "profit": "10342"
  },
  {
    "month": "March",
    "revenue": "17443",
    "profit": "15423"
  },
  {
    "month": "April",
    "revenue": "26342",
    "profit": "18432"
  },
  {
    "month": "May",
    "revenue": "34213",
    "profit": "29434"
  },
  {
    "month": "June",
    "revenue": "50321",
    "profit": "45343"
  },
  {
    "month": "July",
    "revenue": "54273",
    "profit": "47452"
  }
].map(e => ({
  month: e.month,
  revenue: +e.revenue,
  profit: +e.profit
}))

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

const getColor = (data) => d3.scaleOrdinal()
  .domain(data.map((d) => d.month))
  .range(d3.schemeCategory10)

const getY = (data, label) => d3.scaleLinear()
  .domain([0, d3.max(data, d => d[label]) + 10000])
  .range([chartH, 0])


const getX = (data) => d3.scaleBand()
  .domain(data.map((d) => d.month))
  .range([0, chartW])
  .paddingInner(1)
  .paddingOuter(1);

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
  let label = isRevenue ? 'revenue' : 'profit'
  isRevenue = !isRevenue;

  update(data, label)
}, 3000);

const update = (data, label) => {

  let x = getX(data);
  let y = getY(data, label);
  let color = getColor(data);

  let xAxis = d3.axisBottom(x);
  let yAxis = d3.axisLeft(y);

  let t = d3.transition().duration(1000);

  groupX.call(xAxis);
  groupY.call(yAxis);

  let rects = group.selectAll('rect')
    .data(data)

  rects.exit()
    .transition(t)
    .attr("height", 0)
    .remove();

  rects.transition(t)
    .attr("x", (d) => x(d.month))
    .attr("width", 30)
    .attr("y", (d) => y(d.revenue))
    .attr("height", d => chartH - y(d.revenue))
    .attr("fill", d => color(d.month))

  rects.enter()
    .append('rect')
    .attr("y", y(0))
    .attr("x", (d) => x(d.month))
    .attr("width", 30)
    .attr("height", 0)
    .attr("fill", d => color(d.month))
    .transition(t)
    .attr("y", (d) => y(d.revenue))
    .attr("height", d => chartH - y(d.revenue))
}

update(data, 'revenue');