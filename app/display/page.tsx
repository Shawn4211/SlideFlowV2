"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";

interface SlideElement {
  id: string;
  type: "text" | "image" | "shape" | "video";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  src?: string;
  style: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: "left" | "center" | "right";
    textDecoration?: string;
    borderRadius?: string;
    clipPath?: string;
  };
}

interface Slide {
  id: string;
  name: string;
  elements: SlideElement[];
  backgroundColor: string;
  duration: number;
}

// Default slides if none exist
const defaultSlides: Slide[] = [
  {
    id: "1",
    name: "Welcome Slide",
    elements: [
      {
        id: "1",
        type: "text",
        x: 100,
        y: 150,
        width: 760,
        height: 100,
        content: "Welcome to Our Digital Signage",
        style: {
          fontSize: 48,
          color: "#ffffff",
          fontFamily: "Arial",
          fontWeight: "bold",
          textAlign: "center",
        },
      },
    ],
    backgroundColor: "#4F46E5",
    duration: 10,
  },
];

export default function DisplayPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Auto-hide controls after mouse inactivity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Start the hide timer on mount
  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Load slides from localStorage on mount
  useEffect(() => {
    const savedSlides = localStorage.getItem("slideflow_slides");
    if (savedSlides) {
      try {
        const parsed = JSON.parse(savedSlides);
        if (parsed.length > 0) {
          setSlides(parsed);
        }
      } catch (e) {
        console.error("Error loading slides:", e);
      }
    }
  }, []);

  // Listen for slides update from editor
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSlides = localStorage.getItem("slideflow_slides");
      if (savedSlides) {
        try {
          const parsed = JSON.parse(savedSlides);
          if (parsed.length > 0) {
            setSlides(parsed);
          }
        } catch (e) {
          console.error("Error loading slides:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, currentSlide.duration * 1000);

    return () => clearInterval(timer);
  }, [currentSlideIndex, slides.length, currentSlide.duration, isPlaying]);

  // Auto-refresh page every 30 seconds to check for updates
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      const savedSlides = localStorage.getItem("slideflow_slides");
      if (savedSlides) {
        try {
          const parsed = JSON.parse(savedSlides);
          setSlides(parsed);
        } catch (e) {
          console.error("Error refreshing slides:", e);
        }
      }
    }, 30000);

    return () => clearInterval(refreshTimer);
  }, []);

  // Full page reload every 5 minutes
  useEffect(() => {
    const reloadTimer = setInterval(() => {
      window.location.reload();
    }, 300000);

    return () => clearInterval(reloadTimer);
  }, []);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPreviousSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "Escape") {
        e.preventDefault();
        exitPresentation();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlideIndex, slides.length, isPlaying]);

  const goToNextSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }
  }, [slides.length]);

  const goToPreviousSlide = useCallback(() => {
    if (slides.length > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  }, [slides.length]);

  const exitPresentation = () => {
    router.push("/dashboard/screens");
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden relative bg-black"
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={resetHideTimer}
    >
      {/* Slide Content */}
      <div
        className="w-full h-full relative"
        style={{ backgroundColor: currentSlide.backgroundColor }}
      >
        {currentSlide.elements.map((element) => (
          <div
            key={element.id}
            className="absolute"
            style={{
              left: `${(element.x / 960) * 100}%`,
              top: `${(element.y / 540) * 100}%`,
              width: `${(element.width / 960) * 100}%`,
              height: `${(element.height / 540) * 100}%`,
              fontSize: element.style.fontSize ? `${(element.style.fontSize / 960) * 100}vw` : undefined,
              color: element.style.color,
              fontFamily: element.style.fontFamily,
              fontWeight: element.style.fontWeight,
              fontStyle: element.style.fontStyle,
              textAlign: element.style.textAlign,
              textDecoration: element.style.textDecoration,
              backgroundColor: element.type === "shape" ? element.style.backgroundColor : undefined,
              borderRadius: element.style.borderRadius,
              clipPath: element.style.clipPath,
              display: "flex",
              alignItems: "center",
              justifyContent: element.style.textAlign === "center" ? "center" : element.style.textAlign === "right" ? "flex-end" : "flex-start",
            }}
          >
            {element.type === "text" && (
              <span className="w-full" style={{ textAlign: element.style.textAlign }}>
                {element.content}
              </span>
            )}
            {element.type === "image" && element.src && (
              <img
                src={element.src}
                alt=""
                className="w-full h-full object-contain"
              />
            )}
            {element.type === "video" && element.src && (
              <video
                src={element.src}
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
              />
            )}
            {element.type === "shape" && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: element.style.backgroundColor,
                  borderRadius: element.style.borderRadius,
                  clipPath: element.style.clipPath,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Controls Overlay */}
      <>
        {/* Top Bar */}
        <div
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <div className="text-white/80 text-sm">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={exitPresentation}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Controls */}
        <div
          className="absolute inset-0 flex items-center justify-between px-4"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-16 w-16"
            onClick={goToPreviousSlide}
            disabled={slides.length <= 1}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-16 w-16"
            onClick={goToNextSlide}
            disabled={slides.length <= 1}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
        </div>

        {/* Bottom Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Progress Bar */}
            <div className="flex-1 mx-4">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/60 transition-all duration-300"
                  style={{
                    width: `${((currentSlideIndex + 1) / slides.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Play/Pause Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="text-center mt-2 text-white/40 text-xs">
            Use ← → arrow keys to navigate • Space to pause • ESC to exit
          </div>
        </div>
      </>

      {/* No Slides Message */}
      {slides.length === 0 && (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-white/60">
            <h1 className="text-4xl font-bold mb-4">No Slides</h1>
            <p className="text-xl mb-6">Please add slides in the dashboard</p>
            <Button onClick={() => router.push("/dashboard/screens")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
