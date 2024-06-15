// src/BarChart.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, dataKey }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 1600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    svg.attr("viewBox", [0, 0, width, height]);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.topic))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[dataKey])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(dataKey)
        );

    svg.selectAll(".bar").remove();
    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();

    svg
      .append("g")
      .attr("class", "bars")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.topic))
      .attr("y", (d) => y(d[dataKey]))
      .attr("height", (d) => y(0) - y(d[dataKey]))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue");

    svg.append("g").attr("class", "x-axis").call(xAxis);

    svg.append("g").attr("class", "y-axis").call(yAxis);
  }, [data, dataKey]);

  return <svg ref={svgRef} width='1600' height='400'></svg>;
};

export default BarChart;
