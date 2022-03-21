// Create the renderer
const render = new dagreD3.render();

// Set up an SVG group so that we can translate the final graph.
const svg = d3.select("svg");
let svgGroup;

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
        node.customId = "node" + v;
    });

    nodes.forEach(node => {
        node.edges.forEach(edge => {
            g.setEdge(node.node, edge.connection, { label: edge.label, curve: d3.curveBasis });
        });
    });

    // g.nodes().forEach(function (v) {
    //     var node = g.node(v);
    //     node.customId = "node" + v;
    // });

    g.edges().forEach(function (e) {
        var edge = g.edge(e.v, e.w);
        edge.customId = e.v + "-" + e.w
    });

    g.graph().rankDir = 'LR';

    return g;
}

function draw(g) {
    svgGroup = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", function () {
            svgGroup.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")" +
                "scale(" + d3.event.transform.k + ")");
        });

    const edgeDrag = d3.drag()
        .on("start", function (d) {
            d3.event.sourceEvent.stopPropagation();
        })
        .on('drag', function (d) {
            translateEdge(g.edge(d.v, d.w), d3.event.dx, d3.event.dy);
            $('#' + g.edge(d.v, d.w).customId).attr('d', calcPoints(d, g));
        });

    svg.call(zoom);

    const styleTooltip = function (name, description) {
        return "<p class='name'>" + 'Test' + "</p><p class='description'>" + 'Test' + "</p>";
    };

    render(svgGroup, g);

    svg.selectAll("g.node rect")
        .attr("id", function (d) {
            return "node" + d;
        });

    svg.selectAll("g.edgePath path")
        .attr("id", function (e) {
            return e.v + "-" + e.w;
        });
        
    svg.selectAll("g.edgeLabel g")
        .attr("id", function (e) {
            return 'label_' + e.v + "-" + e.w;
        });

    svgGroup.selectAll("g.node")
        .attr("title", function (v) { return styleTooltip(v, g.node(v).description) })
        .each(function (v) { $(this).tipsy({ gravity: "w", opacity: 1, html: true }); });

    svgGroup.selectAll("g.node")
        .on('click', function (d) { document.getElementById("selectionText").innerHTML = d });

    const edgePaths = svg.selectAll("g.edgePath");
    edgePaths.call(edgeDrag);

    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
}


function initialState() {
    svg.selectAll("*").remove();

    const state = [
        { Name: "Process Start", node: 0, class: "", edges: [{ connection: 1, label: "40650" }] },
        { Name: "Recieve Order", node: 1, class: "", edges: [{ connection: 2, label: "50650" }] },
        { Name: "Confirm Order", node: 2, class: "", edges: [{ connection: 3, label: "15566" }] },
        { Name: "Generate Delivery Document", node: 3, class: "", edges: [{ connection: 4, label: "69566" }] },
        { Name: "Ship Goods", node: 4, class: "", edges: [{ connection: 5, label: "694545" }] },
        { Name: "Send Invoice", node: 5, class: "", edges: [{ connection: 6, label: "698542" }] },
        { Name: "Clear Invoice", node: 6, class: "", edges: [{ connection: 7, label: "156978" }] },
        { Name: "Process End", node: 7, class: "", edges: [] },
    ];
    draw(createGraph(state));
}

function expandMore() {
    svg.selectAll("*").remove();

    const state = [
        { Name: "Process Start", node: 0, class: "", edges: [{ connection: 1, label: "156978" }] },
        { Name: "Recieve Order", node: 1, class: "", edges: [{ connection: 2, label: "564564" }, { connection: 3, label: "68656" }] },
        { Name: "Approve Credit Check", node: 2, class: "", edges: [{ connection: 3, label: "5464685" }] },
        { Name: "Confirm Order", node: 3, class: "", edges: [{ connection: 4, label: "56486" }, { connection: 5, label: "45645" }, { connection: 6, label: "445645" }] },
        { Name: "Change price", node: 4, class: "", edges: [{ connection: 7, label: "55231" }] },
        { Name: "Change Shipping Condition", node: 5, class: "", edges: [{ connection: 6, label: "4541231" }] },
        { Name: "Remove Delivery Block", node: 6, class: "", edges: [{ connection: 7, label: "2454564" }] },
        { Name: "Generate Delivery Document", node: 7, class: "", edges: [{ connection: 8, label: "121568" }] },
        { Name: "Ship Goods", node: 8, class: "", edges: [{ connection: 9, label: "2326574" }, { connection: 10, label: "968542" }] },
        { Name: "Send Invoice", node: 9, class: "", edges: [{ connection: 12, label: "968455" }, { connection: 13, label: "985654" }] },
        { Name: "Return Good", node: 10, class: "", edges: [{ connection: 11, label: "3698445" }] },
        { Name: "Cancel Order", node: 11, class: "", edges: [{ connection: 14, label: "9369854" }] },
        { Name: "Send 1st Payment Reminder", node: 12, class: "", edges: [{ connection: 14, label: "4123135" }] },
        { Name: "Clear Invoice", node: 13, class: "", edges: [{ connection: 14, label: "456345" }] },
        { Name: "Process End", node: 14, class: "", edges: [] },
    ];
    draw(createGraph(state));
}

function translateEdge(e, dx, dy) {
    e.points.forEach(function (p) {
        p.x = p.x + dx;
        p.y = p.y + dy;
    });
}

function intersectRect(node, point) {
    var x = node.x;
    var y = node.y;
    var dx = point.x - x;
    var dy = point.y - y;
    var w = $("#" + node.customId).attr('width') / 2;
    var h = $("#" + node.customId).attr('height') / 2;
    var sx = 0,
        sy = 0;
    if (Math.abs(dy) * w > Math.abs(dx) * h) {
        if (dy < 0) {
            h = -h;
        }
        sx = dy === 0 ? 0 : h * dx / dy;
        sy = h;
    } else {
        if (dx < 0) {
            w = -w;
        }
        sx = w;
        sy = dx === 0 ? 0 : w * dy / dx;
    }
    return {
        x: x + sx,
        y: y + sy
    };
}

function calcPoints(e, g) {
    const edge = g.edge(e.v, e.w);
    const tail = g.node(e.v);
    const head = g.node(e.w);
    const points = edge.points.slice(1, edge.points.length - 1);

    points.unshift(intersectRect(tail, points[0]));
    points.push(intersectRect(head, points[points.length - 1]));

    return d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        })
        .curve(d3.curveBasis)(points);
}

function init() {
    initialState();

    document.getElementById("init").addEventListener("click", initialState);

    document.getElementById("more").addEventListener("click", expandMore);
}

init();