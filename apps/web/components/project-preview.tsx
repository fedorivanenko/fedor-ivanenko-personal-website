"use client";

import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";

import styles from "./project-preview.module.css";

type ProjectPreviewProps = {
  className?: string;
  label: string;
  poster: string;
  src: string;
};

export function ProjectPreview({
  className,
  label,
  poster,
  src,
}: ProjectPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  }

  function handleEnded() {
    const video = videoRef.current;

    if (video) video.currentTime = 0;
    setIsPlaying(false);
  }

  return (
    <div className={[styles.preview, className].filter(Boolean).join(" ")}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        aria-label={label}
        muted
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />
      <button
        className={styles.button}
        type="button"
        aria-label={`${isPlaying ? "Pause" : "Play"} ${label}`}
        onClick={togglePlayback}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}
