'use client'

import * as React from 'react'
//import { create } from 'zustand'

import { Metrics, useElementObserver } from '@/hooks/use-element-observer'
import { useRafThrottle } from '@/hooks/use-RAF-throttle'

interface Point {
    x: number;
    y: number;
  }
  
  interface ElementPoints {
    start: Point;
    mid: Point;
    end: Point;
  }
  
  interface DistanceMatrices {
    xDistances: number[][] | undefined;
    yDistances: number[][] | undefined;
  }
  
  const isValidPoint = (point: Point): boolean => {
    return typeof point.x === 'number' && 
           typeof point.y === 'number' && 
           Number.isFinite(point.x) && 
           Number.isFinite(point.y);
  };
  
  const calculateDistanceMatrices = (
    target: ElementPoints,
    activator: ElementPoints,
    precision: number = 1
  ): DistanceMatrices => {
    // Validate input points
    const points = [
        target.start, target.mid, target.end,
        activator.start, activator.mid, activator.end
    ];
    
    console.assert(!points.some(point => point === undefined), `One of the points is undefined`);
    
    if (!points.every(isValidPoint)) {
      console.warn('Invalid points detected in distance calculation');
      return {
        xDistances: undefined,
        yDistances: undefined
      };
    }
  
    const roundTo = (n: number): number => Math.round(n * precision) / precision;
  
    const transformPoint = (p: Point): Point => ({
      x: roundTo(p.x),
      y: roundTo(p.y)
    });
    
    const targetPoints = {
      start: transformPoint(target.start),
      midpoint: transformPoint(target.mid),
      end: transformPoint(target.end)
    };
    
    const activatorPoints = {
      start: transformPoint(activator.start),
      midpoint: transformPoint(activator.mid),
      end: transformPoint(activator.end)
    };
  
    const getXDistance = (p1: Point, p2: Point): number => roundTo(p2.x - p1.x);
    const getYDistance = (p1: Point, p2: Point): number => roundTo(p2.y - p1.y);
  
    const tPoints = [targetPoints.start, targetPoints.midpoint, targetPoints.end];
    const aPoints = [activatorPoints.start, activatorPoints.midpoint, activatorPoints.end];
  
    const xDistances = new Array(3).fill(0).map(() => new Array(3));
    const yDistances = new Array(3).fill(0).map(() => new Array(3));
  
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        xDistances[i][j] = getXDistance(tPoints[i], aPoints[j]);
        yDistances[i][j] = getYDistance(tPoints[i], aPoints[j]);
        
        if (!Number.isFinite(xDistances[i][j]) || !Number.isFinite(yDistances[i][j])) {
          console.warn(`Invalid distance calculated at [${i}][${j}]`, {
            x: xDistances[i][j],
            y: yDistances[i][j]
          });
        }
      }
    }
  
    return { xDistances, yDistances };
  };


const useCreateCollisionDetector = (
    staticTargetID : string | 'area', //static
    movingActivatorID : string | 'pointer', //active 
    //[margins]
) => {

    const [distances, setDistances] = React.useState<DistanceMatrices>({
        xDistances: undefined,
        yDistances: undefined
      });

    const prevDistances = React.useRef<DistanceMatrices>(undefined)

    React.useEffect(() => {
        prevDistances.current = distances;
    }, [distances]);

    const prevTarget = React.useRef<Metrics>(undefined)
    const prevActivator = React.useRef<Metrics>(undefined)

    const target = useElementObserver(staticTargetID)
    const activator = useElementObserver(movingActivatorID)

    //TODO: change to assertion
    //console.log(target, activator)

    React.useEffect(() => {
        prevTarget.current = target;
        prevActivator.current = activator
    }, [target, activator]);

    const updateDistances = React.useCallback(() => {
        if (target && activator) {
          const newDistances = calculateDistanceMatrices(target, activator);
          setDistances(newDistances);
        }
      }, [target, activator]);
      
      useRafThrottle(updateDistances, {
          fps: 60,
          enabled: Boolean(target !== prevTarget.current || activator !== prevActivator.current)
    });

    //TODO: creare an events watcher
    const [overlapY, setOverlapY] = React.useState<boolean | undefined>(undefined) // when [2][0] is negative [0][2] is positive

    React.useEffect(()=>{
        if (!distances.yDistances) return
        if (distances.yDistances[2][0] <=20 && distances.yDistances[0][2]>=-20) {
            setOverlapY(true)
        }
        else {
            setOverlapY(false)
        }
    },[distances.yDistances])

    return { distances, overlapY }
}

const useCollisionDetector = () => {
    return null
}

export { useCreateCollisionDetector, useCollisionDetector }