"use client";

import { data } from "./data-helper";

import { scaleLinear, scaleBand } from "@visx/scale";

function Chart() {
  const width = 220;
  const height = 240;

  // padding
  const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 30,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: data.map((d) => d.x),
    range: [0, innerWidth],
    padding: 0.2,
  });

  const yMax = Math.max(...data.map((d) => d.y));

  const yScale = scaleLinear({
    domain: [0, yMax],
    nice: true,
    range: [innerHeight, 0],
  });

  return (
    <svg width={width} height={height} className="rotate-90">
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* --- Y AXIS --- */}
        <line
          x1={0}
          x2={0}
          y1={0}
          y2={innerHeight}
          stroke="currentColor"
          strokeWidth={0.25}
          opacity={0.5}
        />
        <line
          x1={innerWidth}
          x2={innerWidth}
          y1={0}
          y2={innerHeight}
          stroke="currentColor"
          strokeWidth={0.25}
          opacity={0.5}
        />

        {yScale
          .ticks(9)
          .filter((t) => t > 0)
          .map((t) => (
            <g key={t}>
              <line
                x1={-4}
                x2={innerWidth}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="currentColor"
                strokeDasharray="0.25 0.5"
                strokeWidth={0.25}
                opacity={0.5}
              />

              <text
                x={-6}
                y={yScale(t)}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(-90 ${-6} ${yScale(t)})`}
                style={{ fontSize: 4, fontFamily: "monospace" }}
                fill="currentColor"
                opacity={0.5}
              >
                {t}k
              </text>
            </g>
          ))}

        {/* --- X AXIS --- */}
        <line
          x1={0}
          x2={innerWidth}
          y1={innerHeight}
          y2={innerHeight}
          stroke="currentColor"
          strokeWidth={0.25}
          opacity={0.5}
        />

        {data.map((d, i) => {
          const x = (xScale(d.x) ?? 0) + xScale.bandwidth() / 2;
          return (
            <g key={d.x}>
              <line
                x1={x}
                x2={x}
                y1={innerHeight}
                y2={innerHeight + 2}
                stroke="currentColor"
                strokeWidth={0.5}
                opacity={0.75}
              />
              {/* label every 5 ticks */}
              {i % 1 === 0 && (
                <g>
                  <text
                    x={x}
                    y={innerHeight + 4}
                    textAnchor="end"
                    dominantBaseline="middle"
                    transform={`rotate(-90 ${x} ${innerHeight + 4})`}
                    style={{ fontSize: 4, fontFamily: "monospace" }}
                    fill="currentColor"
                    opacity={0.5}
                  >
                    {d.x + 1}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* --- DATA --- */}
        {data.map((d) => {
          const x = (xScale(d.x) ?? 0) + xScale.bandwidth() / 2;
          const yBottom = innerHeight;
          const yTop = yScale(d.y);

          return (
            <g key={d.x}>
              <line
                x1={x}
                y1={yBottom}
                x2={x}
                y2={yTop}
                stroke="currentColor"
                strokeWidth={0.5}
                opacity={0.75}
              />
              <line
                x1={x - 0.5}
                x2={x + 0.5}
                y1={yTop}
                y2={yTop}
                stroke="currentColor"
                strokeWidth={0.5}
                opacity={0.75}
              />

              {/*
              <rect
                x={x - innerWidth / 48}
                y={yTop-1}
                width={innerWidth / 24 - 0.5}
                height={yBottom - yTop}
                fill="currentColor"
                opacity={1}
              />
               */}

              {/* --- LABELING --- */}
              <text
                x={x}
                y={yTop - 3}
                textAnchor="start"
                dominantBaseline="middle"
                fill="currentColor"
                opacity={0.75}
                transform={`rotate(-90 ${x} ${yTop - 3})`}
                style={{ fontSize: 4, fontFamily: "sans-serif" }}
              >
                {new Intl.NumberFormat("en-US").format(Math.round(d.y * 1000))}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export { Chart };
