"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";
import { toast } from "sonner";

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

interface ActiveShow {
  id: number;
  name: string;
  slides_data: Slide[];
  start_time: string | null;
  finish_time: string | null;
  content?: { id: number; name: string; type: string; file_url: string } | null;
}

export default function DisplayPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [activeShowName, setActiveShowName] = useState<string | null>(null);
  const [nextShowStart, setNextShowStart] = useState<string | null>(null);
  const currentSourceRef = useRef<string | null>(null);
  const hasAlertedRef = useRef<boolean>(false);

  const currentSlide = slides.length > 0 ? (slides[currentSlideIndex] || slides[0]) : null;

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  const fetchActiveShow = useCallback(async () => {
    try {
      const res = await fetch("/api/shows/active");
      const data = await res.json();

      const manual = data.manualPresent ?? null;
      const current: ActiveShow | null = data.currentShow ?? null;
      const next: ActiveShow | null = data.nextShow ?? null;

      let newSlides: Slide[] = [];
      let newName: string | null = null;
      let sourceId: string | null = null;

      if (manual && manual.slides_data && manual.slides_data.length > 0) {
        newSlides = manual.slides_data;
        newName = manual.show_name || "Manual Present";
        sourceId = `manual-${manual.started_at}`;
      } else if (current && current.slides_data && current.slides_data.length > 0) {
        newSlides = current.slides_data;
        newName = current.name;
        sourceId = `show-${current.id}`;
      }

      if (sourceId !== currentSourceRef.current) {
        setSlides(newSlides);
        setCurrentSlideIndex(0);
        setActiveShowName(newName);
        currentSourceRef.current = sourceId;
        hasAlertedRef.current = false;
      }

      if (newSlides.length === 0 && !hasAlertedRef.current) {
        hasAlertedRef.current = true;
        const prefs = JSON.parse(localStorage.getItem("slideflow_notifications") || "{}");
        if (prefs.presentationAlerts !== false) {
          toast.warning("Presentation Alert", {
            description: "No active show detected for display.",
            duration: 5000,
          });
        }
      }

      setNextShowStart(next?.start_time ?? null);
    } catch (err) {
      console.error("Failed to fetch active shows:", err);
      if (!hasAlertedRef.current) {
        hasAlertedRef.current = true;
        const prefs = JSON.parse(localStorage.getItem("slideflow_notifications") || "{}");
        if (prefs.presentationAlerts !== false) {
          toast.error("Presentation Alert", {
            description: "Connection to server failed.",
            duration: 5000,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveShow();
  }, [fetchActiveShow]);

  useEffect(() => {
    const interval = setInterval(fetchActiveShow, 5_000);
    return () => clearInterval(interval);
  }, [fetchActiveShow]);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1 || !currentSlide) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, currentSlide.duration * 1000);

    return () => clearInterval(timer);
  }, [currentSlideIndex, slides.length, currentSlide?.duration, isPlaying]);

  useEffect(() => {
    const reloadTimer = setInterval(() => {
      window.location.reload();
    }, 300000);

    return () => clearInterval(reloadTimer);
  }, []);

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

      {currentSlide ? (
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
                fontFamily: `${element.style.fontFamily || 'Arial'}, var(--font-emoji), sans-serif`,
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
                <span className="w-full" style={{ textAlign: element.style.textAlign, whiteSpace: "pre-wrap" }}>
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
      ) : (

        <div className="w-full h-full bg-black" />
      )}


      <>

        <div
          className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <div className="text-white/80 text-sm">
            <div>Slide {currentSlideIndex + 1} of {slides.length}</div>
            {activeShowName && (
              <div className="text-white/60 text-xs mt-0.5">
                📅 {activeShowName}
              </div>
            )}
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


        <div
          className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-16 w-16 pointer-events-auto"
            onClick={goToPreviousSlide}
            disabled={slides.length <= 1}
          >
            <ChevronLeft className="h-10 w-10" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 h-16 w-16 pointer-events-auto"
            onClick={goToNextSlide}
            disabled={slides.length <= 1}
          >
            <ChevronRight className="h-10 w-10" />
          </Button>
        </div>


        <div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
          style={{
            opacity: showControls ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: showControls ? 'auto' : 'none',
          }}
        >
          <div className="flex items-center justify-between">

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


        </div>
      </>


      {slides.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#10161a] absolute inset-0 z-50">
          <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" className="w-[300px] md:w-[500px] opacity-90 mb-6">
            <g transform="translate(20, 20)">
              <circle cx="80" cy="35" r="22" fill="#459cca" />
              <path d="M 35 100 A 25 25 0 0 1 60 75 Q 80 95 100 75 A 25 25 0 0 1 125 100 A 25 25 0 0 1 100 125 Q 80 115 60 125 A 25 25 0 0 1 35 100 Z" fill="#8c9094" />
              <path d="M 60 75 Q 80 95 100 75 Q 80 65 60 75 Z" fill="#459cca" />
              <text x="160" y="65" fontFamily="Arial, Helvetica, sans-serif" fontSize="48" fill="#459cca" letterSpacing="2" fontWeight="500">STRATUS</text>
              <text x="160" y="115" fontFamily="Arial, Helvetica, sans-serif" fontSize="40" fill="#8c9094" letterSpacing="4" fontWeight="400">ADV</text>
              <line x1="260" y1="105" x2="450" y2="105" stroke="#8c9094" strokeWidth="2" />
            </g>
          </svg>
          <Button 
            className="mt-8 opacity-0 hover:opacity-100 transition-opacity absolute bottom-8 cursor-pointer z-50" 
            variant="outline"
            onClick={() => router.push("/dashboard/screens")}
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
