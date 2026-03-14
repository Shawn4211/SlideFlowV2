"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Presentation } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">About</h1>
                <p className="text-muted-foreground">
                    Learn more about the team behind SlideFlow
                </p>
            </div>

            {/* Project Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Presentation className="h-5 w-5" />
                        SlideFlow
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        A digital signage platform that lets you create, schedule, and
                        present dynamic slide-based content on any screen.
                    </p>
                </CardContent>
            </Card>

            {/* Program */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Program
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium">
                        Computer Information Technology
                    </p>
                    <p className="text-muted-foreground">Lethbridge Polytechnic, 2026</p>
                </CardContent>
            </Card>

            {/* Team */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                        AnalytIQ&amp;Designers
                    </Badge>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                        <div className="flex flex-col space-y-2">
                            <span className="font-medium">Shawn So</span>
                            <span className="font-medium">Melvin Raphy</span>
                            <span className="font-medium">Uday Raizada</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <span className="font-medium">Naas Ali mohamed</span>
                            <span className="font-medium">Basel Kittaneh</span>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <span className="font-medium">Samuel Rita</span>
                            <span className="font-medium">Gershon Davadson</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
