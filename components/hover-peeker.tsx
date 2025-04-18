'use client'

import * as React from 'react'
import { easeIn, motion, useScroll, useTransform } from 'motion/react'
import { useCreateElementObserver, useElementObserver } from '@/hooks/use-element-observer'
import { useWindowSize } from '@/hooks/use-window-observer'
//import { useCreateCollisionDetector } from '@/hooks/use-collision-detector'

export default function HoverPeeker() {

    const ref = React.useRef(null)

    useCreateElementObserver('hover-peeker',ref)
    const { start, end } = useElementObserver('hover-peeker')
    const dimensions = Math.abs(start.y-end.y)

    const { scrollYProgress } = useScroll();
    const windowHeight = useWindowSize().y 

    //TODO: get rid of useScroll
    const y = useTransform(scrollYProgress, [0, 1], [windowHeight*0.45, windowHeight - dimensions], {ease: easeIn});

    return (
        <motion.div 
            ref={ref}
            className='fixed w-full top-0 left-0 bg-red-500/0 h-[1px] z-50 pointer-events-none'
            style={{ y }}
            />
    )
}