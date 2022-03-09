# Getting started with D3
- Learning about svg and canvas
- different shapes - rect, circle, line, path, text
- looping with d3 for a set of data

# Scales and axes

## Scales 
- Linear scales .scaleLinear().domain([0, 1000]).range([0, 200])
- Logarithmic scales .scaleLog().domain([0, 1000]).range([0, 200]).base(10)
- Time scales .scaleTime().domain([date, date]).range([0, 400])
- Ordinal scales .scaleOrdinal().domain([a, b, c, d]).range(d3.schemeCategory10)
- Band scales .scaleBand().domain([a, b, c, d]).range([0, 400]).paddingInner(0.3).paddingOuter(0.2)

## Axes
- .axisLeft.tickSize().tickSizeOuter().TickSizeInner().tickFormat(d3.format())
- .axisRight.tickValues([a, b, c, d])
- .axisTop
- .axisBottom


## Use min, max, extend, map with data for dynamic domain range values.

## Margin and groups

# Color scheme
- d3.schemeCategory10
- d3.schemeCategory20
- d3.schemeCategory20b
- d3.schemeCategory20c, etc
