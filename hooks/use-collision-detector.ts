'use client'

import * as React from 'react'
import { create } from 'zustand'

import { useElementObserver } from '@/hooks/use-element-observer'

interface Point {
  x: number;
  y: number;
}

interface ElementPoints {
  start: Point;
  end: Point;
}

interface DistanceMatrices {
  xDistances: number[][] | undefined;
  yDistances: number[][] | undefined;
}

const isValidPoint = (point: Point): boolean =>
  Number.isFinite(point.x) && Number.isFinite(point.y);

let prevXDistances: number[][] | undefined;
let prevYDistances: number[][] | undefined;

const calculateDistanceMatrices = (
  target: ElementPoints,
  activator: ElementPoints
): DistanceMatrices => {
  const points = [target.start, target.end, activator.start, activator.end];

  if (!points.every(isValidPoint)) {
    console.warn("Invalid points detected in distance calculation");
    return { xDistances: undefined, yDistances: undefined };
  }

  const THRESHOLD = 0.1;

  const getXDistance = (p1: Point, p2: Point): number => p2.x - p1.x;
  const getYDistance = (p1: Point, p2: Point): number => p2.y - p1.y;

  const tPoints = [target.start, target.end];
  const aPoints = [activator.start, activator.end];

  const newXDistances = Array(2)
    .fill(0)
    .map(() => Array(2));
  const newYDistances = Array(2)
    .fill(0)
    .map(() => Array(2));

  let hasSignificantChange = false;

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      newXDistances[i][j] = getXDistance(tPoints[i], aPoints[j]);
      newYDistances[i][j] = getYDistance(tPoints[i], aPoints[j]);

      if (prevXDistances && prevYDistances) {
        const xDiff = Math.abs(newXDistances[i][j] - prevXDistances[i][j]);
        const yDiff = Math.abs(newYDistances[i][j] - prevYDistances[i][j]);
        if (xDiff > THRESHOLD || yDiff > THRESHOLD) {
          hasSignificantChange = true;
        }
      }

      if (!Number.isFinite(newXDistances[i][j]) || !Number.isFinite(newYDistances[i][j])) {
        console.warn(`Invalid distance at [${i}][${j}]`, {
          x: newXDistances[i][j],
          y: newYDistances[i][j],
        });
      }
    }
  }

  if (prevXDistances && prevYDistances && !hasSignificantChange) {
    return { xDistances: prevXDistances, yDistances: prevYDistances };
  }

  prevXDistances = newXDistances;
  prevYDistances = newYDistances;

  return { xDistances: newXDistances, yDistances: newYDistances };
};

interface IDs {
  id: string;
  isChecked: boolean;
}

interface Distances {
  distances: Record<string, DistanceMatrices>;
  registeredIds: Record<string, IDs>;
  hasId: (id: string) => boolean;
  setDistances: (id: string, distances: DistanceMatrices) => void;
}


//TODO: fix the validation
const useCollisionDetectorStore = create<Distances>((set, get) => ({
  distances: {},
  registeredIds: {},
  hasId: (id: string) => id in get().registeredIds,
  setDistances: (id: string, distances: DistanceMatrices) => {
    const state = get();
    const existingId = state.registeredIds[id];

    if (existingId && !existingId.isChecked) {
      console.warn(`
        Provided id: ${id} is not unique. Detector is not created.\n
        If you create detector from the map function, use the key as props to extend id or use React.useId
      `);
      return;
    }

    set((state) => ({
      registeredIds: { ...state.registeredIds, [id]: { id, isChecked: true } },
      distances: { ...state.distances, [id]: distances },
    }));
  },
}));

/*
const useCollideCallback = () => {
  return null
}*/

const useCreateCollisionDetector = (
  id: string,
  staticTargetID: string | 'area',
  movingActivatorID: string | 'pointer',
) => {

  const setDistances = useCollisionDetectorStore(state => state.setDistances);
  
  const target = useElementObserver(staticTargetID);
  const activator = useElementObserver(movingActivatorID);
  const prevDistances = React.useRef<DistanceMatrices | null>(null);
  const updatePending = React.useRef(false);

  const updateDistances = React.useCallback(() => {
    if (target && activator) {
      const newDistances = calculateDistanceMatrices(target, activator);
      prevDistances.current = newDistances;
      setDistances(id, newDistances);
      updatePending.current = false;
    }
  }, [target, activator, id, setDistances]);

  const handleUpdateDistances = React.useCallback(() => {
    if (!updatePending.current) {
      updatePending.current = true;
      requestAnimationFrame(updateDistances);
    }
  }, [updateDistances]);

  React.useEffect(() => {
    if (!target || !activator) return;
    handleUpdateDistances();
    return () => {
      updatePending.current = false;
    };
  }, [target, activator, handleUpdateDistances]);

  return null
};

const useCollisionDetector = (id:string) => {
  const distances = useCollisionDetectorStore(state => state.distances[id]);
  return distances || {}
}

export { useCreateCollisionDetector, useCollisionDetector }