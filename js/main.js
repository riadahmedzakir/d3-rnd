const margin = {
    Top: 40,
    Right: 40,
    Bottom: 40,
    Left: 40
};
const width = 300 - margin.Left - margin.Right;
const height = 400 - margin.Top - margin.Bottom;

d3.json('data/mydata.json').then(data => {
    const svg = d3.select('#canvas').append("svg")
        .attr("width", width + margin.Left + margin.Right)
        .attr("height", height + margin.Top + margin.Bottom);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.Left}, ${margin.Top})`);


    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => d.age)
        ])
        .range([height, 0]);

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0.1)

    const xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxisCall)
        .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

    const yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d + "m");
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    const rect = g.selectAll("rect")
        .data(data);

    rect.enter().append("rect")
        .attr("x", (data, i) => x(data.name))
        .attr("y", d => y(d.age))
        .attr("height", (data, i) => height - y(data.age))
        .attr("width", x.bandwidth)
});