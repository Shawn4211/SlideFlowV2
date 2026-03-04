"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Shapes,
  Play,
  Save,
  Undo,
  Redo,
  Trash2,
  ArrowLeft,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Presentation,
  CalendarClock,
  Upload,
  Search,
  LayoutTemplate,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Video,
  Moon,
  Sun,
  Maximize2,
} from "lucide-react";
import Link from "next/link";

// Types
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
    textAlign?: "left" | "center" | "right" | "justify";
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
  backgroundImage?: string;
  duration: number;
}

interface HistoryState {
  slides: Slide[];
  currentSlideIndex: number;
}

type ResizeHandle = "nw" | "ne" | "sw" | "se" | null;

// Pexels API
const PEXELS_API_KEY = "L6w1BIl04BhqryxVmqQUz4OuVe0Ve4dIYBkQqpfYT2Dv0IXDiTxaxMMD";

// Font options
const FONTS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Impact",
  "Comic Sans MS",
  "Trebuchet MS",
  "Palatino",
];

// Dark mode colors - Light Gray Theme
const DARK_BG = "#4a5568"; // Lighter gray background
const DARK_BG_LIGHTER = "#5a6578"; // Even lighter for panels
const DARK_BG_DARKER = "#3a4558"; // Darker for inputs
const DARK_BORDER = "#6a7588"; // Light border for visibility
const DARK_TEXT = "#ffffff"; // Pure white for maximum visibility
const DARK_TEXT_MUTED = "#d1d5db"; // Light gray for secondary text
const ACCENT_COLOR = "#60a5fa"; // Brighter blue accent

export default function SlideEditorPage() {
  const params = useParams();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [slideName, setSlideName] = useState("Untitled Slide");
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [savedShowId, setSavedShowId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleStart, setScheduleStart] = useState("");
  const [scheduleFinish, setScheduleFinish] = useState("");
  const [zoom, setZoom] = useState(100);
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: params.slideId as string,
      name: "Slide 1",
      elements: [],
      backgroundColor: "#ffffff",
      duration: 10,
    },
  ]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Pexels search
  const [isPexelsOpen, setIsPexelsOpen] = useState(false);
  const [pexelsSearch, setPexelsSearch] = useState("");
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [isPexelsLoading, setIsPexelsLoading] = useState(false);

  // Templates
  // Templates (Placeholder for API integration)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  // const [templates, setTemplates] = useState<any[]>([]);
  // const [isTemplatesLoading, setIsTemplatesLoading] = useState(false);
  // const [templateGenres, setTemplateGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [templateSearch, setTemplateSearch] = useState("");

  const currentSlide = slides[currentSlideIndex];

  // Auth check — redirect if not logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/auth/login");
      } else {
        setIsAuthChecking(false);
      }
    });
  }, [router]);

  // Load content from Supabase when editing existing content
  useEffect(() => {
    const loadContent = async () => {
      const contentId = params.slideId as string;

      // Only attempt to load from DB if slideId is a valid numeric content ID
      const isNumericId = contentId && !isNaN(parseInt(contentId, 10));

      if (!isNumericId) {
        // Check if the screens page stored a name for this new show
        const storedName = localStorage.getItem("slideflow_new_show_name");
        if (storedName) {
          setSlideName(storedName);
          localStorage.removeItem("slideflow_new_show_name");
        }
        setIsLoadingContent(false);
        return;
      }

      try {
        // Try loading by show ID first (when navigating from screens page),
        // then fall back to loading by content ID
        let showJson: any = { show: null };

        const showByIdRes = await fetch(`/api/shows?id=${contentId}`);
        showJson = await showByIdRes.json();

        if (!showJson.show) {
          const showByContentRes = await fetch(`/api/shows?contentId=${contentId}`);
          showJson = await showByContentRes.json();
        }

        if (showJson.show) {
          // Load saved show data
          setSavedShowId(showJson.show.id);
          setSlideName(showJson.show.name || "Untitled Slide");
          if (showJson.show.slides_data && showJson.show.slides_data.length > 0) {
            setSlides(showJson.show.slides_data);
          }
          if (showJson.show.start_time) setScheduleStart(showJson.show.start_time.slice(0, 16));
          if (showJson.show.finish_time) setScheduleFinish(showJson.show.finish_time.slice(0, 16));
          setIsLoadingContent(false);
          return;
        }

        // No saved slide data - load from content table
        const { data, error } = await supabase
          .from("content")
          .select("*")
          .eq("id", contentId)
          .single();

        if (error || !data) {
          console.log("No content found for ID, starting with blank canvas");
          setIsLoadingContent(false);
          return;
        }

        // Set the slide name from the content
        setSlideName(data.name || "Untitled Slide");

        // Create an element based on the content type
        if (data.file_url && (data.type === "image" || data.type === "video")) {
          const contentElement: SlideElement = {
            id: Math.random().toString(36).substr(2, 9),
            type: data.type === "video" ? "video" : "image",
            x: 0,
            y: 0,
            width: 960,
            height: 540,
            src: data.file_url,
            style: {},
          };

          setSlides([{
            id: contentId,
            name: "Slide 1",
            elements: [contentElement],
            backgroundColor: "#ffffff",
            duration: data.duration || 10,
          }]);
        } else {
          // For documents or other types, show the name as text
          const textElement: SlideElement = {
            id: Math.random().toString(36).substr(2, 9),
            type: "text",
            x: 100,
            y: 200,
            width: 760,
            height: 140,
            content: data.name || "Content",
            style: {
              fontSize: 48,
              color: "#000000",
              fontFamily: "Arial",
              fontWeight: "bold",
              fontStyle: "normal",
              textAlign: "center",
              textDecoration: "none",
            },
          };

          setSlides([{
            id: contentId,
            name: "Slide 1",
            elements: [textElement],
            backgroundColor: "#ffffff",
            duration: 10,
          }]);
        }
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setIsLoadingContent(false);
      }
    };

    loadContent();
  }, [params.slideId]);

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("slideflow_darkmode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("slideflow_darkmode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Save to history
  const saveToHistory = useCallback((newSlides: Slide[], newIndex: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ slides: JSON.parse(JSON.stringify(newSlides)), currentSlideIndex: newIndex });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setSlides(JSON.parse(JSON.stringify(prevState.slides)));
      setCurrentSlideIndex(prevState.currentSlideIndex);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSlides(JSON.parse(JSON.stringify(nextState.slides)));
      setCurrentSlideIndex(nextState.currentSlideIndex);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Initialize history
  useEffect(() => {
    if (history.length === 0) {
      saveToHistory(slides, currentSlideIndex);
    }
  }, []);

  // Add text
  const addText = () => {
    const newElement: SlideElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "text",
      x: 100,
      y: 100,
      width: 300,
      height: 100,
      content: "Double click to edit text",
      style: {
        fontSize: 24,
        color: darkMode ? "#ffffff" : "#000000",
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        textAlign: "left",
        textDecoration: "none",
      },
    };
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    saveToHistory(newSlides, currentSlideIndex);
    setSelectedElement(newElement.id);
  };

  // Add shape
  const addShape = (shapeType: string) => {
    let style: any = {
      backgroundColor: shapeType === "circle" ? "#EF4444" : shapeType === "triangle" ? "#F59E0B" : "#3B82F6",
    };

    if (shapeType === "circle") {
      style.borderRadius = "50%";
    } else if (shapeType === "triangle") {
      style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
    }

    const newElement: SlideElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "shape",
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      style,
    };
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    saveToHistory(newSlides, currentSlideIndex);
    setSelectedElement(newElement.id);
  };

  // Add image
  const addImage = (src: string) => {
    const newElement: SlideElement = {
      id: Math.random().toString(36).substr(2, 9),
      type: "image",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      src,
      style: {},
    };
    const newSlides = [...slides];
    newSlides[currentSlideIndex].elements.push(newElement);
    setSlides(newSlides);
    saveToHistory(newSlides, currentSlideIndex);
    setSelectedElement(newElement.id);
  };

  // Search Pexels
  const searchPexels = async (query: string = pexelsSearch) => {
    const searchTerm = query.trim() || "nature";
    setIsPexelsLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=20`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );
      const data = await response.json();
      setPexelsImages(data.photos || []);
    } catch (error) {
      console.error("Error searching Pexels:", error);
    }
    setIsPexelsLoading(false);
  };

  // Load templates (Placeholder)
  const loadTemplates = async (genre?: string, search?: string) => {
    console.log("Template API integration pending...");
    // setIsTemplatesLoading(true);
    // ... implementation removed ...
    // setIsTemplatesLoading(false);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const isVideo = file.type.startsWith("video/");

        const newElement: SlideElement = {
          id: Math.random().toString(36).substr(2, 9),
          type: isVideo ? "video" : "image",
          x: 100,
          y: 100,
          width: isVideo ? 400 : 300,
          height: isVideo ? 225 : 200,
          src,
          style: {},
        };
        const newSlides = [...slides];
        newSlides[currentSlideIndex].elements.push(newElement);
        setSlides(newSlides);
        saveToHistory(newSlides, currentSlideIndex);
        setSelectedElement(newElement.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update element
  const updateElement = (id: string, updates: Partial<SlideElement>) => {
    const newSlides = [...slides];
    const element = newSlides[currentSlideIndex].elements.find((e) => e.id === id);
    if (element) {
      Object.assign(element, updates);
      setSlides(newSlides);
    }
  };

  // Update element style
  const updateElementStyle = (id: string, styleUpdates: Partial<SlideElement["style"]>) => {
    const newSlides = [...slides];
    const element = newSlides[currentSlideIndex].elements.find((e) => e.id === id);
    if (element) {
      element.style = { ...element.style, ...styleUpdates };
      setSlides(newSlides);
    }
  };

  // Delete element
  const deleteElement = () => {
    if (selectedElement) {
      const newSlides = [...slides];
      newSlides[currentSlideIndex].elements = newSlides[currentSlideIndex].elements.filter(
        (e) => e.id !== selectedElement
      );
      setSlides(newSlides);
      saveToHistory(newSlides, currentSlideIndex);
      setSelectedElement(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElement && !e.target?.toString().includes("Input") && !(e.target as HTMLElement).isContentEditable) {
          e.preventDefault();
          deleteElement();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElement, historyIndex, history]);

  // Mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    // Don't drag if clicking on resize handles
    if ((e.target as HTMLElement).dataset.resizeHandle) return;
    // Don't drag if we're actively editing this text element
    if (editingTextId === elementId) return;

    e.preventDefault();
    e.stopPropagation();
    setSelectedElement(elementId);
    // Exit text editing if we click a different element
    if (editingTextId && editingTextId !== elementId) {
      setEditingTextId(null);
    }
    setIsDragging(true);

    const element = currentSlide.elements.find((el) => el.id === elementId);
    if (element) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: (e.clientX - rect.left) / (zoom / 100) - element.x,
          y: (e.clientY - rect.top) / (zoom / 100) - element.y,
        });
      }
    }
  };

  // Mouse handlers for resizing
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedElement) return;

    const element = currentSlide.elements.find((el) => el.id === selectedElement);
    if (element) {
      setIsResizing(true);
      setResizeHandle(handle);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = (e.clientX - rect.left) / (zoom / 100) - dragOffset.x;
        const newY = (e.clientY - rect.top) / (zoom / 100) - dragOffset.y;
        updateElement(selectedElement, { x: newX, y: newY });
      }
    }

    if (isResizing && selectedElement && resizeHandle) {
      const element = currentSlide.elements.find((el) => el.id === selectedElement);
      if (element) {
        const deltaX = (e.clientX - resizeStart.x) / (zoom / 100);
        const deltaY = (e.clientY - resizeStart.y) / (zoom / 100);

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;

        if (resizeHandle.includes("e")) {
          newWidth = Math.max(50, resizeStart.width + deltaX);
        }
        if (resizeHandle.includes("w")) {
          newWidth = Math.max(50, resizeStart.width - deltaX);
        }
        if (resizeHandle.includes("s")) {
          newHeight = Math.max(50, resizeStart.height + deltaY);
        }
        if (resizeHandle.includes("n")) {
          newHeight = Math.max(50, resizeStart.height - deltaY);
        }

        updateElement(selectedElement, { width: newWidth, height: newHeight });
      }
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      saveToHistory(slides, currentSlideIndex);
    }
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      saveToHistory(slides, currentSlideIndex);
    }
  };

  // Add new slide
  const addNewSlide = () => {
    const newSlide: Slide = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Slide ${slides.length + 1}`,
      elements: [],
      backgroundColor: "#ffffff",
      duration: 10,
    };
    const newSlides = [...slides, newSlide];
    setSlides(newSlides);
    saveToHistory(newSlides, currentSlideIndex + 1);
    setCurrentSlideIndex(newSlides.length - 1);
  };

  // Duplicate slide
  const duplicateSlide = () => {
    const duplicated: Slide = {
      ...JSON.parse(JSON.stringify(currentSlide)),
      id: Math.random().toString(36).substr(2, 9),
      name: `${currentSlide.name} (Copy)`,
    };
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, duplicated);
    setSlides(newSlides);
    saveToHistory(newSlides, currentSlideIndex + 1);
    setCurrentSlideIndex(currentSlideIndex + 1);
  };

  // Delete slide
  const deleteSlide = () => {
    if (slides.length > 1) {
      const newSlides = slides.filter((_, i) => i !== currentSlideIndex);
      setSlides(newSlides);
      const newIndex = Math.min(currentSlideIndex, newSlides.length - 1);
      saveToHistory(newSlides, newIndex);
      setCurrentSlideIndex(newIndex);
    }
  };

  // Save show to database
  const saveSlide = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: savedShowId,
          contentId: params.slideId,
          name: slideName,
          slidesData: slides,
          startTime: scheduleStart || null,
          finishTime: scheduleFinish || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();
      if (data.show?.id) setSavedShowId(data.show.id);

      localStorage.setItem("slideflow_slides", JSON.stringify(slides));
      saveToHistory(slides, currentSlideIndex);

      setSaveMessage("Saved!");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveMessage("Save failed");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Schedule the show
  const scheduleShow = async () => {
    if (!scheduleStart || !scheduleFinish) return;
    setIsScheduleOpen(false);
    await saveSlide();
  };

  // Present slides
  const presentSlides = () => {
    localStorage.setItem("slideflow_slides", JSON.stringify(slides));
    window.open("/display", "_blank");
  };

  // Load default Pexels images when dialog opens
  useEffect(() => {
    if (isPexelsOpen && pexelsImages.length === 0) {
      searchPexels("business");
    }
  }, [isPexelsOpen]);

  // Note: slides are saved to the database via saveSlide().
  // localStorage is only used for the display/present feature.

  const selectedElementData = currentSlide.elements.find((e) => e.id === selectedElement);

  // Resize handles component
  const ResizeHandles = ({ elementId }: { elementId: string }) => (
    <>
      {/* Corner resize handles */}
      <div
        data-resize-handle="nw"
        className="absolute -top-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nw-resize z-20"
        onMouseDown={(e) => handleResizeStart(e, "nw")}
      />
      <div
        data-resize-handle="ne"
        className="absolute -top-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-ne-resize z-20"
        onMouseDown={(e) => handleResizeStart(e, "ne")}
      />
      <div
        data-resize-handle="sw"
        className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-sw-resize z-20"
        onMouseDown={(e) => handleResizeStart(e, "sw")}
      />
      <div
        data-resize-handle="se"
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-se-resize z-20"
        onMouseDown={(e) => handleResizeStart(e, "se")}
      />
    </>
  );

  if (isAuthChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`h-screen flex flex-col ${darkMode ? 'editor-dark' : ''}`}>
        {/* Dark Mode Theme Styles */}
        <style jsx global>{`
          .editor-dark {
            background-color: ${DARK_BG};
          }
          .editor-dark .editor-bg {
            background-color: ${DARK_BG};
          }
          .editor-dark .editor-panel {
            background-color: ${DARK_BG_LIGHTER};
            border-color: ${DARK_BORDER};
          }
          .editor-dark .editor-text {
            color: ${DARK_TEXT};
          }
          .editor-dark .editor-text-muted {
            color: ${DARK_TEXT_MUTED};
          }
          .editor-dark .editor-input {
            background-color: ${DARK_BG_DARKER};
            border-color: ${DARK_BORDER};
            color: ${DARK_TEXT};
          }
          .editor-dark .editor-button {
            background-color: ${DARK_BG_LIGHTER};
            border-color: ${DARK_TEXT};
            color: ${DARK_TEXT};
          }
          .editor-dark .editor-button:hover {
            background-color: ${DARK_BG};
            border-color: ${ACCENT_COLOR};
          }
          .editor-dark .editor-canvas {
            background-color: ${DARK_BG_DARKER};
          }
        `}</style>

        {/* Top Toolbar */}
        <header className={`h-14 border-b flex items-center justify-between px-4 ${darkMode
          ? 'editor-panel'
          : 'bg-card border-border'
          }`}>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/screens">
              <Button
                variant="ghost"
                size="icon"
                className={darkMode ? 'editor-button hover:bg-[#3a4156]' : ''}
              >
                <ArrowLeft className={`h-5 w-5 ${darkMode ? 'text-white' : ''}`} />
              </Button>
            </Link>
            <Input
              value={slideName}
              onChange={(e) => setSlideName(e.target.value)}
              className={`w-64 font-medium ${darkMode ? 'editor-input' : ''}`}
            />
            <span className={`text-sm ${darkMode ? 'editor-text-muted' : 'text-muted-foreground'}`}>
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 border-x ${darkMode ? 'border-[#6a7588]' : ''}`}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className={darkMode ? 'editor-button hover:bg-[#3a4156]' : ''}
              >
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>-</span>
              </Button>
              <span className={`text-sm w-16 text-center ${darkMode ? 'text-white' : ''}`}>{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className={darkMode ? 'editor-button hover:bg-[#3a4156]' : ''}
              >
                <span className={`text-xs font-bold ${darkMode ? 'text-white' : ''}`}>+</span>
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={presentSlides}
              className={darkMode ? 'editor-button hover:bg-[#3a4156] hover:border-blue-500' : ''}
            >
              <Presentation className={`mr-2 h-4 w-4 ${darkMode ? 'text-blue-400' : ''}`} />
              <span className={darkMode ? 'text-white' : ''}>Present</span>
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                className={`${darkMode ? 'editor-button hover:bg-[#3a4156] hover:border-green-500' : ''} ${scheduleStart ? 'border-green-500' : ''}`}
              >
                <CalendarClock className={`mr-2 h-4 w-4 ${scheduleStart ? 'text-green-500' : darkMode ? 'text-green-400' : ''}`} />
                <span className={darkMode ? 'text-white' : ''}>{scheduleStart ? 'Scheduled' : 'Schedule'}</span>
              </Button>
              {isScheduleOpen && (
                <div className={`absolute right-0 top-12 z-50 w-80 rounded-lg border p-4 shadow-xl ${darkMode ? 'bg-[#1e2433] border-[#2d3548] text-white' : 'bg-white border-gray-200'}`}>
                  <h3 className="font-semibold mb-3 text-sm">Schedule Show</h3>
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Start Time</label>
                      <input
                        type="datetime-local"
                        value={scheduleStart}
                        onChange={(e) => setScheduleStart(e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 text-sm ${darkMode ? 'bg-[#2a3042] border-[#3a4156] text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Finish Time</label>
                      <input
                        type="datetime-local"
                        value={scheduleFinish}
                        onChange={(e) => setScheduleFinish(e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 text-sm ${darkMode ? 'bg-[#2a3042] border-[#3a4156] text-white' : 'bg-white border-gray-300'}`}
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={scheduleShow}
                        disabled={!scheduleStart || !scheduleFinish}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {scheduleStart && scheduleFinish ? 'Save Schedule' : 'Set Times'}
                      </Button>
                      {scheduleStart && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setScheduleStart(""); setScheduleFinish(""); }}
                          className={`${darkMode ? 'editor-button hover:bg-[#3a4156]' : ''}`}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? 'editor-button hover:bg-[#3a4156]' : ''}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              onClick={saveSlide}
              disabled={isSaving}
              className={darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {saveMessage && (
              <span className={`text-sm font-medium ${saveMessage === "Saved!" ? "text-green-500" : "text-red-500"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </header>

        {/* Main Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Tools & Slides */}
          {showLeftPanel && (
            <div className={`w-72 border-r flex flex-col ${darkMode
              ? 'bg-gray-900/90 border-gray-700 city-lights'
              : 'bg-card'
              }`}>
              {/* Tools */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : ''}`}>Tools</h3>
                <div className="grid grid-cols-4 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTool === "select" ? "default" : "outline"}
                        size="icon"
                        onClick={() => setSelectedTool("select")}
                        className={darkMode ? 'border-white hover:bg-gray-800' : ''}
                      >
                        <MousePointer2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Select</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={addText} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <Type className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add Text</TooltipContent>
                  </Tooltip>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Upload Image/Video</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => { setIsPexelsOpen(true); setPexelsSearch(""); setPexelsImages([]); }} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Stock Images</TooltipContent>
                  </Tooltip>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowShapesMenu(!showShapesMenu)}
                          className={darkMode ? 'border-white hover:bg-gray-800' : ''}
                        >
                          <Shapes className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Shapes</TooltipContent>
                    </Tooltip>
                    {showShapesMenu && (
                      <div
                        className={`absolute left-0 top-10 z-50 rounded-lg border p-2 shadow-xl flex gap-1 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                          }`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-9 w-9 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                              onClick={() => { addShape("rect"); setShowShapesMenu(false); }}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rectangle</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-9 w-9 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                              onClick={() => { addShape("circle"); setShowShapesMenu(false); }}
                            >
                              <Circle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Circle</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-9 w-9 ${darkMode ? 'hover:bg-gray-700' : ''}`}
                              onClick={() => { addShape("triangle"); setShowShapesMenu(false); }}
                            >
                              <Triangle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Triangle</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => { setIsTemplatesOpen(true); loadTemplates(); }} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <LayoutTemplate className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Templates</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Actions */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : ''}`}>Actions</h3>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={deleteElement} disabled={!selectedElement} className={darkMode ? 'border-white hover:bg-gray-800' : ''}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete (Del)</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Slide Thumbnails */}
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>Slides</h3>
                    <Button variant="ghost" size="icon" className={`h-6 w-6 ${darkMode ? 'text-white hover:bg-gray-800' : ''}`} onClick={addNewSlide}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className={`relative aspect-video border-2 rounded cursor-pointer overflow-hidden ${index === currentSlideIndex
                          ? darkMode
                            ? 'border-blue-500'
                            : "border-primary"
                          : darkMode
                            ? 'border-[#3a4156]'
                            : "border-border"
                          }`}
                        style={{
                          backgroundColor: slide.backgroundColor,
                          boxShadow: index === currentSlideIndex && darkMode ? '0 0 0 2px #3b82f6' : undefined
                        }}
                        onClick={() => setCurrentSlideIndex(index)}
                      >
                        {/* Render slide elements as thumbnails */}
                        <div className="absolute inset-0" style={{ transform: "scale(0.25)", transformOrigin: "top left" }}>
                          <div className="relative w-[960px] h-[540px]">
                            {slide.backgroundImage && (
                              <img
                                src={slide.backgroundImage}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover z-0"
                              />
                            )}
                            {slide.elements.map((element) => (
                              <div
                                key={element.id}
                                className="absolute"
                                style={{
                                  left: element.x,
                                  top: element.y,
                                  width: element.width,
                                  height: element.height,
                                  ...element.style,
                                  fontSize: element.style.fontSize ? element.style.fontSize * 2 : undefined,
                                }}
                              >
                                {element.type === "text" && (
                                  <div className="w-full h-full overflow-hidden whitespace-nowrap text-ellipsis px-1">
                                    {element.content}
                                  </div>
                                )}
                                {element.type === "image" && element.src && (
                                  <img src={element.src} alt="" className="w-full h-full object-cover" />
                                )}
                                {element.type === "video" && (
                                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-white" />
                                  </div>
                                )}
                                {element.type === "shape" && <div className="w-full h-full" style={element.style} />}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Slide number badge */}
                        <div className="absolute top-1 left-1 z-10">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${darkMode ? 'bg-gray-800 text-white' : 'bg-background/90'
                            }`}>
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Slide Controls */}
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : ''}`}>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`} onClick={duplicateSlide}>
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm" className={`flex-1 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`} onClick={deleteSlide}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Left Panel */}
          <button
            className={`w-6 border-r flex items-center justify-center ${darkMode
              ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
              : 'bg-card hover:bg-accent'
              }`}
            onClick={() => setShowLeftPanel(!showLeftPanel)}
          >
            {showLeftPanel ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {/* Canvas Area */}
          <div
            className={`flex-1 flex items-center justify-center overflow-auto p-8 ${darkMode
              ? 'bg-gray-950 city-lights'
              : 'bg-muted/50'
              }`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              ref={canvasRef}
              className={`relative shadow-lg overflow-hidden ${darkMode ? 'editor-canvas' : ''}`}
              style={{
                width: `${960 * (zoom / 100)}px`,
                height: `${540 * (zoom / 100)}px`,
                backgroundColor: currentSlide.backgroundColor,
              }}
              onClick={() => { setSelectedElement(null); setEditingTextId(null); setShowShapesMenu(false); }}
            >
              {currentSlide.backgroundImage && (
                <img
                  src={currentSlide.backgroundImage}
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
                />
              )}
              {currentSlide.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute ${selectedElement === element.id
                    ? darkMode
                      ? 'ring-2 ring-offset-2'
                      : 'ring-2 ring-primary ring-offset-2'
                    : ''
                    }`}
                  style={{
                    left: `${element.x * (zoom / 100)}px`,
                    top: `${element.y * (zoom / 100)}px`,
                    width: `${element.width * (zoom / 100)}px`,
                    height: `${element.height * (zoom / 100)}px`,
                    fontSize: element.style.fontSize ? `${element.style.fontSize * (zoom / 100)}px` : undefined,
                    color: element.style.color,
                    fontFamily: element.style.fontFamily,
                    fontWeight: element.style.fontWeight,
                    fontStyle: element.style.fontStyle,
                    textAlign: element.style.textAlign as any,
                    textDecoration: element.style.textDecoration,
                    backgroundColor: element.type === "shape" ? element.style.backgroundColor : undefined,
                    borderRadius: element.style.borderRadius,
                    clipPath: element.style.clipPath,
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, element.id)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {element.type === "text" && (
                    <div
                      className={`w-full h-full flex items-start outline-none overflow-hidden ${editingTextId === element.id ? 'cursor-text' : 'cursor-grab'}`}
                      style={{
                        justifyContent: element.style.textAlign === "center" ? "center" : element.style.textAlign === "right" ? "flex-end" : "flex-start",
                        textDecoration: element.style.textDecoration,
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: "1.4",
                      }}
                      contentEditable={editingTextId === element.id}
                      suppressContentEditableWarning
                      onMouseDown={(e) => {
                        // Only stop propagation if we're in text editing mode
                        if (editingTextId === element.id) {
                          e.stopPropagation();
                        }
                        // Otherwise let it bubble up to the parent drag handler
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement(element.id);
                        setEditingTextId(element.id);
                      }}
                      onBlur={(e) => {
                        updateElement(element.id, { content: e.currentTarget.textContent || "" });
                        setEditingTextId(null);
                        saveToHistory(slides, currentSlideIndex);
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                  {element.type === "image" && element.src && (
                    <img
                      src={element.src}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                    />
                  )}
                  {element.type === "video" && element.src && (
                    <video
                      src={element.src}
                      className="w-full h-full object-cover pointer-events-none"
                      autoPlay
                      muted
                      loop
                    />
                  )}
                  {element.type === "shape" && <div className="w-full h-full" style={{ backgroundColor: element.style.backgroundColor }} />}

                  {/* Resize handles - only show when selected */}
                  {selectedElement === element.id && (
                    <ResizeHandles elementId={element.id} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Toggle Right Panel */}
          <button
            className={`w-6 border-l flex items-center justify-center ${darkMode
              ? 'bg-gray-900 border-gray-700 hover:bg-gray-800'
              : 'bg-card hover:bg-accent'
              }`}
            onClick={() => setShowRightPanel(!showRightPanel)}
          >
            {showRightPanel ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Right Sidebar - Properties */}
          {showRightPanel && (
            <div className={`w-72 border-l flex flex-col ${darkMode
              ? 'bg-gray-900/90 border-gray-700'
              : 'bg-card'
              }`}>
              <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : ''}`}>
                <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>Properties</h3>
              </div>

              <ScrollArea className="flex-1">
                {selectedElementData ? (
                  <div className="p-4 space-y-4">
                    {/* Position and Size - Auto-updating */}
                    <div>
                      <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Position & Size</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div>
                          <label className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-muted-foreground'}`}>X</label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData.x)}
                            onChange={(e) => updateElement(selectedElementData.id, { x: Number(e.target.value) })}
                            className={`h-7 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-muted-foreground'}`}>Y</label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData.y)}
                            onChange={(e) => updateElement(selectedElementData.id, { y: Number(e.target.value) })}
                            className={`h-7 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-muted-foreground'}`}>Width</label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData.width)}
                            onChange={(e) => updateElement(selectedElementData.id, { width: Number(e.target.value) })}
                            className={`h-7 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-muted-foreground'}`}>Height</label>
                          <Input
                            type="number"
                            value={Math.round(selectedElementData.height)}
                            onChange={(e) => updateElement(selectedElementData.id, { height: Number(e.target.value) })}
                            className={`h-7 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className={darkMode ? 'bg-gray-700' : ''} />

                    {/* Text Properties */}
                    {selectedElementData.type === "text" && (
                      <>
                        <div>
                          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Font Family</label>
                          <select
                            value={selectedElementData.style.fontFamily || "Arial"}
                            onChange={(e) => updateElementStyle(selectedElementData.id, { fontFamily: e.target.value })}
                            className={`w-full mt-1 p-2 border rounded text-sm ${darkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : ''
                              }`}
                          >
                            {FONTS.map((font) => (
                              <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Font Size</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Slider
                              value={[selectedElementData.style.fontSize || 24]}
                              min={8}
                              max={120}
                              step={1}
                              onValueChange={([value]) => updateElementStyle(selectedElementData.id, { fontSize: value })}
                              className="flex-1"
                            />
                            <span className={`text-xs w-10 ${darkMode ? 'text-white' : ''}`}>{selectedElementData.style.fontSize || 24}px</span>
                          </div>
                        </div>

                        <div>
                          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Text Color</label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              type="color"
                              value={selectedElementData.style.color || (darkMode ? "#ffffff" : "#000000")}
                              onChange={(e) => updateElementStyle(selectedElementData.id, { color: e.target.value })}
                              className="w-12 h-8 p-1"
                            />
                            <Input
                              type="text"
                              value={selectedElementData.style.color || (darkMode ? "#ffffff" : "#000000")}
                              onChange={(e) => updateElementStyle(selectedElementData.id, { color: e.target.value })}
                              className={`flex-1 h-8 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Text Style</label>
                          <div className="flex gap-1 mt-1">
                            <Button
                              variant={selectedElementData.style.fontWeight === "bold" ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { fontWeight: selectedElementData.style.fontWeight === "bold" ? "normal" : "bold" })}
                            >
                              <Bold className="h-3 w-3" />
                            </Button>
                            <Button
                              variant={selectedElementData.style.fontStyle === "italic" ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { fontStyle: selectedElementData.style.fontStyle === "italic" ? "normal" : "italic" })}
                            >
                              <Italic className="h-3 w-3" />
                            </Button>
                            <Button
                              variant={selectedElementData.style.textDecoration === "underline" ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { textDecoration: selectedElementData.style.textDecoration === "underline" ? "none" : "underline" })}
                            >
                              <Underline className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Alignment</label>
                          <div className="flex gap-1 mt-1">
                            <Button
                              variant={selectedElementData.style.textAlign === "left" || !selectedElementData.style.textAlign ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { textAlign: "left" })}
                            >
                              <AlignLeft className="h-3 w-3" />
                            </Button>
                            <Button
                              variant={selectedElementData.style.textAlign === "center" ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { textAlign: "center" })}
                            >
                              <AlignCenter className="h-3 w-3" />
                            </Button>
                            <Button
                              variant={selectedElementData.style.textAlign === "right" ? "default" : "outline"}
                              size="icon"
                              className={`h-8 w-8 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : ''}`}
                              onClick={() => updateElementStyle(selectedElementData.id, { textAlign: "right" })}
                            >
                              <AlignRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Separator className={darkMode ? 'bg-gray-700' : ''} />
                      </>
                    )}

                    {/* Shape Properties */}
                    {selectedElementData.type === "shape" && (
                      <div>
                        <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Background Color</label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={selectedElementData.style.backgroundColor || "#3B82F6"}
                            onChange={(e) => updateElementStyle(selectedElementData.id, { backgroundColor: e.target.value })}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            type="text"
                            value={selectedElementData.style.backgroundColor || "#3B82F6"}
                            onChange={(e) => updateElementStyle(selectedElementData.id, { backgroundColor: e.target.value })}
                            className={`flex-1 h-8 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Slide Duration</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[currentSlide.duration]}
                          max={60}
                          step={1}
                          onValueChange={([value]) => {
                            const newSlides = [...slides];
                            newSlides[currentSlideIndex].duration = value;
                            setSlides(newSlides);
                          }}
                          className="flex-1"
                        />
                        <span className={`text-sm w-12 ${darkMode ? 'text-white' : ''}`}>{currentSlide.duration}s</span>
                      </div>
                    </div>

                    <Separator className={darkMode ? 'bg-gray-700' : ''} />

                    <div>
                      <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Background Color</label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          type="color"
                          value={currentSlide.backgroundColor}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[currentSlideIndex].backgroundColor = e.target.value;
                            // Clear background image if color is explicitly set
                            newSlides[currentSlideIndex].backgroundImage = undefined;
                            setSlides(newSlides);
                          }}
                          className="w-12 h-8 p-1"
                        />
                        <Input
                          type="text"
                          value={currentSlide.backgroundColor}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[currentSlideIndex].backgroundColor = e.target.value;
                            // Clear background image if color is explicitly set
                            newSlides[currentSlideIndex].backgroundImage = undefined;
                            setSlides(newSlides);
                          }}
                          className={`flex-1 h-8 text-xs ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                        />
                      </div>
                    </div>

                    <Separator className={darkMode ? 'bg-gray-700' : ''} />

                    <div>
                      <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : ''}`}>Transition</label>
                      <select
                        className={`w-full mt-1 p-2 border rounded text-sm ${darkMode
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : ''
                          }`}
                        onChange={() => { }}
                      >
                        <option>None</option>
                        <option>Fade</option>
                        <option>Slide</option>
                        <option>Zoom</option>
                      </select>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Pexels Dialog */}
        <Dialog open={isPexelsOpen} onOpenChange={setIsPexelsOpen}>
          <DialogContent className={`max-w-4xl max-h-[80vh] ${darkMode ? 'bg-gray-900 border-gray-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className={darkMode ? 'text-white' : ''}>Stock Images</DialogTitle>
              <DialogDescription className={darkMode ? 'text-gray-400' : ''}>Search for free stock images from Pexels</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Search images..."
                value={pexelsSearch}
                onChange={(e) => setPexelsSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPexels()}
                className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
              />
              <Button onClick={() => searchPexels()} disabled={isPexelsLoading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <ScrollArea className="h-[400px]">
              {isPexelsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className={darkMode ? 'text-gray-400' : 'text-muted-foreground'}>Loading...</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {pexelsImages.map((photo) => (
                    <div
                      key={photo.id}
                      className={`aspect-video cursor-pointer hover:ring-2 hover:ring-blue-500 rounded overflow-hidden`}
                      onClick={() => {
                        addImage(photo.src.medium);
                        setIsPexelsOpen(false);
                      }}
                    >
                      <img
                        src={photo.src.small}
                        alt={photo.photographer}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Templates Dialog */}
        <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
          <DialogContent className={`max-w-5xl max-h-[85vh] ${darkMode ? 'bg-gray-900 border-gray-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className={darkMode ? 'text-white' : ''}>Templates</DialogTitle>
              <DialogDescription className={darkMode ? 'text-gray-400' : ''}>Browse templates via API (coming soon)</DialogDescription>
            </DialogHeader>

            {/* Search and Filter Bar */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                <Input
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => {
                    setTemplateSearch(e.target.value);
                    loadTemplates(selectedGenre, e.target.value);
                  }}
                  className={`pl-9 ${darkMode ? 'editor-input' : ''}`}
                />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  loadTemplates(e.target.value, templateSearch);
                }}
                className={`h-9 rounded-md border px-3 text-sm min-w-[160px] ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-input'
                  }`}
              >
                <option value="All">All Genres</option>
                {/* {templateGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))} */}
              </select>
            </div>

            <ScrollArea className="h-[500px]">
              {/* Template list removed. Pending API integration. */}
              <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <LayoutTemplate className={`h-12 w-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={darkMode ? 'text-gray-400' : 'text-muted-foreground'}>Templates will be loaded from external API.</p>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
