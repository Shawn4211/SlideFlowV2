"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Edit, Play, Copy, Trash2, MoreVertical, Presentation, Clock, Video, Moon, Sun, Search } from "lucide-react";

interface Show {
  id: number;
  name: string;
  content_id: number | null;
  slides_data: any[];
  start_time: string | null;
  finish_time: string | null;
  created_at: string;
  updated_at: string;
}

// Dark mode colors - Light Gray Theme
const DARK_BG = "#4a5568"; // Lighter gray background
const DARK_BG_LIGHTER = "#5a6578"; // Even lighter for panels
const DARK_BG_DARKER = "#3a4558"; // Darker for inputs
const DARK_BORDER = "#6a7588"; // Light border for visibility
const DARK_TEXT = "#ffffff"; // Pure white for maximum visibility
const DARK_TEXT_MUTED = "#d1d5db"; // Light gray for secondary text
const ACCENT_COLOR = "#60a5fa"; // Brighter blue accent

export default function ScreensPage() {
  const router = useRouter();
  const [shows, setShows] = useState<Show[]>([]);
  const [newSlideName, setNewSlideName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPresentDialogOpen, setIsPresentDialogOpen] = useState(false);
  const [presentSearch, setPresentSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

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

  // Load shows from database
  const fetchShows = async () => {
    try {
      const response = await fetch("/api/shows");
      const data = await response.json();
      if (data.shows) {
        setShows(data.shows);
      }
    } catch (error) {
      console.error("Error fetching shows:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleAddSlide = () => {
    if (!newSlideName.trim()) return;

    // Generate a temporary unique ID for the editor route
    const tempId = Math.random().toString(36).substr(2, 9);

    // Store the desired name so the editor can pick it up
    localStorage.setItem("slideflow_new_show_name", newSlideName);

    setNewSlideName("");
    setIsDialogOpen(false);

    // Navigate to editor with the temp ID (non-numeric, so editor treats it as new)
    router.push(`/editor/${tempId}`);
  };

  const handleEditSlide = (show: Show) => {
    // Navigate to editor using the show's database ID
    router.push(`/editor/${show.id}`);
  };

  const handleDuplicateSlide = async (show: Show) => {
    try {
      const response = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${show.name} (Copy)`,
          slidesData: show.slides_data || [],
          contentId: show.content_id,
        }),
      });
      if (response.ok) {
        fetchShows(); // Refresh the list
      }
    } catch (error) {
      console.error("Error duplicating show:", error);
    }
  };

  const handleDeleteSlide = async (showId: number) => {
    try {
      const response = await fetch(`/api/shows?id=${showId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setShows(shows.filter((s) => s.id !== showId));
      }
    } catch (error) {
      console.error("Error deleting show:", error);
    }
  };

  const handlePresent = (show?: Show) => {
    if (show) {
      // Present a specific show
      localStorage.setItem("slideflow_slides", JSON.stringify(show.slides_data || []));
    } else {
      // Present all shows combined
      const allSlides = shows.flatMap((s) => (Array.isArray(s.slides_data) ? s.slides_data : []));
      localStorage.setItem("slideflow_slides", JSON.stringify(allSlides));
    }
    setIsPresentDialogOpen(false);
    setPresentSearch("");
    window.open("/display", "_blank");
  };

  const filteredShowsForPresent = shows.filter((show) =>
    (show.name || "Untitled").toLowerCase().includes(presentSearch.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getShowSlideCount = (show: Show) => {
    return Array.isArray(show.slides_data) ? show.slides_data.length : 0;
  };

  const getShowTotalDuration = (show: Show) => {
    if (!Array.isArray(show.slides_data)) return 0;
    return show.slides_data.reduce((acc: number, slide: any) => acc + (slide.duration || 10), 0);
  };

  // Get the first slide's data for preview
  const getPreviewSlide = (show: Show) => {
    if (Array.isArray(show.slides_data) && show.slides_data.length > 0) {
      return show.slides_data[0];
    }
    return null;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Dark Mode Theme Styles */}
      <style jsx global>{`
        .dark {
          background-color: ${DARK_BG} !important;
          min-height: 100vh;
        }
        .dark .dashboard-bg {
          background-color: ${DARK_BG};
        }
        .dark .dashboard-panel {
          background-color: ${DARK_BG_LIGHTER};
          border-color: ${DARK_BORDER};
        }
        .dark .dashboard-text {
          color: ${DARK_TEXT};
        }
        .dark .dashboard-text-muted {
          color: ${DARK_TEXT_MUTED};
        }
        .dark .dashboard-input {
          background-color: ${DARK_BG_DARKER};
          border-color: ${DARK_BORDER};
          color: ${DARK_TEXT};
        }
        .dark .dashboard-button {
          background-color: ${DARK_BG_LIGHTER};
          border-color: ${DARK_BORDER};
          color: ${DARK_TEXT};
        }
        .dark .dashboard-button:hover {
          background-color: ${DARK_BG};
          border-color: ${ACCENT_COLOR};
        }
      `}</style>

      <div className={`space-y-6 p-6 min-h-screen ${darkMode ? 'dashboard-bg' : ''}`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'dashboard-text' : ''}`}>Projects</h1>
            <p className={darkMode ? 'dashboard-text-muted' : 'text-muted-foreground'}>
              Create and manage your presentation projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isPresentDialogOpen} onOpenChange={(open) => { setIsPresentDialogOpen(open); if (!open) setPresentSearch(""); }}>
              <DialogTrigger asChild>
                <Button variant="outline" className={darkMode ? 'dashboard-button' : ''}>
                  <Presentation className="mr-2 h-4 w-4" />
                  Present
                </Button>
              </DialogTrigger>
              <DialogContent className={`sm:max-w-lg ${darkMode ? 'bg-gray-900 border-gray-700' : ''}`}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : ''}>Select a Project to Present</DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                    Choose a project to display or present all projects
                  </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                  <div className="relative mb-3">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                    <Input
                      placeholder="Search projects..."
                      value={presentSearch}
                      onChange={(e) => setPresentSearch(e.target.value)}
                      className={`pl-9 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {filteredShowsForPresent.length === 0 ? (
                      <p className={`text-sm text-center py-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>No projects found</p>
                    ) : (
                      filteredShowsForPresent.map((show) => {
                        const slideCount = Array.isArray(show.slides_data) ? show.slides_data.length : 0;
                        return (
                          <button
                            key={show.id}
                            onClick={() => handlePresent(show)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-card hover:bg-accent border-border'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-9 w-9 rounded flex items-center justify-center text-sm font-medium ${darkMode ? 'bg-gray-700' : 'bg-primary/10'}`}>
                                {slideCount}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{show.name || "Untitled"}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>{slideCount} {slideCount === 1 ? 'slide' : 'slides'}</p>
                              </div>
                            </div>
                            <Play className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => { setIsPresentDialogOpen(false); setPresentSearch(""); }} className={darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : ''}>
                    Cancel
                  </Button>
                  <Button onClick={() => handlePresent()} disabled={shows.length === 0}>
                    <Presentation className="mr-2 h-4 w-4" />
                    Present All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className={darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </DialogTrigger>
              <DialogContent className={darkMode ? 'bg-gray-900 border-gray-700' : ''}>
                <DialogHeader>
                  <DialogTitle className={darkMode ? 'text-white' : ''}>Create New Slide</DialogTitle>
                  <DialogDescription className={darkMode ? 'text-gray-400' : ''}>
                    Give your slide a name to get started
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Enter slide name..."
                    value={newSlideName}
                    onChange={(e) => setNewSlideName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSlide();
                    }}
                    className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className={darkMode ? 'border-gray-600 text-white hover:bg-gray-800' : ''}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSlide} disabled={!newSlideName.trim()}>
                    Create & Edit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className={darkMode ? 'text-gray-400' : 'text-muted-foreground'}>Loading shows...</p>
          </div>
        )}

        {/* Shows Grid */}
        {!isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shows.map((show, index) => {
              const previewSlide = getPreviewSlide(show);
              const slideCount = getShowSlideCount(show);
              const totalDuration = getShowTotalDuration(show);

              return (
                <Card key={show.id} className={`group overflow-hidden ${darkMode ? 'bg-gray-900/80 border-gray-700' : ''}`}>
                  <CardHeader className="p-0">
                    <div
                      className="relative aspect-video cursor-pointer"
                      style={{ backgroundColor: previewSlide?.backgroundColor || (darkMode ? '#0a0a0a' : '#ffffff') }}
                      onClick={() => handleEditSlide(show)}
                    >
                      {/* Render first slide elements as preview */}
                      {previewSlide && (
                        <div className="absolute inset-0 overflow-hidden">
                          {(previewSlide.elements || []).map((element: any) => (
                            <div
                              key={element.id}
                              className="absolute"
                              style={{
                                left: `${(element.x / 960) * 100}%`,
                                top: `${(element.y / 540) * 100}%`,
                                width: `${(element.width / 960) * 100}%`,
                                height: `${(element.height / 540) * 100}%`,
                                fontSize: element.style?.fontSize ? `${(element.style.fontSize / 960) * 30}vw` : undefined,
                                color: element.style?.color,
                                fontFamily: element.style?.fontFamily,
                                fontWeight: element.style?.fontWeight,
                                fontStyle: element.style?.fontStyle,
                                textAlign: element.style?.textAlign,
                                textDecoration: element.style?.textDecoration,
                                backgroundColor: element.type === "shape" ? element.style?.backgroundColor : undefined,
                                borderRadius: element.style?.borderRadius,
                                clipPath: element.style?.clipPath,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: element.style?.textAlign === "center" ? "center" : element.style?.textAlign === "right" ? "flex-end" : "flex-start",
                                overflow: "hidden",
                              }}
                            >
                              {element.type === "text" && (
                                <span className="truncate w-full px-1" style={{ fontSize: "inherit" }}>
                                  {element.content}
                                </span>
                              )}
                              {element.type === "image" && element.src && (
                                <img src={element.src} alt="" className="w-full h-full object-cover" />
                              )}
                              {element.type === "video" && (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                  <Video className="w-4 h-4 text-white" />
                                </div>
                              )}
                              {element.type === "shape" && (
                                <div className="w-full h-full" style={{ backgroundColor: element.style?.backgroundColor }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePresent(show);
                          }}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSlide(show);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>

                      {/* Slide Count Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className={darkMode ? 'bg-gray-800 text-white' : ''}>
                          {slideCount} {slideCount === 1 ? 'slide' : 'slides'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${darkMode ? 'text-white' : ''}`}>{show.name || 'Untitled'}</h3>
                        <div className={`flex items-center gap-2 text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(totalDuration)}</span>
                          <span>•</span>
                          <span>{slideCount} {slideCount === 1 ? 'slide' : 'slides'}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className={`h-8 w-8 ${darkMode ? 'text-white hover:bg-gray-800' : ''}`}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={darkMode ? 'bg-gray-900 border-gray-700' : ''}>
                          <DropdownMenuItem onClick={() => handleEditSlide(show)} className={darkMode ? 'text-white focus:bg-gray-800' : ''}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateSlide(show)} className={darkMode ? 'text-white focus:bg-gray-800' : ''}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSlide(show.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Add New Slide Card */}
            <Card
              className={`border-dashed cursor-pointer hover:bg-accent transition-colors ${darkMode ? 'bg-gray-900/50 border-gray-700 hover:bg-gray-800' : ''
                }`}
              onClick={() => setIsDialogOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                <div className={`rounded-full p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-primary/10'}`}>
                  <Plus className={`h-8 w-8 ${darkMode ? 'text-white' : 'text-primary'}`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : ''}`}>Add New Slide</h3>
                <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  Create a new slide for your presentation
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Presentation Info */}
        <Card className={`${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-muted/50'}`}>
          <CardHeader>
            <CardTitle className={`text-lg ${darkMode ? 'text-white' : ''}`}>Presentation Info</CardTitle>
            <CardDescription className={darkMode ? 'text-gray-400' : ''}>
              Details about your shows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>Total Shows</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>{shows.length}</p>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>Total Slides</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>
                  {shows.reduce((acc, s) => acc + getShowSlideCount(s), 0)}
                </p>
              </div>
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}>Total Duration</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>
                  {formatDuration(shows.reduce((acc, s) => acc + getShowTotalDuration(s), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
