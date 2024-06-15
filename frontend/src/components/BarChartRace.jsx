import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import ApiData from "../data/ApiData";

const playAnimationFromProgress = async (
  svg,
  updateAxis,
  updateBars,
  updateLabels,
  updateTicker,
  updateProgressBar,
  setPlayProgress,
  keyFramesGlobal,
  playPaused,
  updateAnimation,
  progress
) => {
  if (progress <= 0.001) progress = 0;
  if (progress >= 0.995) progress = 1;
  const keyFramesIdx = Math.floor(progress * keyFramesGlobal.length);
  for (let i = keyFramesIdx; i < keyFramesGlobal.length && !playPaused; i++) {
    await updateAnimation(
      svg,
      updateAxis,
      updateBars,
      updateLabels,
      updateTicker,
      updateProgressBar,
      i
    );
    setPlayProgress(i / keyFramesGlobal.length);
  }
};

const BarChartRace = () => {
  const { theme } = useSelector((state) => state.theme);
  const [data, setData] = useState(null);
  const [names, setNames] = useState(null);
  const [categories, setCategories] = useState(null);
  const [keyFramesGlobal, setKeyFramesGlobal] = useState(null);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [playProgress, setPlayProgress] = useState(0);
  const [playPaused, setPlayPaused] = useState(false);
  const { newApiData } = ApiData();

  const svgRef = useRef();
  const controlRef = useRef();

  const topN = 15;
  const k = 10;
  const duration = 300;
  const margin = { top: 16, right: 6, bottom: 6, left: 0 };
  const barSize = 48;
  const height = margin.top + barSize * topN + margin.bottom;
  const width = 1000;
  const y = d3
    .scaleBand()
    .domain(d3.range(topN + 1))
    .rangeRound([margin.top, margin.top + barSize * (topN + 1 + 0.1)])
    .padding(0.1);
  const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);

  // useEffect(() => {
  //   const fetchJsonData = async () => {
  //     try {
  //       const res = await fetch(`/api/data/getdata`);
  //       const newData = await res.json();
  //       if (res.ok) {
  //         const modifiedData = newData.map((item) => ({
  //           date:
  //             item.published === ""
  //               ? new Date(item.added)
  //               : new Date(item.published),
  //           name: item.sector,
  //           value: item.intensity,
  //           category: item.region,
  //         }));
  //         setData(modifiedData);
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };

  //   fetchJsonData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await d3.csv("data.csv", d3.autoType);
      setData(data);
      const names = new Set(data.map((d) => d.name));
      setNames(names);
      const categories = new Set(data.map((d) => d.category));
      setCategories(categories);
      const dateValues = getDataValues(data);
      const keyFrames = getKeyFrames(dateValues, names);
      setKeyFramesGlobal(keyFrames);
      const nameFrames = getNameFrames(keyFrames);
      const [prev, next] = getPrevNext(nameFrames);
      setPrev(prev);
      setNext(next);
    };

    fetchData();
  }, [theme]);

  const drawBars = (svg) => {
    let bar = svg.append("g").attr("fill-opacity", 0.6).selectAll("rect");

    return ([date, data], transition) =>
      (bar = bar
        .data(data.slice(0, topN), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("fill", color())
              .attr("height", y.bandwidth())
              .attr("x", x(0))
              .attr("y", (d) => y((prev.get(d) || d).rank))
              .attr("width", (d) => x((prev.get(d) || d).value) - x(0)),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr("y", (d) => y((next.get(d) || d).rank))
              .attr("width", (d) => x((next.get(d) || d).value) - x(0))
        )
        .call((bar) =>
          bar
            .transition(transition)
            .attr("y", (d) => y(d.rank))
            .attr("width", (d) => x(d.value) - x(0))
        ));
  };

  const drawLabels = (svg) => {
    let label = svg
      .append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .attr("fill", theme === "light" ? "black" : "white")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .selectAll("text");

    return ([date, data], transition) =>
      (label = label
        .data(data.slice(0, topN), (d) => d.name)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr(
                "transform",
                (d) =>
                  `translate(${x((prev.get(d) || d).value)},${y(
                    (prev.get(d) || d).rank
                  )})`
              )
              .attr("y", y.bandwidth() / 2)
              .attr("x", -6)
              .attr("dy", "-0.25em")
              .text((d) => d.name)
              .call((text) =>
                text
                  .append("tspan")
                  .attr("fill-opacity", 0.7)
                  .attr("font-weight", "normal")
                  .attr("x", -6)
                  .attr("dy", "1.15em")
              ),
          (update) => update,
          (exit) =>
            exit
              .transition(transition)
              .remove()
              .attr(
                "transform",
                (d) =>
                  `translate(${x((next.get(d) || d).value)},${y(
                    (next.get(d) || d).rank
                  )})`
              )
              .call((g) =>
                g
                  .select("tspan")
                  .tween("text", (d) =>
                    textTween(
                      (prev.get(d) || d).value,
                      (next.get(d) || d).value
                    )
                  )
              )
        )
        .call((bar) =>
          bar
            .transition(transition)
            .attr("transform", (d) => `translate(${x(d.value)},${y(d.rank)})`)
            .call((g) =>
              g
                .select("tspan")
                .tween("text", (d) =>
                  textTween((prev.get(d) || d).value, d.value)
                )
            )
        ));
  };

  const [barWidth, setBarWidth] = useState(800);
  const [barHeight, setBarHeight] = useState(22);
  const [handleRadius, setHandleRadius] = useState(barHeight / 2 - 2);
  const [minPosition, setMinPosition] = useState(handleRadius + 2);
  const [maxPosition, setMaxPosition] = useState(barWidth - minPosition);
  const [positionRange, setPositionRange] = useState(maxPosition - minPosition);
  var barSvg = d3
    .select("#control")
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight);

  const progressBar = barSvg
    .append("rect")
    .attr("width", minPosition)
    .attr("height", 8)
    .attr("x", 0)
    .attr("y", barHeight / 2 - 4)
    .attr("rx", 4)
    .attr("fill", "#45b69c");

  const handle = barSvg
    .append("circle")
    .attr("r", handleRadius)
    .attr("cx", minPosition)
    .attr("cy", barHeight / 2)
    .attr("fill", "#21d19f")
    .style("cursor", "pointer")
    // on drag & drop
    .call(d3.drag().on("drag", dragged).on("end", dragEnded))
    // on mouse over
    .on("mouseover", function () {
      // enlarge the handle
      d3.select(this).attr("r", handleRadius + 2);
    })
    // on mouse out
    .on("mouseout", function () {
      // shrink the handle
      d3.select(this).attr("r", handleRadius);
    });

  const progressToPosition = (progress) => {
    return progress * positionRange + minPosition;
  };

  const positionToProgress = (position) => {
    return (position - minPosition) / positionRange;
  };

  const boundPosition = (position) => {
    return Math.max(minPosition, Math.min(maxPosition, position));
  };

  const updateProgressBar = () => {
    const position = progressToPosition(playProgress);
    handle.attr("cx", position);
    progressBar.attr("width", position);
  };
  function dragged(event) {
    console.log("dragged: ", event);
    const position = boundPosition(event.x);
    handle.attr("cx", position);
    progressBar.attr("width", position);
    setPlayPaused(true);
    playButton.text(playText);
  }

  function dragEnded(event) {
    console.log("dragEnded: ", event);
    const position = boundPosition(event.x);
    handle.attr("cx", position);
    progressBar.attr("width", position);
    let playProgress = positionToProgress(position);
    console.log("playProgress: ", (playProgress * 100).toFixed(2) + "%");
    updateAnimationByProgress(
      svg,
      updateAxis,
      updateBars,
      updateLabels,
      updateTicker,
      updateProgressBar,
      playProgress
    );
  }

  const getDataValues = (data) => {
    return Array.from(
      d3.rollup(
        data,
        ([d]) => d.value,
        (d) => +d.date,
        (d) => d.name
      )
    )
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => d3.ascending(a, b));
  };

  const rank = (value, names) => {
    const data = Array.from(names, (name) => ({ name, value: value(name) }));
    data.sort((a, b) => d3.descending(a.value, b.value));
    for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(topN, i);
    return data;
  };

  const getKeyFrames = (dateValues, names) => {
    if (!dateValues || !names) {
      console.error("dateValues or names is null or undefined");
      return [];
    }

    const keyframes = [];
    let okb, ob;

    for (const [[ka, a], [kb, b]] of d3.pairs(dateValues)) {
      for (let i = 0; i < k; ++i) {
        const t = i / k;
        keyframes.push([
          new Date(ka * (1 - t) + kb * t),
          rank((name) => {
            const aVal = a.get(name) || 0;
            const bVal = b.get(name) || 0;
            return aVal * (1 - t) + bVal * t;
          }, names),
        ]);
        okb = kb;
        ob = b;
      }
    }
    console.log(ob);
    keyframes.push([new Date(okb), rank((name) => ob.get(name) || 0, names)]);
    return keyframes;
  };

  const getNameFrames = (keyFrames) => {
    return d3.groups(
      keyFrames.flatMap(([, data]) => data),
      (d) => d.name
    );
  };

  const getPrevNext = (nameFrames) => {
    const prev = new Map(
      nameFrames.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a]))
    );
    const next = new Map(nameFrames.flatMap(([, data]) => d3.pairs(data)));
    return [prev, next];
  };
  const getColorByCategory = (category) => {
    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    scale.domain(Array.from(categories));
    return scale(category);
  };

  useEffect(() => {
    if (!data || !keyFramesGlobal || !prev || !next) return;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    const updateBars = drawBars(svg);
    const updateLabels = drawLabels(svg);
    const updateAxis = drawAxis(svg);
    const updateTicker = drawTicker(svg);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${height - 550})`);

    const control = d3.select(controlRef.current);
    const playButton = control.select("#playButton");
    const progressBar = control.select("#progressBar");
    const updateAnimation = async (
      svg,
      updateAxis,
      updateBars,
      updateLabels,
      updateTicker,
      updateProgressBar,
      keyFramesIdx
    ) => {
      const keyframe = keyFramesGlobal[keyFramesIdx];
      setPlayProgress(keyFramesIdx / keyFramesGlobal.length);
      updateProgressBar(handle, progressBar);

      const transition = svg
        .transition()
        .duration(duration)
        .ease(d3.easeLinear);

      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);

      await transition.end();
    };

    const legendItems = legend
      .selectAll("g")
      .data(categories)
      .join("g")
      .attr("transform", (d, i) => `translate(-10, ${i * 23})`);

    legendItems
      .append("rect")
      .attr("x", 0)
      .attr("y", -60)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => getColorByCategory(d));

    legendItems
      .append("text")
      .attr("x", 20)
      .attr("y", -56)
      .attr("dy", "0.32em")
      .text((d) => d)
      .style("fill", "grey")
      .style("font-size", "1em")
      .style("font-weight", "regular");

    playAnimationFromProgress(
      svg,
      updateAxis,
      updateBars,
      updateLabels,
      updateTicker,
      updateProgressBar,
      setPlayProgress,
      keyFramesGlobal,
      playPaused,
      updateAnimation,
      0
    );

    playButton.on("click", function () {
      if (this.textContent === " Play ") {
        this.textContent = "Pause";
        setPlayPaused(false);
        playAnimationFromProgress(
          svg,
          updateAxis,
          updateBars,
          updateLabels,
          updateTicker,
          updateProgressBar,
          setPlayProgress,
          keyFramesGlobal,
          playPaused,
          updateAnimation,
          playProgress
        );
      } else {
        this.textContent = " Play ";
        setPlayPaused(true);
      }
    });

    const updateAnimationByProgress = async (
      svg,
      updateAxis,
      updateBars,
      updateLabels,
      updateTicker,
      updateProgressBar,
      progress
    ) => {
      if (progress <= 0.001) progress = 0;
      if (progress >= 0.995) progress = 1;
      const keyFramesIdx = Math.floor(progress * keyFramesGlobal.length);
      updateAnimation(
        svg,
        updateAxis,
        updateBars,
        updateLabels,
        updateTicker,
        updateProgressBar,
        keyFramesIdx
      );
    };

    const drag = d3
      .drag()
      .on("start.interrupt", function () {
        control.interrupt();
      })
      .on("start drag", function (event) {
        const minPosition = 12;
        const maxPosition = 788;
        const positionRange = maxPosition - minPosition;
        let position = event.x;

        if (position < minPosition) {
          position = minPosition;
        } else if (position > maxPosition) {
          position = maxPosition;
        }

        const progress = (position - minPosition) / positionRange;

        setPlayPaused(true);
        playButton.text(" Play ");
        updateAnimationByProgress(
          svg,
          updateAxis,
          updateBars,
          updateLabels,
          updateTicker,
          updateProgressBar,
          progress
        );
        handle.attr("cx", position);
        progressBar.attr("width", position);
      });

    handle.call(drag);
  }, [data, keyFramesGlobal, prev, next, theme]);

  const color = () => {
    const scale = d3.scaleOrdinal(d3.schemeTableau10);
    if (data.some((d) => d.category !== undefined)) {
      const categoryByName = new Map(data.map((d) => [d.name, d.category]));
      scale.domain(Array.from(categoryByName.values()));
      return (d) => scale(categoryByName.get(d.name));
    }
    return (d) => scale(d.name);
  };

  const textTween = (a, b) => {
    const i = d3.interpolateNumber(a, b);
    return function (t) {
      this.textContent = d3.format(",d")(i(t));
    };
  };

  const drawAxis = (svg) => {
    const g = svg.append("g").attr("transform", `translate(0,${margin.top})`);

    const axis = d3
      .axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (topN + y.padding()));

    return (_, transition) => {
      g.transition(transition).call(axis);
      g.select(".tick:first-of-type text").remove();
      g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
      g.select(".domain").remove();
    };
  };

  const drawTicker = (svg) => {
    const now = svg
      .append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("fill", theme === "light" ? "black" : "white")
      .style("font-size", "2em")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (topN - 0.45))
      .attr("dy", "0.32em")
      .text(d3.utcFormat("%B %Y")(keyFramesGlobal[0][0]));

    return ([date], transition) => {
      transition.end().then(() => {
        now.text(d3.utcFormat("%B %Y")(date));
      });
    };
  };
  return (
    <>
      <div className='flex justify-around items-center w-full gap-2'>
        <div className='flex flex-col items-center text-blue-600 text-xl font-bold'>
          <FaArrowUpLong className='h-7 w-7' />
          <span>S</span>
          <span>E</span>
          <span>C</span>
          <span>T</span>
          <span>O</span>
          <span>R</span>
        </div>
        <div>
          <h3 className='text-blue-600 text-xl text-center mt-5'>
            Comparing Intensity of Sectors, Regions, and Years
          </h3>
          <svg ref={svgRef} className='mt-5 min-w-full w-[90vw]'></svg>
          {/* <div ref={controlRef} id='control' className='flex items-center'>
        <button id='playButton'> Play </button>
        <svg id='progress' width='800' height='50'>
          <rect
            id='progressBarBackground'
            width='800'
            height='12'
            rx='6'
            ry='6'
            y='20'
            fill='#e0e0e0'
          />
          <rect
            id='progressBar'
            width='400'
            height='12'
            rx='6'
            ry='6'
            y='20'
            fill='#4CAF50'
          />
          <circle id='handle' cx='12' cy='26' r='10' fill='#4CAF50' />
        </svg>
      </div> */}
          <div className='flex justify-center items-center text-xl font-bold text-center'>
            <h3 className='text-blue-600 tracking-widest uppercase'>
              intensity
            </h3>
            <MdArrowRightAlt className='h-10 w-10 mt-1 text-blue-600' />
          </div>
        </div>
      </div>
    </>
  );
};

export default BarChartRace;
