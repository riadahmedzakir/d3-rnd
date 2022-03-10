const margin = {
    Top: 40,
    Right: 40,
    Bottom: 40,
    Left: 40
};
const width = 300 - margin.Left - margin.Right;
const height = 400 - margin.Top - margin.Bottom;
let flag = true;

const svg = d3.select('#canvas').append("svg")
    .attr("width", width + margin.Left + margin.Right)
    .attr("height", height + margin.Top + margin.Bottom);

const g = svg.append("g")
    .attr("transform", `translate(${margin.Left}, ${margin.Top})`);

const y = d3.scaleLinear()
    .range([height, 0]);

const x = d3.scaleBand()
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.1);

const xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height})`);

const yAxisGroup = g.append("g")
    .attr("class", "y axis");

const tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) { return `<strong>Name: </strong> <span style="color: red;">${d.name}</span>` });
g.call(tip);

d3.json('data/mydata.json').then(data => {
    d3.interval(() => {
        flag = !flag;
        udpate(data);
    }, 1000);

    udpate(data);
});


function udpate(data) {
    const value = flag ? "age" : "level";
    const t = d3.transition().duration(750);

    x.domain(data.map(d => d.name))
    y.domain([0, d3.max(data, d => d[value])]);

    const xAxisCall = d3.axisBottom(x);
    xAxisGroup.transition(t).call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    const yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d + "m");

    yAxisGroup.transition(t).call(yAxisCall);

    const rect = g.selectAll("rect")
        .data(data);

    rect.exit()
        .attr("fill", "red")
        .transition(t)
        .attr("height", 0)
        .attr("y", y(0))
        .remove();

    rect.transition(t)
        .attr("x", (data, i) => x(data.name))
        .attr("y", d => y(d[value]))
        .attr("height", (data, i) => height - y(data[value]))
        .attr("width", x.bandwidth);

    rect.enter().append("rect")
        .attr("x", (data, i) => x(data.name))
        .attr("y", d => y(d[value]))
        .attr("height", (data, i) => height - y(data[value]))
        .attr("width", x.bandwidth)
        .attr("y", y(0))
        .attr("height", 0)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition(t);
}