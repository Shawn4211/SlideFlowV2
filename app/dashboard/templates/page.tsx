"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, LayoutTemplate, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SLIDE_TEMPLATES, TEMPLATE_GENRES, SlideTemplate } from "@/lib/template-data";

function SlidePreview({ template, size = "small" }: { template: SlideTemplate; size?: "small" | "large" }) {
    const slide = template.slides[0];
    const scale = size === "small" ? 0.28 : 0.55;
    const width = 960 * scale;
    const height = 540 * scale;

    return (
        <div
            style={{
                width,
                height,
                backgroundColor: slide.backgroundColor,
                position: "relative",
                overflow: "hidden",
                borderRadius: size === "small" ? 6 : 10,
            }}
        >
            {slide.elements.map((el) => (
                <div
                    key={el.id}
                    style={{
                        position: "absolute",
                        left: el.x * scale,
                        top: el.y * scale,
                        width: el.width * scale,
                        height: el.height * scale,
                        backgroundColor: el.style.backgroundColor || "transparent",
                        borderRadius: el.style.borderRadius
                            ? `calc(${el.style.borderRadius} * ${scale})`
                            : undefined,
                        clipPath: el.style.clipPath,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent:
                            el.style.textAlign === "center"
                                ? "center"
                                : el.style.textAlign === "right"
                                    ? "flex-end"
                                    : "flex-start",
                    }}
                >
                    {el.type === "text" && (
                        <span
                            style={{
                                fontSize: (el.style.fontSize || 16) * scale,
                                color: el.style.color || "#000",
                                fontFamily: `${el.style.fontFamily || "Arial"}, var(--font-emoji), sans-serif`,
                                fontWeight: el.style.fontWeight || "normal",
                                fontStyle: el.style.fontStyle || "normal",
                                textAlign: (el.style.textAlign as any) || "left",
                                textDecoration: el.style.textDecoration || "none",
                                width: "100%",
                                lineHeight: 1.3,
                                whiteSpace: "pre-wrap",
                                overflow: "hidden",
                            }}
                        >
                            {el.content}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

const genreColors: Record<string, string> = {
    Announcements: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    Corporate: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
    Safety: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    Education: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    Events: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
    "Social Media": "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/30",
};

export default function TemplatesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [previewTemplate, setPreviewTemplate] = useState<SlideTemplate | null>(null);
    const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
    const [isImporting, setIsImporting] = useState(false);

    const filteredTemplates = useMemo(() => {
        return SLIDE_TEMPLATES.filter((t) => {
            const matchesGenre = selectedGenre === "All" || t.genre === selectedGenre;
            if (!matchesGenre) return false;

            if (!searchQuery.trim()) return true;

            const q = searchQuery.toLowerCase();
            return (
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.tags.some((tag) => tag.toLowerCase().includes(q))
            );
        });
    }, [searchQuery, selectedGenre]);

    const handleUseTemplate = async (template: SlideTemplate) => {
        setIsImporting(true);
        try {
            const clonedSlides = JSON.parse(JSON.stringify(template.slides)).map((slide: any, i: number) => ({
                ...slide,
                id: Math.random().toString(36).substr(2, 9),
                name: `Slide ${i + 1}`,
                elements: slide.elements.map((el: any) => ({
                    ...el,
                    id: Math.random().toString(36).substr(2, 9),
                })),
            }));

            const response = await fetch("/api/shows", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: template.name,
                    slidesData: clonedSlides,
                }),
            });

            if (!response.ok) throw new Error("Failed to create show");

            const data = await response.json();
            if (data.show?.id) {
                router.push(`/editor/${data.show.id}`);
            }
        } catch (error) {
            console.error("Error importing template:", error);
            setIsImporting(false);
        }
    };

    return (
        <div className="space-y-6">
            
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <LayoutTemplate className="h-8 w-8" />
                    Templates
                </h1>
                <p className="text-muted-foreground mt-1">
                    Choose a template to get started quickly. Click any template to preview and import it into the editor.
                </p>
            </div>

            
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id="template-search"
                    placeholder="Search templates (e.g. warning, menu, school...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            
            <div className="flex flex-wrap gap-2">
                {TEMPLATE_GENRES.map((genre) => (
                    <Button
                        key={genre}
                        id={`genre-filter-${genre.toLowerCase().replace(/\s+/g, "-")}`}
                        variant={selectedGenre === genre ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGenre(genre)}
                        className="rounded-full"
                    >
                        {genre}
                    </Button>
                ))}
            </div>

            
            <p className="text-sm text-muted-foreground">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? "s" : ""} found
                {selectedGenre !== "All" && ` in ${selectedGenre}`}
                {searchQuery && ` matching "${searchQuery}"`}
            </p>

            
            {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <LayoutTemplate className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground text-lg">No templates found</p>
                    <p className="text-muted-foreground text-sm">Try adjusting your search or genre filter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTemplates.map((template) => (
                        <Card
                            key={template.id}
                            id={`template-card-${template.id}`}
                            className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 overflow-hidden"
                            onClick={() => {
                                setPreviewTemplate(template);
                                setPreviewSlideIndex(0);
                            }}
                        >
                            <CardContent className="p-3">
                                
                                <div className="flex justify-center mb-3 bg-muted/30 rounded-lg p-2">
                                    <SlidePreview template={template} size="small" />
                                </div>

                                
                                <div className="space-y-1.5">
                                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                        {template.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {template.description}
                                    </p>
                                    <Badge variant="outline" className={`text-[10px] ${genreColors[template.genre] || ""}`}>
                                        {template.genre}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            
            <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            {previewTemplate?.name}
                            {previewTemplate && (
                                <Badge variant="outline" className={genreColors[previewTemplate.genre] || ""}>
                                    {previewTemplate.genre}
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {previewTemplate?.description}
                        </DialogDescription>
                    </DialogHeader>

                    {previewTemplate && (
                        <div className="space-y-4">
                            
                            <div className="flex justify-center bg-muted/30 rounded-lg p-4">
                                <SlidePreview template={{
                                    ...previewTemplate,
                                    slides: [previewTemplate.slides[previewSlideIndex]],
                                }} size="large" />
                            </div>

                            
                            {previewTemplate.slides.length > 1 && (
                                <div className="flex items-center justify-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={previewSlideIndex === 0}
                                        onClick={() => setPreviewSlideIndex((i) => Math.max(0, i - 1))}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Slide {previewSlideIndex + 1} of {previewTemplate.slides.length}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={previewSlideIndex === previewTemplate.slides.length - 1}
                                        onClick={() => setPreviewSlideIndex((i) => Math.min(previewTemplate.slides.length - 1, i + 1))}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            
                            <div className="text-sm text-muted-foreground">
                                <span>{previewTemplate.slides.length} slide{previewTemplate.slides.length !== 1 ? "s" : ""}</span>
                                <span className="mx-2">·</span>
                                <span>{previewTemplate.slides[0].elements.length} elements</span>
                                <span className="mx-2">·</span>
                                <span>Tags: {previewTemplate.tags.slice(0, 5).join(", ")}</span>
                            </div>

                            
                            <div className="flex gap-3 pt-2">
                                <Button
                                    id="use-template-btn"
                                    className="flex-1"
                                    onClick={() => handleUseTemplate(previewTemplate)}
                                    disabled={isImporting}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isImporting ? "Creating..." : "Use Template"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewTemplate(null)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
