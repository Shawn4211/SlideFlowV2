"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tv2, Clock, CalendarClock, MonitorPlay, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";



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

interface Show {
    id: number;
    name: string;
    slides_data: Slide[];
    start_time: string | null;
    finish_time: string | null;
    content?: { id: number; name: string; type: string; file_url: string } | null;
}



function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}



function SlidePreview({
    slide,
    className = "",
}: {
    slide: Slide;
    className?: string;
}) {
    return (
        <div
            className={`relative w-full overflow-hidden rounded-lg ${className}`}
            style={{ paddingBottom: "56.25%"  }}
        >
            <div
                className="absolute inset-0"
                style={{ backgroundColor: slide.backgroundColor, containerType: "inline-size" }}
            >
                {slide.elements.map((el) => (
                    <div
                        key={el.id}
                        className="absolute overflow-hidden"
                        style={{
                            left: `${(el.x / 960) * 100}%`,
                            top: `${(el.y / 540) * 100}%`,
                            width: `${(el.width / 960) * 100}%`,
                            height: `${(el.height / 540) * 100}%`,
                            fontSize: el.style.fontSize
                                ? `${(el.style.fontSize / 960) * 100}cqw`
                                : undefined,
                            color: el.style.color,
                            fontFamily: `${el.style.fontFamily || 'Arial'}, var(--font-emoji), sans-serif`,
                            fontWeight: el.style.fontWeight,
                            fontStyle: el.style.fontStyle,
                            textAlign: el.style.textAlign,
                            textDecoration: el.style.textDecoration,
                            backgroundColor:
                                el.type === "shape" ? el.style.backgroundColor : undefined,
                            borderRadius: el.style.borderRadius,
                            clipPath: el.style.clipPath,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                el.style.textAlign === "center"
                                    ? "center"
                                    : el.style.textAlign === "right"
                                        ? "flex-end"
                                        : "flex-start",
                        }}
                    >
                        {el.type === "text" && (
                            <span className="w-full" style={{ textAlign: el.style.textAlign }}>
                                {el.content}
                            </span>
                        )}
                        {el.type === "image" && el.src && (
                            <img src={el.src} alt="" className="w-full h-full object-contain" />
                        )}
                        {el.type === "video" && el.src && (
                            <video
                                src={el.src}
                                className="w-full h-full object-contain"
                                autoPlay
                                muted
                                loop
                            />
                        )}
                        {el.type === "shape" && (
                            <div
                                className="w-full h-full"
                                style={{
                                    backgroundColor: el.style.backgroundColor,
                                    borderRadius: el.style.borderRadius,
                                    clipPath: el.style.clipPath,
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function TimeRemaining({ date }: { date: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime();
            const target = new Date(date).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("Ended");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                setTimeLeft(`Ends in ${days}d ${hours % 24}h`);
            } else if (hours > 0) {
                setTimeLeft(`Ends in ${hours}h ${minutes}m`);
            } else if (minutes > 0) {
                setTimeLeft(`Ends in ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`Ends in ${seconds}s`);
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return <span>{timeLeft}</span>;
}

function TimeUntil({ date }: { date: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime();
            const target = new Date(date).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("Starting soon");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                setTimeLeft(`in ${days}d ${hours % 24}h`);
            } else if (hours > 0) {
                setTimeLeft(`in ${hours}h ${minutes}m`);
            } else if (minutes > 0) {
                setTimeLeft(`in ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`in ${seconds}s`);
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [date]);

    return <span>{timeLeft}</span>;
}

function CyclingSlidePreview({
    slides,
    className = "",
}: {
    slides: Slide[];
    className?: string;
}) {
    const [index, setIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (slides.length === 0) return;
        
        const duration = slides[index]?.duration ?? 10;
        setTimeLeft(duration);

        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIndex((currIndex) => (currIndex + 1) % slides.length);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [index, slides]);

    if (slides.length === 0) return null;
    const slide = slides[index];

    return (
        <div>
            <SlidePreview slide={slide} className={className} />
            <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center gap-1.5">
                    {slides.length > 1 ? slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === index
                                ? "w-6 bg-primary"
                                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                }`}
                        />
                    )) : null}
                </div>
                <div className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded">
                    {slides.length > 1 ? `${timeLeft}s left` : `${slide.duration ?? 10}s duration`}
                </div>
            </div>
        </div>
    );
}



export default function DisplayDashboardPage() {
    const [currentShow, setCurrentShow] = useState<Show | null>(null);
    const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
    const [manualPresent, setManualPresent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/shows/active");
            const data = await res.json();
            setCurrentShow(data.currentShow ?? null);
            setUpcomingShows(data.upcomingShows ?? (data.nextShow ? [data.nextShow] : []));
            setManualPresent(data.manualPresent ?? null);
            setLastRefreshed(new Date());
        } catch (err) {
            console.error("Failed to fetch active shows:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <div className="space-y-6">
            
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Display</h1>
                    <p className="text-muted-foreground">
                        Monitor what&apos;s currently playing and what&apos;s coming up next
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                        Updated {lastRefreshed.toLocaleTimeString()}
                    </span>
                    <Button variant="outline" size="icon" onClick={fetchData} title="Refresh now">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Link href="/display" target="_blank">
                        <Button>
                            <MonitorPlay className="mr-2 h-4 w-4" />
                            Open Fullscreen
                        </Button>
                    </Link>
                </div>
            </div>

            
            {loading && (
                <div className="text-center py-20 text-muted-foreground">
                    Loading display status…
                </div>
            )}

            
            {!loading && (
                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                    
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Tv2 className="h-5 w-5 text-primary" />
                                    <CardTitle>Currently Displaying</CardTitle>
                                </div>
                                {(manualPresent || currentShow) && (
                                    <Badge className={manualPresent ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : "bg-green-100 text-green-700 hover:bg-green-100"}>
                                        <span className="relative flex h-2 w-2 mr-1.5">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${manualPresent ? 'bg-purple-500' : 'bg-green-500'} opacity-75`} />
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${manualPresent ? 'bg-purple-600' : 'bg-green-600'}`} />
                                        </span>
                                        {manualPresent ? "Manual Present" : "Live"}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent>
                            {manualPresent && manualPresent.slides_data?.length > 0 ? (
                                <div className="space-y-4">
                                    
                                    <div className="border rounded-xl overflow-hidden shadow-sm">
                                        <CyclingSlidePreview
                                            slides={manualPresent.slides_data}
                                            className="border-0"
                                        />
                                    </div>

                                    
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{manualPresent.show_name || "Manual Present"}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {manualPresent.slides_data.length} slide
                                                {manualPresent.slides_data.length !== 1 && "s"}
                                                {" • Manually presented"}
                                            </p>
                                        </div>
                                        {manualPresent.started_at && (
                                            <div className="text-right text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Since {formatDateTime(manualPresent.started_at)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : currentShow && currentShow.slides_data?.length > 0 ? (
                                <div className="space-y-4">
                                    
                                    <div className="border rounded-xl overflow-hidden shadow-sm">
                                        <CyclingSlidePreview
                                            slides={currentShow.slides_data}
                                            className="border-0"
                                        />
                                    </div>

                                    
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{currentShow.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {currentShow.slides_data.length} slide
                                                {currentShow.slides_data.length !== 1 && "s"}
                                                {currentShow.content && ` • ${currentShow.content.name}`}
                                            </p>
                                        </div>
                                        {currentShow.start_time && currentShow.finish_time && (
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="text-right text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDateTime(currentShow.start_time)} –{" "}
                                                        {formatDateTime(currentShow.finish_time)}
                                                    </div>
                                                </div>
                                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                                                    <TimeRemaining date={currentShow.finish_time} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="rounded-full bg-muted p-5 mb-4">
                                        <Tv2 className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">Nothing Playing</h3>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        No show is currently active. Schedule a show on the{" "}
                                        <Link
                                            href="/dashboard/schedules"
                                            className="text-primary underline underline-offset-2"
                                        >
                                            Schedules
                                        </Link>{" "}
                                        page or use the Present button on the{" "}
                                        <Link
                                            href="/dashboard/screens"
                                            className="text-primary underline underline-offset-2"
                                        >
                                            Screens
                                        </Link>{" "}
                                        page.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    
                    <Card className="h-fit">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-blue-500" />
                                <CardTitle>Up Next</CardTitle>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {upcomingShows.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingShows.map((show) => (
                                        <div key={show.id} className="space-y-3 pb-4 border-b last:border-b-0 last:pb-0">
                                            
                                            {show.slides_data?.length > 0 ? (
                                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                                    <SlidePreview slide={show.slides_data[0]} />
                                                </div>
                                            ) : (
                                                <div className="rounded-lg bg-muted flex items-center justify-center"
                                                    style={{ paddingBottom: "56.25%" }}
                                                />
                                            )}

                                            
                                            <div className="space-y-2">
                                                <p className="font-semibold">{show.name}</p>
                                                {show.content && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {show.content.name}
                                                    </p>
                                                )}
                                                {show.slides_data && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {show.slides_data.length} slide
                                                        {show.slides_data.length !== 1 && "s"}
                                                    </p>
                                                )}

                                                {show.start_time && (
                                                    <div className="flex items-center gap-1.5 text-xs p-2 bg-blue-50 text-blue-700 rounded-md dark:bg-blue-950 dark:text-blue-300">
                                                        <Clock className="h-3 w-3" />
                                                        <span>Starts {formatDateTime(show.start_time)}</span>
                                                        <span>•</span>
                                                        <span className="font-semibold"><TimeUntil date={show.start_time} /></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="rounded-full bg-muted p-4 mb-3">
                                        <CalendarClock className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="font-semibold mb-1">No Upcoming Slides</h3>
                                    <p className="text-xs text-muted-foreground max-w-[200px]">
                                        Schedule content on the{" "}
                                        <Link
                                            href="/dashboard/schedules"
                                            className="text-primary underline underline-offset-2"
                                        >
                                            Schedules
                                        </Link>{" "}
                                        page.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
