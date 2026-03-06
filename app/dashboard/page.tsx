"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Presentation, Activity, Clock, ExternalLink, Edit, MonitorPlay, StopCircle } from "lucide-react";
import Link from "next/link";

interface Show {
  id: number;
  name: string | null;
  content_id: number | null;
  slides_data: any[];
  start_time: string | null;
  finish_time: string | null;
  created_at: string;
  updated_at: string;
}

interface ManualPresent {
  id: number;
  show_id: number | null;
  slides_data: any[];
  show_name: string | null;
  started_at: string;
}

export default function DashboardPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  const [manualPresent, setManualPresent] = useState<ManualPresent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStopping, setIsStopping] = useState(false);
  const [isStoppingShow, setIsStoppingShow] = useState(false);

  const fetchData = async () => {
    try {
      const [showsRes, activeRes] = await Promise.all([
        fetch("/api/shows"),
        fetch("/api/shows/active"),
      ]);
      const showsData = await showsRes.json();
      const activeData = await activeRes.json();

      setShows(showsData.shows || []);
      setCurrentShow(activeData.currentShow || null);
      setUpcomingShows(activeData.upcomingShows || (activeData.nextShow ? [activeData.nextShow] : []));
      setManualPresent(activeData.manualPresent || null);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStopPresent = async () => {
    setIsStopping(true);
    try {
      await fetch("/api/shows/present", { method: "DELETE" });
      setManualPresent(null);
      await fetchData();
    } catch (error) {
      console.error("Error stopping presentation:", error);
    } finally {
      setIsStopping(false);
    }
  };

  const handleStopShow = async (showId: number) => {
    setIsStoppingShow(true);
    try {
      await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: showId, startTime: null, finishTime: null }),
      });
      await fetchData();
    } catch (error) {
      console.error("Error stopping show:", error);
    } finally {
      setIsStoppingShow(false);
    }
  };

  const totalSlides = shows.reduce(
    (acc, s) => acc + (Array.isArray(s.slides_data) ? s.slides_data.length : 0),
    0
  );

  const totalDuration = shows.reduce(
    (acc, s) =>
      acc +
      (Array.isArray(s.slides_data)
        ? s.slides_data.reduce((a: number, slide: any) => a + (slide.duration || 10), 0)
        : 0),
    0
  );

  const scheduledShows = shows.filter((s) => s.start_time).length;

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your digital signage presentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {manualPresent && (
            <Button
              variant="destructive"
              onClick={handleStopPresent}
              disabled={isStopping}
            >
              <StopCircle className="mr-2 h-4 w-4" />
              {isStopping ? "Stopping..." : "Stop Present"}
            </Button>
          )}
          <Button onClick={() => window.open("/display", "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Display
          </Button>
        </div>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shows</CardTitle>
            <Presentation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "—" : shows.length}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Loading..." : `${totalSlides} total slides`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "—" : formatDuration(totalDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all shows
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "—" : scheduledShows}</div>
            <p className="text-xs text-muted-foreground">
              Shows with scheduled times
            </p>
          </CardContent>
        </Card>
      </div>


      <div className="grid gap-4 md:grid-cols-2">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5" />
              Active Display
            </CardTitle>
            <CardDescription>Currently playing and upcoming shows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Now Playing</p>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : manualPresent ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <Presentation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{manualPresent.show_name || "Manual Present"}</p>
                        <p className="text-xs text-muted-foreground">
                          Started {formatDateTime(manualPresent.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-blue-600 dark:bg-blue-500">Presenting</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={handleStopPresent}
                        disabled={isStopping}
                        title="Stop Present"
                      >
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : currentShow ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                        <Presentation className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{currentShow.name || "Untitled"}</p>
                        <p className="text-xs text-muted-foreground">
                          {currentShow.start_time && formatDateTime(currentShow.start_time)}
                          {currentShow.finish_time && ` — ${formatDateTime(currentShow.finish_time)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600 dark:bg-green-500">Live</Badge>
                      <Link href={`/editor/${currentShow.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={() => handleStopShow(currentShow.id)}
                        disabled={isStoppingShow}
                        title="Stop Show"
                      >
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg border-dashed text-center">
                    <p className="text-sm text-muted-foreground">No show currently playing</p>
                  </div>
                )}
              </div>


              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Up Next</p>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : upcomingShows.length > 0 ? (
                  <div className="space-y-2">
                    {upcomingShows.map((show) => (
                      <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{show.name || "Untitled"}</p>
                            <p className="text-xs text-muted-foreground">
                              Starts {show.start_time && formatDateTime(show.start_time)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Scheduled</Badge>
                          <Link href={`/editor/${show.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 dark:hover:bg-gray-800">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                            onClick={() => handleStopShow(show.id)}
                            disabled={isStoppingShow}
                            title="Cancel Schedule"
                          >
                            <StopCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 border rounded-lg border-dashed text-center">
                    <p className="text-sm text-muted-foreground">No upcoming shows</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/screens">
                <Button variant="outline" className="w-full">
                  Manage Slides
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Recent Shows</CardTitle>
            <CardDescription>Your most recently updated shows</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : shows.length === 0 ? (
              <div className="p-4 border rounded-lg border-dashed text-center">
                <p className="text-sm text-muted-foreground">No shows yet</p>
                <Link href="/dashboard/screens">
                  <Button variant="link" className="mt-2">Create your first show</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {shows.slice(0, 5).map((show) => {
                  const slideCount = Array.isArray(show.slides_data) ? show.slides_data.length : 0;
                  return (
                    <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {slideCount}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{show.name || "Untitled"}</p>
                          <p className="text-xs text-muted-foreground">
                            {slideCount} {slideCount === 1 ? "slide" : "slides"}
                            {show.start_time && ` · ${formatDateTime(show.start_time)}`}
                          </p>
                        </div>
                      </div>
                      <Link href={`/editor/${show.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
