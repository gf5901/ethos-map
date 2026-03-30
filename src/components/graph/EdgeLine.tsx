"use client";

import { BaseEdge, type EdgeProps, getBezierPath } from "@xyflow/react";

type EdgeData = { edgeType: string; strength: string };

export function EdgeLine(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } =
    props;
  const data = props.data as EdgeData | undefined;
  const strength = data?.strength ?? "moderate";

  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeWidth = strength === "strong" ? 3 : strength === "moderate" ? 2 : 1.5;
  const strokeDasharray = strength === "weak" ? "6 4" : undefined;

  return (
    <BaseEdge
      path={path}
      style={{
        ...style,
        strokeWidth,
        strokeDasharray,
        stroke: "var(--edge-stroke, #64748b)",
      }}
    />
  );
}
