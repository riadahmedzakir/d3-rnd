// Create the renderer
const render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
const svg = d3.select("svg");
let svgGroup;

// const nodes = [
//     { Name: "Process Start", node: 0, class: "", edges: [1] },
//     { Name: "Recieve Order", node: 1, class: "", edges: [2, 3] },
//     { Name: "Approve Credit Check", node: 2, class: "", edges: [3] },
//     { Name: "Confirm Order", node: 3, class: "", edges: [4, 5, 6] },
//     { Name: "Change price", node: 4, class: "", edges: [7] },
//     { Name: "Change Shipping Condition", node: 5, class: "", edges: [6] },
//     { Name: "Remove Delivery Block", node: 6, class: "", edges: [7] },
//     { Name: "Generate Delivery Document", node: 7, class: "", edges: [8] },
//     { Name: "Ship Goods", node: 8, class: "", edges: [9, 10] },
//     { Name: "Send Invoice", node: 9, class: "", edges: [12, 13] },
//     { Name: "Return Good", node: 10, class: "", edges: [11] },
//     { Name: "Cancel Order", node: 11, class: "", edges: [14] },
//     { Name: "Send 1st Payment Reminder", node: 12, class: "", edges: [13] },
//     { Name: "Clear Invoice", node: 13, class: "", edges: [14] },
//     { Name: "Process End", node: 14, class: "", edges: [] },
// ]

function createGraph(nodes) {
    const g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function () { return {}; });

    g.graph().transition = function transition(selection) {
        return selection.transition().duration(1000);
    };

    nodes.forEach(node => {
        g.setNode(node.node, { label: node.Name, class: node.class });
    });

    g.nodes().forEach(function (v) {
        var node = g.node(v);
        node.rx = node.ry = 5;
    });

    nodes.forEach(node => {
        node.edges.forEach(edge => {
            g.setEdge(node.node, edge);
        });
    });

    return g;
}

function draw(g) {
    svgGroup = svg.append("g");

    const styleTooltip = function (name, description) {
        return "<p class='name'>" + 'Test' + "</p><p class='description'>" + 'Test' + "</p>";
    };

    render(svgGroup, g);

    svgGroup.selectAll("g.node")
        .attr("title", function (v) { return styleTooltip(v, g.node(v).description) })
        .each(function (v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });

    svgGroup.selectAll("g.node")
        .on('click', function (d) { document.getElementById("selectionText").innerHTML = d });

    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
}


function initialState() {
    svg.selectAll("*").remove();

    const state = [
        { Name: "Process Start", node: 0, class: "", edges: [1] },
        { Name: "Recieve Order", node: 1, class: "", edges: [2] },
        { Name: "Confirm Order", node: 2, class: "", edges: [3] },
        { Name: "Generate Delivery Document", node: 3, class: "", edges: [4] },
        { Name: "Ship Goods", node: 4, class: "", edges: [5] },
        { Name: "Send Invoice", node: 5, class: "", edges: [6] },
        { Name: "Clear Invoice", node: 6, class: "", edges: [7] },
        { Name: "Process End", node: 7, class: "", edges: [] },
    ];
    draw(createGraph(state));
}

function expandMore() {
    svg.selectAll("*").remove();

    const state = [
        { Name: "Process Start", node: 0, class: "", edges: [1] },
        { Name: "Recieve Order", node: 1, class: "", edges: [2, 3] },
        { Name: "Approve Credit Check", node: 2, class: "", edges: [3] },
        { Name: "Confirm Order", node: 3, class: "", edges: [4, 5, 6] },
        { Name: "Change price", node: 4, class: "", edges: [7] },
        { Name: "Change Shipping Condition", node: 5, class: "", edges: [6] },
        { Name: "Remove Delivery Block", node: 6, class: "", edges: [7] },
        { Name: "Generate Delivery Document", node: 7, class: "", edges: [8] },
        { Name: "Ship Goods", node: 8, class: "", edges: [9, 10] },
        { Name: "Send Invoice", node: 9, class: "", edges: [12, 13] },
        { Name: "Return Good", node: 10, class: "", edges: [11] },
        { Name: "Cancel Order", node: 11, class: "", edges: [14] },
        { Name: "Send 1st Payment Reminder", node: 12, class: "", edges: [13] },
        { Name: "Clear Invoice", node: 13, class: "", edges: [14] },
        { Name: "Process End", node: 14, class: "", edges: [] },
    ];
    draw(createGraph(state));
}

function init() {
    initialState();

    document.getElementById("init").addEventListener("click", initialState);

    document.getElementById("more").addEventListener("click", expandMore);
}

init();