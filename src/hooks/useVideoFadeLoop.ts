import { useEffect, RefObject } from "react";

export function useVideoFadeLoop(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.style.opacity = "1";

    const handlePlay = () => {
      video.style.opacity = "1";
    };

    video.addEventListener("playing", handlePlay);
    video.addEventListener("canplay", handlePlay);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.style.opacity = "1";
        })
        .catch((err) => {
          console.warn("Autoplay video error:", err);
          video.style.opacity = "1";
        });
    }

    return () => {
      video.removeEventListener("playing", handlePlay);
      video.removeEventListener("canplay", handlePlay);
    };
  }, [videoRef]);
}
