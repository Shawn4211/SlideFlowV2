
export interface SlideElement {
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

export interface Slide {
    id: string;
    name: string;
    elements: SlideElement[];
    backgroundColor: string;
    backgroundImage?: string;
    duration: number;
}

export interface SlideTemplate {
    id: string;
    name: string;
    description: string;
    genre: string;
    tags: string[];
    slides: Slide[];
}

export const TEMPLATE_GENRES = [
    "All",
    "Announcements",
    "Corporate",
    "Safety",
    "Education",
    "Events",
    "Social Media",
    "Congratulations",
    "Employee Recognition",
    "Promotions",
];

const uid = () => Math.random().toString(36).substr(2, 9);

export const SLIDE_TEMPLATES: SlideTemplate[] = [
    {
        id: "tmpl-announce-general",
        name: "General Announcement",
        description: "Bold title with message body and accent bar for general announcements.",
        genre: "Announcements",
        tags: ["announcement", "notice", "info", "general", "message"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1e3a5f", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 8, style: { backgroundColor: "#f59e0b" } },
                { id: uid(), type: "text", x: 80, y: 60, width: 800, height: 80, content: "📢 ANNOUNCEMENT", style: { fontSize: 52, color: "#f59e0b", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 80, y: 160, width: 800, height: 2, style: { backgroundColor: "#ffffff33" } },
                { id: uid(), type: "text", x: 80, y: 190, width: 800, height: 200, content: "Your important announcement message goes here. Double-click to edit this text and share your news with everyone.", style: { fontSize: 28, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 440, width: 800, height: 40, content: "For more information, contact the front desk", style: { fontSize: 18, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 0, y: 532, width: 960, height: 8, style: { backgroundColor: "#f59e0b" } },
            ],
        }],
    },
    {
        id: "tmpl-announce-holiday",
        name: "Upcoming Holiday",
        description: "Festive announcement for upcoming holidays with date highlight.",
        genre: "Announcements",
        tags: ["holiday", "vacation", "closed", "upcoming", "date"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1a1a2e", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#16213e" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 70, content: "🎉 Upcoming Holiday", style: { fontSize: 48, color: "#e0e7ff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 130, width: 400, height: 150, style: { backgroundColor: "#4338ca", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 290, y: 145, width: 380, height: 50, content: "December 25", style: { fontSize: 36, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 290, y: 205, width: 380, height: 50, content: "Christmas Day", style: { fontSize: 26, color: "#c7d2fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 320, width: 800, height: 100, content: "We will be closed on this day.\nWishing everyone a wonderful holiday season! 🌟", style: { fontSize: 22, color: "#a5b4fc", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 330, y: 460, width: 300, height: 50, style: { backgroundColor: "#6366f1", borderRadius: "25px" } },
                { id: uid(), type: "text", x: 340, y: 468, width: 280, height: 36, content: "Happy Holidays!", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-announce-welcome",
        name: "Welcome Message",
        description: "Warm welcome display with gradient styling.",
        genre: "Announcements",
        tags: ["welcome", "greeting", "lobby", "entrance", "reception"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f766e", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 480, height: 540, style: { backgroundColor: "#115e59" } },
                { id: uid(), type: "text", x: 40, y: 120, width: 400, height: 100, content: "WELCOME", style: { fontSize: 64, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 40, y: 230, width: 400, height: 50, content: "to our facility", style: { fontSize: 28, color: "#99f6e4", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 140, y: 300, width: 200, height: 3, style: { backgroundColor: "#2dd4bf" } },
                { id: uid(), type: "text", x: 500, y: 80, width: 420, height: 60, content: "📍 Visitor Info", style: { fontSize: 30, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 500, y: 160, width: 420, height: 300, content: "• Check in at the front desk\n• WiFi: GuestNetwork\n• Password: Welcome123\n• Restrooms on the right\n• Emergency exits marked in green", style: { fontSize: 20, color: "#ccfbf1", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
            ],
        }],
    },
    {
        id: "tmpl-corp-meeting",
        name: "Company Meeting",
        description: "Professional meeting agenda layout with branding area.",
        genre: "Corporate",
        tags: ["meeting", "agenda", "business", "corporate", "team"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 80, style: { backgroundColor: "#1e293b" } },
                { id: uid(), type: "text", x: 30, y: 18, width: 300, height: 45, content: "COMPANY NAME", style: { fontSize: 24, color: "#60a5fa", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 560, y: 22, width: 380, height: 36, content: "Q1 Team Meeting — March 2026", style: { fontSize: 16, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "right" } },
                { id: uid(), type: "text", x: 60, y: 110, width: 840, height: 60, content: "Team Meeting Agenda", style: { fontSize: 40, color: "#f1f5f9", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 190, width: 400, height: 160, style: { backgroundColor: "#1e293b", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 80, y: 200, width: 360, height: 140, content: "1. Project Updates\n2. Q1 Review\n3. Team Goals", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 500, y: 190, width: 400, height: 160, style: { backgroundColor: "#1e293b", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 520, y: 200, width: 360, height: 140, content: "4. Budget Overview\n5. New Initiatives\n6. Q&A Session", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 60, y: 380, width: 840, height: 50, style: { backgroundColor: "#3b82f6", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 70, y: 388, width: 820, height: 36, content: "📅 Next Meeting: April 15, 2026 at 10:00 AM", style: { fontSize: 20, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-corp-results",
        name: "Quarterly Results",
        description: "Data-focused layout for presenting quarterly numbers.",
        genre: "Corporate",
        tags: ["quarterly", "results", "data", "numbers", "kpi", "metrics", "revenue"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#111827", duration: 10,
            elements: [
                { id: uid(), type: "text", x: 60, y: 30, width: 840, height: 60, content: "Q1 2026 Results", style: { fontSize: 42, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 110, width: 260, height: 150, style: { backgroundColor: "#065f46", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 70, y: 120, width: 240, height: 30, content: "Revenue", style: { fontSize: 18, color: "#6ee7b7", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 70, y: 160, width: 240, height: 50, content: "$2.4M", style: { fontSize: 42, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 70, y: 220, width: 240, height: 25, content: "▲ 18% vs Q4", style: { fontSize: 16, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 350, y: 110, width: 260, height: 150, style: { backgroundColor: "#1e3a5f", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 360, y: 120, width: 240, height: 30, content: "Customers", style: { fontSize: 18, color: "#93c5fd", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 360, y: 160, width: 240, height: 50, content: "1,247", style: { fontSize: 42, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 360, y: 220, width: 240, height: 25, content: "▲ 12% vs Q4", style: { fontSize: 16, color: "#60a5fa", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 640, y: 110, width: 260, height: 150, style: { backgroundColor: "#581c87", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 650, y: 120, width: 240, height: 30, content: "Satisfaction", style: { fontSize: 18, color: "#d8b4fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 650, y: 160, width: 240, height: 50, content: "96%", style: { fontSize: 42, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 650, y: 220, width: 240, height: 25, content: "▲ 3% vs Q4", style: { fontSize: 16, color: "#c084fc", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 290, width: 840, height: 2, style: { backgroundColor: "#374151" } },
                { id: uid(), type: "text", x: 60, y: 310, width: 840, height: 180, content: "Key Highlights:\n• Exceeded revenue targets by 12%\n• Customer retention rate at 94%\n• Launched 3 new product features\n• Expanded to 2 new market regions", style: { fontSize: 20, color: "#d1d5db", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
            ],
        }],
    },
    {
        id: "tmpl-corp-hours",
        name: "Office Hours",
        description: "Clean operating hours display for lobbies and entrances.",
        genre: "Corporate",
        tags: ["hours", "schedule", "office", "open", "closed", "operating"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1e293b", duration: 15,
            elements: [
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 60, content: "🕐 Office Hours", style: { fontSize: 44, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 180, y: 100, width: 600, height: 380, style: { backgroundColor: "#0f172a", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 220, y: 120, width: 520, height: 340, content: "Monday        8:00 AM – 6:00 PM\nTuesday       8:00 AM – 6:00 PM\nWednesday  8:00 AM – 6:00 PM\nThursday      8:00 AM – 6:00 PM\nFriday           8:00 AM – 5:00 PM\nSaturday      9:00 AM – 1:00 PM\nSunday         Closed", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Courier New", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 280, y: 490, width: 400, height: 36, style: { backgroundColor: "#3b82f6", borderRadius: "18px" } },
                { id: uid(), type: "text", x: 290, y: 495, width: 380, height: 28, content: "📞 (555) 123-4567", style: { fontSize: 18, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-corp-press",
        name: "Press Release",
        description: "News-style press release layout.",
        genre: "Corporate",
        tags: ["press", "news", "release", "media", "article"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#ffffff", duration: 12,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 6, style: { backgroundColor: "#dc2626" } },
                { id: uid(), type: "text", x: 60, y: 20, width: 200, height: 30, content: "PRESS RELEASE", style: { fontSize: 14, color: "#dc2626", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 660, y: 20, width: 240, height: 30, content: "March 3, 2026", style: { fontSize: 14, color: "#6b7280", fontFamily: "Arial", fontWeight: "normal", textAlign: "right" } },
                { id: uid(), type: "shape", x: 60, y: 55, width: 840, height: 1, style: { backgroundColor: "#e5e7eb" } },
                { id: uid(), type: "text", x: 60, y: 70, width: 840, height: 80, content: "Company Announces Major Product Launch", style: { fontSize: 36, color: "#111827", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 60, y: 170, width: 840, height: 300, content: "City, State — Company Name today announced the launch of its latest product, designed to transform how businesses operate.\n\n\"This is a game-changing moment for our industry,\" said CEO Name. \"We're incredibly proud to bring this innovation to market.\"\n\nThe new product will be available starting Q2 2026. For more information, visit our website or contact our media team.", style: { fontSize: 18, color: "#374151", fontFamily: "Georgia", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 60, y: 485, width: 840, height: 1, style: { backgroundColor: "#e5e7eb" } },
                { id: uid(), type: "text", x: 60, y: 495, width: 840, height: 30, content: "Media Contact: press@company.com | (555) 000-0000", style: { fontSize: 14, color: "#9ca3af", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-safety-warning",
        name: "Warning Alert",
        description: "Bold warning display with hazard-style design.",
        genre: "Safety",
        tags: ["warning", "alert", "hazard", "danger", "caution"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#7f1d1d", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#991b1b" } },
                { id: uid(), type: "shape", x: 30, y: 30, width: 900, height: 480, style: { backgroundColor: "#7f1d1d", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 80, y: 60, width: 800, height: 80, content: "⚠️ WARNING", style: { fontSize: 64, color: "#fbbf24", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 160, width: 400, height: 4, style: { backgroundColor: "#fbbf24" } },
                { id: uid(), type: "text", x: 80, y: 190, width: 800, height: 150, content: "HAZARDOUS AREA\nAuthorized Personnel Only", style: { fontSize: 36, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 380, width: 800, height: 80, content: "Protective equipment required at all times.\nReport any safety concerns immediately.", style: { fontSize: 20, color: "#fca5a5", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-safety-emergency",
        name: "Emergency Notice",
        description: "Urgent red emergency notice for critical situations.",
        genre: "Safety",
        tags: ["emergency", "urgent", "evacuation", "fire", "critical"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#dc2626", duration: 8,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 100, style: { backgroundColor: "#b91c1c" } },
                { id: uid(), type: "text", x: 0, y: 20, width: 960, height: 60, content: "🚨 EMERGENCY NOTICE 🚨", style: { fontSize: 42, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 140, width: 800, height: 100, content: "PLEASE EVACUATE\nTHE BUILDING", style: { fontSize: 48, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 180, y: 270, width: 600, height: 160, style: { backgroundColor: "#ffffff22", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 200, y: 285, width: 560, height: 130, content: "• Proceed to the nearest exit\n• Do NOT use elevators\n• Assist those who need help\n• Gather at Assembly Point A", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 80, y: 460, width: 800, height: 50, content: "Call 911 if you see danger | Emergency Line: ext. 5555", style: { fontSize: 20, color: "#fecaca", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-safety-tips",
        name: "Safety Tips",
        description: "Safety tips list with a clean informational layout.",
        genre: "Safety",
        tags: ["safety", "tips", "guidelines", "rules", "workplace"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0c4a6e", duration: 12,
            elements: [
                { id: uid(), type: "text", x: 60, y: 25, width: 840, height: 60, content: "🛡️ Workplace Safety Tips", style: { fontSize: 38, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 100, width: 410, height: 180, style: { backgroundColor: "#0369a1", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 80, y: 110, width: 370, height: 160, content: "👷 Personal Safety\n\n• Wear PPE at all times\n• Report hazards immediately\n• Know your emergency exits", style: { fontSize: 18, color: "#e0f2fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 490, y: 100, width: 410, height: 180, style: { backgroundColor: "#0369a1", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 510, y: 110, width: 370, height: 160, content: "🔥 Fire Safety\n\n• Know extinguisher locations\n• Never block fire exits\n• Practice fire drills regularly", style: { fontSize: 18, color: "#e0f2fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 60, y: 300, width: 410, height: 180, style: { backgroundColor: "#0369a1", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 80, y: 310, width: 370, height: 160, content: "🧹 Housekeeping\n\n• Keep walkways clear\n• Clean up spills promptly\n• Store materials properly", style: { fontSize: 18, color: "#e0f2fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 490, y: 300, width: 410, height: 180, style: { backgroundColor: "#0369a1", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 510, y: 310, width: 370, height: 160, content: "🏥 First Aid\n\n• Know first aid kit locations\n• Report all injuries\n• AED located at main entrance", style: { fontSize: 18, color: "#e0f2fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 60, y: 498, width: 840, height: 30, content: "Safety is everyone's responsibility!", style: { fontSize: 18, color: "#7dd3fc", fontFamily: "Arial", fontWeight: "bold", textAlign: "center", fontStyle: "italic" } },
            ],
        }],
    },
    {
        id: "tmpl-edu-back-to-school",
        name: "Back to School",
        description: "Vibrant back-to-school themed announcement.",
        genre: "Education",
        tags: ["school", "education", "back to school", "students", "semester"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1e40af", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#1d4ed8" } },
                { id: uid(), type: "text", x: 80, y: 40, width: 800, height: 100, content: "📚 Back to School!", style: { fontSize: 56, color: "#fbbf24", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 180, y: 160, width: 600, height: 200, style: { backgroundColor: "#1e3a8a", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 200, y: 175, width: 560, height: 170, content: "Spring Semester 2026\n\nClasses begin: January 12\nOrientation: January 10\nLast day to enroll: January 16", style: { fontSize: 22, color: "#dbeafe", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 400, width: 800, height: 80, content: "Welcome students! 🎒\nVisit the main office for schedules and supplies.", style: { fontSize: 22, color: "#93c5fd", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-edu-schedule",
        name: "Class Schedule",
        description: "Clean timetable layout for class schedules.",
        genre: "Education",
        tags: ["class", "schedule", "timetable", "courses", "roster"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 15,
            elements: [
                { id: uid(), type: "text", x: 60, y: 20, width: 840, height: 50, content: "📋 Today's Class Schedule", style: { fontSize: 34, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 80, width: 840, height: 40, style: { backgroundColor: "#3b82f6", borderRadius: "6px 6px 0 0" } },
                { id: uid(), type: "text", x: 80, y: 85, width: 250, height: 30, content: "Time", style: { fontSize: 18, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 340, y: 85, width: 300, height: 30, content: "Subject", style: { fontSize: 18, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 660, y: 85, width: 220, height: 30, content: "Room", style: { fontSize: 18, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "shape", x: 60, y: 120, width: 840, height: 380, style: { backgroundColor: "#1e293b", borderRadius: "0 0 6px 6px" } },
                { id: uid(), type: "text", x: 80, y: 130, width: 250, height: 360, content: "8:00 – 9:00 AM\n\n9:15 – 10:15 AM\n\n10:30 – 11:30 AM\n\n11:45 – 12:45 PM\n\n1:00 – 2:00 PM\n\n2:15 – 3:15 PM", style: { fontSize: 17, color: "#94a3b8", fontFamily: "Courier New", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 340, y: 130, width: 300, height: 360, content: "Mathematics\n\nEnglish Literature\n\nPhysics\n\nLunch Break\n\nComputer Science\n\nPhysical Education", style: { fontSize: 17, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 660, y: 130, width: 220, height: 360, content: "Room 101\n\nRoom 204\n\nLab 3B\n\nCafeteria\n\nLab 5A\n\nGymnasium", style: { fontSize: 17, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
            ],
        }],
    },
    {
        id: "tmpl-edu-school-banner",
        name: "School Name Banner",
        description: "Institutional branding display with school name and motto.",
        genre: "Education",
        tags: ["school", "banner", "branding", "institution", "university", "college"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#14532d", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#166534" } },
                { id: uid(), type: "shape", x: 0, y: 200, width: 960, height: 180, style: { backgroundColor: "#14532d" } },
                { id: uid(), type: "text", x: 80, y: 80, width: 800, height: 80, content: "🏫", style: { fontSize: 60, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 215, width: 800, height: 70, content: "GREENFIELD ACADEMY", style: { fontSize: 52, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 290, width: 800, height: 40, content: "Excellence · Integrity · Innovation", style: { fontSize: 24, color: "#bbf7d0", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 330, y: 350, width: 300, height: 3, style: { backgroundColor: "#4ade80" } },
                { id: uid(), type: "text", x: 80, y: 380, width: 800, height: 100, content: "Educating Leaders Since 1952\nwww.greenfieldacademy.edu", style: { fontSize: 20, color: "#86efac", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-event-promotion",
        name: "Event Promotion",
        description: "Eye-catching event promotion with date, time, and location.",
        genre: "Events",
        tags: ["event", "promotion", "concert", "party", "conference", "seminar"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#4c1d95", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#5b21b6" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 50, content: "✨ YOU'RE INVITED ✨", style: { fontSize: 28, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 90, width: 800, height: 80, content: "Annual Gala Night", style: { fontSize: 54, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 190, width: 400, height: 3, style: { backgroundColor: "#a78bfa" } },
                { id: uid(), type: "shape", x: 130, y: 220, width: 200, height: 120, style: { backgroundColor: "#4c1d95", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 140, y: 230, width: 180, height: 30, content: "📅 DATE", style: { fontSize: 16, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 140, y: 265, width: 180, height: 60, content: "March 28\n2026", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 380, y: 220, width: 200, height: 120, style: { backgroundColor: "#4c1d95", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 390, y: 230, width: 180, height: 30, content: "🕖 TIME", style: { fontSize: 16, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 390, y: 265, width: 180, height: 60, content: "7:00 PM\nDoors at 6:30", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 630, y: 220, width: 200, height: 120, style: { backgroundColor: "#4c1d95", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 640, y: 230, width: 180, height: 30, content: "📍 VENUE", style: { fontSize: 16, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 640, y: 265, width: 180, height: 60, content: "Grand\nBallroom", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 380, width: 800, height: 60, content: "Join us for an unforgettable evening of music, dining, and entertainment.", style: { fontSize: 20, color: "#ddd6fe", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 300, y: 460, width: 360, height: 50, style: { backgroundColor: "#a78bfa", borderRadius: "25px" } },
                { id: uid(), type: "text", x: 310, y: 468, width: 340, height: 36, content: "RSVP by March 20", style: { fontSize: 20, color: "#1e1b4b", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-event-holidays",
        name: "Happy Holidays",
        description: "Seasonal greeting card design for holidays.",
        genre: "Events",
        tags: ["holidays", "christmas", "season", "greeting", "festive", "new year"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0c1222", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#1a1a3e" } },
                { id: uid(), type: "text", x: 80, y: 40, width: 800, height: 60, content: "❄️  ✨  ❄️  ✨  ❄️  ✨  ❄️", style: { fontSize: 36, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 130, width: 800, height: 100, content: "Happy Holidays!", style: { fontSize: 64, color: "#fbbf24", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 250, width: 800, height: 80, content: "Wishing you joy, peace, and happiness\nthis holiday season and beyond.", style: { fontSize: 24, color: "#e0e7ff", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 330, y: 350, width: 300, height: 3, style: { backgroundColor: "#fbbf24" } },
                { id: uid(), type: "text", x: 80, y: 380, width: 800, height: 50, content: "From all of us at Company Name", style: { fontSize: 22, color: "#a5b4fc", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 440, width: 800, height: 60, content: "🎄  🎁  ⭐  🎁  🎄", style: { fontSize: 36, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-event-celebration",
        name: "Birthday / Celebration",
        description: "Celebration-themed slide for birthdays and milestones.",
        genre: "Events",
        tags: ["birthday", "celebration", "congratulations", "milestone", "party"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#831843", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#9d174d" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 60, content: "🎈🎉🎊🎈🎉🎊🎈🎉🎊", style: { fontSize: 40, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 110, width: 800, height: 90, content: "Happy Birthday!", style: { fontSize: 60, color: "#fdf2f8", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 230, y: 220, width: 500, height: 140, style: { backgroundColor: "#be185d", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 250, y: 240, width: 460, height: 100, content: "🎂 John Doe 🎂\nWishing you an amazing year ahead!", style: { fontSize: 26, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 400, width: 800, height: 50, content: "From your friends and colleagues", style: { fontSize: 22, color: "#fbcfe8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 80, y: 460, width: 800, height: 50, content: "🎈🎉🎊🎈🎉🎊🎈🎉🎊", style: { fontSize: 36, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-social-quote",
        name: "Quote of the Day",
        description: "Inspirational quote display with elegant styling.",
        genre: "Social Media",
        tags: ["quote", "inspiration", "motivational", "daily", "wisdom"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1f2937", duration: 12,
            elements: [
                { id: uid(), type: "shape", x: 80, y: 60, width: 800, height: 420, style: { backgroundColor: "#111827", borderRadius: "20px" } },
                { id: uid(), type: "text", x: 120, y: 80, width: 100, height: 80, content: "❝", style: { fontSize: 72, color: "#6366f1", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 140, y: 160, width: 680, height: 150, content: "The only way to do great work is to love what you do.", style: { fontSize: 34, color: "#f3f4f6", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 360, y: 330, width: 240, height: 3, style: { backgroundColor: "#6366f1" } },
                { id: uid(), type: "text", x: 140, y: 355, width: 680, height: 40, content: "— Steve Jobs", style: { fontSize: 22, color: "#9ca3af", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 140, y: 410, width: 680, height: 30, content: "✨ Quote of the Day ✨", style: { fontSize: 16, color: "#6366f1", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-social-countdown",
        name: "Coming Soon",
        description: "Teaser countdown layout for upcoming launches or events.",
        genre: "Social Media",
        tags: ["coming soon", "countdown", "launch", "teaser", "upcoming"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0a0a0a", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#111111" } },
                { id: uid(), type: "text", x: 80, y: 60, width: 800, height: 50, content: "SOMETHING BIG IS COMING", style: { fontSize: 24, color: "#6366f1", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 120, width: 800, height: 80, content: "COMING SOON", style: { fontSize: 64, color: "#ffffff", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 130, y: 230, width: 160, height: 130, style: { backgroundColor: "#1e1e1e", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 140, y: 240, width: 140, height: 70, content: "15", style: { fontSize: 56, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 140, y: 315, width: 140, height: 30, content: "DAYS", style: { fontSize: 16, color: "#6b7280", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 320, y: 230, width: 160, height: 130, style: { backgroundColor: "#1e1e1e", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 330, y: 240, width: 140, height: 70, content: "08", style: { fontSize: 56, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 330, y: 315, width: 140, height: 30, content: "HOURS", style: { fontSize: 16, color: "#6b7280", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 510, y: 230, width: 160, height: 130, style: { backgroundColor: "#1e1e1e", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 520, y: 240, width: 140, height: 70, content: "42", style: { fontSize: 56, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 520, y: 315, width: 140, height: 30, content: "MINS", style: { fontSize: 16, color: "#6b7280", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 700, y: 230, width: 160, height: 130, style: { backgroundColor: "#1e1e1e", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 710, y: 240, width: 140, height: 70, content: "30", style: { fontSize: 56, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 710, y: 315, width: 140, height: 30, content: "SECS", style: { fontSize: 16, color: "#6b7280", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 400, width: 800, height: 50, content: "Stay tuned for the big reveal!", style: { fontSize: 22, color: "#9ca3af", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 330, y: 460, width: 300, height: 46, style: { backgroundColor: "#6366f1", borderRadius: "23px" } },
                { id: uid(), type: "text", x: 340, y: 468, width: 280, height: 32, content: "Get Notified →", style: { fontSize: 18, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-social-menu",
        name: "Menu / Specials Board",
        description: "Restaurant or café menu and daily specials display.",
        genre: "Social Media",
        tags: ["menu", "restaurant", "cafe", "food", "specials", "dining", "coffee"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#292524", duration: 15,
            elements: [
                { id: uid(), type: "shape", x: 30, y: 30, width: 900, height: 480, style: { backgroundColor: "#1c1917", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 80, y: 45, width: 800, height: 50, content: "☕ Today's Specials", style: { fontSize: 40, color: "#fbbf24", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 105, width: 400, height: 2, style: { backgroundColor: "#fbbf2466" } },
                { id: uid(), type: "text", x: 100, y: 125, width: 380, height: 30, content: "🥐 Breakfast", style: { fontSize: 24, color: "#f59e0b", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 100, y: 160, width: 360, height: 120, content: "Avocado Toast .............. $8.99\nPancake Stack .............. $7.49\nEggs Benedict ............... $9.99", style: { fontSize: 18, color: "#e7e5e4", fontFamily: "Courier New", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 500, y: 125, width: 380, height: 30, content: "🥤 Drinks", style: { fontSize: 24, color: "#f59e0b", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 500, y: 160, width: 380, height: 120, content: "Latte ............................ $4.99\nCappuccino .................. $4.49\nFresh Juice ................... $5.99", style: { fontSize: 18, color: "#e7e5e4", fontFamily: "Courier New", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 100, y: 295, width: 760, height: 2, style: { backgroundColor: "#fbbf2433" } },
                { id: uid(), type: "text", x: 100, y: 315, width: 760, height: 30, content: "🍽️ Lunch Specials", style: { fontSize: 24, color: "#f59e0b", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 100, y: 355, width: 760, height: 100, content: "Grilled Chicken Salad ................................ $12.99\nClassic Burger & Fries ................................ $11.49\nSoup of the Day + Bread ............................ $8.99", style: { fontSize: 18, color: "#e7e5e4", fontFamily: "Courier New", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 250, y: 468, width: 460, height: 36, style: { backgroundColor: "#78350f", borderRadius: "18px" } },
                { id: uid(), type: "text", x: 260, y: 473, width: 440, height: 28, content: "🌟 Ask about our loyalty program!", style: { fontSize: 16, color: "#fde68a", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-social-instagram",
        name: "Social Media Post",
        description: "Bold social-media-style visual post layout.",
        genre: "Social Media",
        tags: ["instagram", "social", "post", "visual", "brand", "marketing"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f0f0f", duration: 10,
            elements: [
                { id: uid(), type: "shape", x: 210, y: 20, width: 540, height: 500, style: { backgroundColor: "#1a1a2e", borderRadius: "20px" } },
                { id: uid(), type: "shape", x: 230, y: 40, width: 500, height: 280, style: { backgroundColor: "#e11d48", borderRadius: "16px" } },
                { id: uid(), type: "text", x: 250, y: 80, width: 460, height: 60, content: "NEW DROP", style: { fontSize: 48, color: "#ffffff", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 250, y: 150, width: 460, height: 50, content: "Spring Collection 2026", style: { fontSize: 28, color: "#ffe4e6", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 250, y: 210, width: 460, height: 80, content: "Limited Edition\nAvailable Now", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 340, y: 340, width: 280, height: 50, style: { backgroundColor: "#ffffff", borderRadius: "25px" } },
                { id: uid(), type: "text", x: 350, y: 348, width: 260, height: 36, content: "SHOP NOW →", style: { fontSize: 20, color: "#e11d48", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 230, y: 420, width: 500, height: 40, content: "@yourbrand | #SpringCollection", style: { fontSize: 16, color: "#6b7280", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 230, y: 460, width: 500, height: 40, content: "❤️ 2.4K    💬 186    🔄 342", style: { fontSize: 16, color: "#9ca3af", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },

    // ═══════════════════════════════════════════════════════════
    // CONGRATULATIONS TEMPLATES
    // ═══════════════════════════════════════════════════════════
    {
        id: "tmpl-congrats-team",
        name: "Team Congratulations",
        description: "Celebrate team achievements with a vibrant photo-based congratulations slide.",
        genre: "Congratulations",
        tags: ["congratulations", "team", "achievement", "success", "celebration"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0a1628", duration: 12,
            backgroundImage: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(0,0,0,0.55)" } },
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 8, style: { backgroundColor: "#fbbf24" } },
                { id: uid(), type: "text", x: 80, y: 50, width: 800, height: 50, content: "🎉 CONGRATULATIONS! 🎉", style: { fontSize: 46, color: "#fbbf24", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 130, width: 800, height: 80, content: "Outstanding Team Achievement", style: { fontSize: 38, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 225, width: 400, height: 3, style: { backgroundColor: "#fbbf24" } },
                { id: uid(), type: "text", x: 80, y: 250, width: 800, height: 100, content: "Your hard work and dedication have led to\nan incredible milestone. We are proud of every\nmember of this amazing team!", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 250, y: 390, width: 460, height: 60, style: { backgroundColor: "#fbbf24", borderRadius: "30px" } },
                { id: uid(), type: "text", x: 260, y: 400, width: 440, height: 40, content: "⭐ You Made It Happen! ⭐", style: { fontSize: 24, color: "#0a1628", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 0, y: 532, width: 960, height: 8, style: { backgroundColor: "#fbbf24" } },
            ],
        }],
    },
    {
        id: "tmpl-congrats-award",
        name: "Award Ceremony",
        description: "Elegant award announcement with trophy imagery for formal recognition.",
        genre: "Congratulations",
        tags: ["award", "trophy", "ceremony", "winner", "excellence"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 12,
            backgroundImage: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(15,23,42,0.75)" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 60, content: "🏆", style: { fontSize: 56, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 100, width: 800, height: 50, content: "AWARD OF EXCELLENCE", style: { fontSize: 36, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 330, y: 165, width: 300, height: 3, style: { backgroundColor: "#fbbf24" } },
                { id: uid(), type: "text", x: 80, y: 185, width: 800, height: 50, content: "Presented To", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 230, width: 800, height: 70, content: "Employee Name", style: { fontSize: 48, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 310, width: 800, height: 50, content: "For outstanding contribution and dedication", style: { fontSize: 22, color: "#cbd5e1", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 200, y: 390, width: 560, height: 80, style: { backgroundColor: "rgba(251,191,36,0.15)", borderRadius: "12px" } },
                { id: uid(), type: "text", x: 220, y: 405, width: 520, height: 50, content: "Q1 2026 · IT Department", style: { fontSize: 22, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 490, width: 800, height: 30, content: "Awarded by Leadership Team", style: { fontSize: 16, color: "#64748b", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-congrats-milestone",
        name: "Work Anniversary",
        description: "Celebrate employee work anniversaries and years of service.",
        genre: "Congratulations",
        tags: ["anniversary", "years", "service", "milestone", "loyalty"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1e1b4b", duration: 12,
            backgroundImage: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(30,27,75,0.8)" } },
                { id: uid(), type: "text", x: 80, y: 40, width: 800, height: 50, content: "🎊 HAPPY WORK ANNIVERSARY 🎊", style: { fontSize: 32, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 330, y: 120, width: 300, height: 160, style: { backgroundColor: "#4c1d95", borderRadius: "50%" } },
                { id: uid(), type: "text", x: 350, y: 145, width: 260, height: 70, content: "5", style: { fontSize: 72, color: "#fbbf24", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 350, y: 220, width: 260, height: 40, content: "YEARS", style: { fontSize: 24, color: "#e9d5ff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 305, width: 800, height: 60, content: "Employee Name", style: { fontSize: 42, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 375, width: 800, height: 60, content: "Thank you for 5 incredible years of dedication,\ninnovation, and teamwork!", style: { fontSize: 20, color: "#c4b5fd", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 280, y: 460, width: 400, height: 50, style: { backgroundColor: "#7c3aed", borderRadius: "25px" } },
                { id: uid(), type: "text", x: 290, y: 468, width: 380, height: 34, content: "Here's to many more! 🥂", style: { fontSize: 20, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },

    // ═══════════════════════════════════════════════════════════
    // EMPLOYEE RECOGNITION TEMPLATES
    // ═══════════════════════════════════════════════════════════
    {
        id: "tmpl-recog-employee-month",
        name: "Employee of the Month",
        description: "Spotlight an outstanding employee with a professional photo layout.",
        genre: "Employee Recognition",
        tags: ["employee", "month", "spotlight", "star", "best", "recognition"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 15,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#0f172a" } },
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 80, style: { backgroundColor: "#1e293b" } },
                { id: uid(), type: "text", x: 30, y: 18, width: 450, height: 45, content: "⭐ EMPLOYEE OF THE MONTH", style: { fontSize: 24, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 560, y: 22, width: 380, height: 36, content: "March 2026", style: { fontSize: 18, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "right" } },
                { id: uid(), type: "image", x: 60, y: 110, width: 340, height: 340, src: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", style: { borderRadius: "16px" } },
                { id: uid(), type: "text", x: 440, y: 110, width: 480, height: 50, content: "Employee Name", style: { fontSize: 38, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 440, y: 165, width: 480, height: 30, content: "Senior Software Engineer · IT Department", style: { fontSize: 18, color: "#60a5fa", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 440, y: 210, width: 460, height: 2, style: { backgroundColor: "#334155" } },
                { id: uid(), type: "text", x: 440, y: 225, width: 480, height: 150, content: "\"Goes above and beyond every sprint. Led the migration project with zero downtime and mentored 3 junior developers this quarter.\"\n\n— Engineering Manager", style: { fontSize: 17, color: "#cbd5e1", fontFamily: "Georgia", fontWeight: "normal", textAlign: "left", fontStyle: "italic" } },
                { id: uid(), type: "shape", x: 440, y: 395, width: 140, height: 40, style: { backgroundColor: "#fbbf2420", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 448, y: 402, width: 124, height: 26, content: "⭐ 12 PRs", style: { fontSize: 15, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 595, y: 395, width: 140, height: 40, style: { backgroundColor: "#3b82f620", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 603, y: 402, width: 124, height: 26, content: "🚀 98% SLA", style: { fontSize: 15, color: "#60a5fa", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 750, y: 395, width: 140, height: 40, style: { backgroundColor: "#10b98120", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 758, y: 402, width: 124, height: 26, content: "💡 3 Ideas", style: { fontSize: 15, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 475, width: 840, height: 45, style: { backgroundColor: "#fbbf24", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 70, y: 483, width: 820, height: 30, content: "Thank you for your outstanding contributions! 🏆", style: { fontSize: 18, color: "#0f172a", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-recog-shoutout",
        name: "Employee Shoutout",
        description: "Quick and bold shoutout card for recognizing great work.",
        genre: "Employee Recognition",
        tags: ["shoutout", "kudos", "thankyou", "recognition", "appreciation"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#042f2e", duration: 10,
            backgroundImage: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(4,47,46,0.85)" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 50, content: "📣 SHOUTOUT!", style: { fontSize: 44, color: "#2dd4bf", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 200, y: 100, width: 560, height: 320, style: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "20px" } },
                { id: uid(), type: "image", x: 370, y: 120, width: 220, height: 220, src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop", style: { borderRadius: "50%" } },
                { id: uid(), type: "text", x: 220, y: 140, width: 140, height: 100, content: "👏\n👏\n👏", style: { fontSize: 32, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 600, y: 140, width: 140, height: 100, content: "🎉\n🎉\n🎉", style: { fontSize: 32, color: "#ffffff", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 220, y: 350, width: 520, height: 50, content: "Employee Name", style: { fontSize: 32, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 440, width: 800, height: 40, content: "Crushed the Q1 deployment deadline with zero bugs! 🚀", style: { fontSize: 20, color: "#99f6e4", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 490, width: 800, height: 30, content: "Keep being amazing! — The Engineering Team", style: { fontSize: 16, color: "#5eead4", fontFamily: "Arial", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
            ],
        }],
    },
    {
        id: "tmpl-recog-leaderboard",
        name: "Team Leaderboard",
        description: "Top performers leaderboard with rankings and metrics.",
        genre: "Employee Recognition",
        tags: ["leaderboard", "ranking", "top", "performers", "scoreboard", "competition"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 15,
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "#0f172a" } },
                { id: uid(), type: "text", x: 60, y: 20, width: 840, height: 55, content: "🏆 TOP PERFORMERS — MARCH 2026", style: { fontSize: 32, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 85, width: 840, height: 50, style: { backgroundColor: "#1e293b", borderRadius: "8px 8px 0 0" } },
                { id: uid(), type: "text", x: 80, y: 93, width: 60, height: 34, content: "Rank", style: { fontSize: 15, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 93, width: 300, height: 34, content: "Name", style: { fontSize: 15, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 93, width: 130, height: 34, content: "Tickets", style: { fontSize: 15, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 93, width: 130, height: 34, content: "Satisfaction", style: { fontSize: 15, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 93, width: 120, height: 34, content: "Points", style: { fontSize: 15, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                // Row 1 - Gold
                { id: uid(), type: "shape", x: 60, y: 135, width: 840, height: 70, style: { backgroundColor: "#fbbf2415", borderRadius: "0" } },
                { id: uid(), type: "text", x: 80, y: 150, width: 60, height: 40, content: "🥇", style: { fontSize: 30, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 148, width: 300, height: 22, content: "Sarah Johnson", style: { fontSize: 20, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 160, y: 172, width: 300, height: 18, content: "Lead Developer", style: { fontSize: 13, color: "#64748b", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 155, width: 130, height: 30, content: "156", style: { fontSize: 22, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 155, width: 130, height: 30, content: "99%", style: { fontSize: 22, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 155, width: 120, height: 30, content: "2,840", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                // Row 2 - Silver
                { id: uid(), type: "shape", x: 60, y: 205, width: 840, height: 70, style: { backgroundColor: "#1e293b" } },
                { id: uid(), type: "text", x: 80, y: 220, width: 60, height: 40, content: "🥈", style: { fontSize: 30, color: "#94a3b8", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 218, width: 300, height: 22, content: "Marcus Chen", style: { fontSize: 20, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 160, y: 242, width: 300, height: 18, content: "DevOps Engineer", style: { fontSize: 13, color: "#64748b", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 225, width: 130, height: 30, content: "142", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 225, width: 130, height: 30, content: "97%", style: { fontSize: 22, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 225, width: 120, height: 30, content: "2,610", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                // Row 3 - Bronze
                { id: uid(), type: "shape", x: 60, y: 275, width: 840, height: 70, style: { backgroundColor: "#92400e15" } },
                { id: uid(), type: "text", x: 80, y: 290, width: 60, height: 40, content: "🥉", style: { fontSize: 30, color: "#d97706", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 288, width: 300, height: 22, content: "Priya Patel", style: { fontSize: 20, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 160, y: 312, width: 300, height: 18, content: "QA Specialist", style: { fontSize: 13, color: "#64748b", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 295, width: 130, height: 30, content: "128", style: { fontSize: 22, color: "#e2e8f0", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 295, width: 130, height: 30, content: "96%", style: { fontSize: 22, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 295, width: 120, height: 30, content: "2,390", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                // Row 4
                { id: uid(), type: "shape", x: 60, y: 345, width: 840, height: 60, style: { backgroundColor: "#1e293b" } },
                { id: uid(), type: "text", x: 80, y: 357, width: 60, height: 36, content: "4", style: { fontSize: 20, color: "#64748b", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 360, width: 300, height: 30, content: "Alex Rivera", style: { fontSize: 18, color: "#cbd5e1", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 360, width: 130, height: 30, content: "115", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 360, width: 130, height: 30, content: "95%", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 360, width: 120, height: 30, content: "2,150", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                // Row 5
                { id: uid(), type: "shape", x: 60, y: 405, width: 840, height: 60, style: { backgroundColor: "#0f172a" } },
                { id: uid(), type: "text", x: 80, y: 417, width: 60, height: 36, content: "5", style: { fontSize: 20, color: "#64748b", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 160, y: 420, width: 300, height: 30, content: "Jordan Kim", style: { fontSize: 18, color: "#cbd5e1", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 420, width: 130, height: 30, content: "108", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 620, y: 420, width: 130, height: 30, content: "94%", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 760, y: 420, width: 120, height: 30, content: "1,980", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 60, y: 490, width: 840, height: 30, content: "Updated weekly · Keep pushing, team! 💪", style: { fontSize: 16, color: "#475569", fontFamily: "Arial", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
            ],
        }],
    },

    // ═══════════════════════════════════════════════════════════
    // PROMOTIONS TEMPLATES
    // ═══════════════════════════════════════════════════════════
    {
        id: "tmpl-promo-promotion",
        name: "Job Promotion",
        description: "Announce employee promotions with a professional and celebratory design.",
        genre: "Promotions",
        tags: ["promotion", "new role", "career", "advancement", "title"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0c1222", duration: 12,
            backgroundImage: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(12,18,34,0.82)" } },
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 6, style: { backgroundColor: "#3b82f6" } },
                { id: uid(), type: "text", x: 80, y: 30, width: 800, height: 40, content: "📢 PROMOTION ANNOUNCEMENT", style: { fontSize: 26, color: "#60a5fa", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 80, width: 800, height: 50, content: "Congratulations!", style: { fontSize: 44, color: "#fbbf24", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "image", x: 355, y: 145, width: 250, height: 180, src: "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=300&h=220&fit=crop", style: { borderRadius: "12px" } },
                { id: uid(), type: "text", x: 80, y: 340, width: 800, height: 50, content: "Employee Name", style: { fontSize: 36, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 80, y: 395, width: 800, height: 40, content: "has been promoted to", style: { fontSize: 20, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 230, y: 440, width: 500, height: 55, style: { backgroundColor: "#3b82f6", borderRadius: "28px" } },
                { id: uid(), type: "text", x: 240, y: 450, width: 480, height: 36, content: "Senior Engineering Manager 🚀", style: { fontSize: 22, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 0, y: 534, width: 960, height: 6, style: { backgroundColor: "#3b82f6" } },
            ],
        }],
    },
    {
        id: "tmpl-promo-new-hire",
        name: "New Hire Welcome",
        description: "Welcome new team members with a warm and professional introduction slide.",
        genre: "Promotions",
        tags: ["new hire", "welcome", "onboarding", "team", "introduction", "joining"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0f172a", duration: 12,
            backgroundImage: "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=960&h=540&fit=crop",
            elements: [
                { id: uid(), type: "shape", x: 0, y: 0, width: 960, height: 540, style: { backgroundColor: "rgba(15,23,42,0.82)" } },
                { id: uid(), type: "text", x: 80, y: 25, width: 800, height: 45, content: "👋 WELCOME TO THE TEAM!", style: { fontSize: 34, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "shape", x: 60, y: 90, width: 380, height: 380, style: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "16px" } },
                { id: uid(), type: "image", x: 80, y: 110, width: 340, height: 340, src: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", style: { borderRadius: "12px" } },
                { id: uid(), type: "text", x: 480, y: 100, width: 440, height: 50, content: "Employee Name", style: { fontSize: 36, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "shape", x: 480, y: 158, width: 80, height: 3, style: { backgroundColor: "#34d399" } },
                { id: uid(), type: "text", x: 480, y: 175, width: 440, height: 30, content: "Full-Stack Developer", style: { fontSize: 20, color: "#34d399", fontFamily: "Arial", fontWeight: "bold", textAlign: "left" } },
                { id: uid(), type: "text", x: 480, y: 210, width: 440, height: 30, content: "IT Department · Building 2, Floor 3", style: { fontSize: 16, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 480, y: 255, width: 420, height: 2, style: { backgroundColor: "#1e293b" } },
                { id: uid(), type: "text", x: 480, y: 270, width: 440, height: 130, content: "🎓 B.S. Computer Science\n💼 5 years experience\n🌟 Specializes in React & Node.js\n🏠 Joining from TechCorp Inc.", style: { fontSize: 16, color: "#cbd5e1", fontFamily: "Arial", fontWeight: "normal", textAlign: "left" } },
                { id: uid(), type: "shape", x: 480, y: 420, width: 420, height: 45, style: { backgroundColor: "#065f46", borderRadius: "8px" } },
                { id: uid(), type: "text", x: 490, y: 428, width: 400, height: 30, content: "Say hello when you see them! 🤝", style: { fontSize: 17, color: "#ffffff", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 60, y: 490, width: 840, height: 30, content: "Starting Date: March 24, 2026", style: { fontSize: 16, color: "#475569", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },

    // ═══════════════════════════════════════════════════════════
    // DESIGNED CARD-STYLE TEMPLATES (with generated backgrounds)
    // ═══════════════════════════════════════════════════════════
    {
        id: "tmpl-card-congrats",
        name: "Congratulations Card",
        description: "Elegant green and gold congratulations card with decorative frame for employee photo.",
        genre: "Congratulations",
        tags: ["congratulations", "card", "elegant", "celebration", "designed", "green", "gold"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#d4af37", duration: 12,
            backgroundImage: "/templates/congrats-card-bg.png",
            elements: [
                { id: uid(), type: "text", x: 500, y: 40, width: 420, height: 80, content: "Congratulations!", style: { fontSize: 48, color: "#1a5c38", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 500, y: 140, width: 420, height: 80, content: "On being selected as\nEmployee of the Month", style: { fontSize: 22, color: "#2d6a4f", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "image", x: 80, y: 130, width: 300, height: 300, src: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", style: { borderRadius: "50%" } },
                { id: uid(), type: "text", x: 500, y: 280, width: 420, height: 70, content: "Olivia Wilson", style: { fontSize: 40, color: "#1a5c38", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 500, y: 370, width: 420, height: 50, content: "Your dedication and hard work\ninspire us all every day!", style: { fontSize: 18, color: "#3d7a5f", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 500, y: 440, width: 420, height: 30, content: "— The Leadership Team", style: { fontSize: 16, color: "#5a9178", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-card-star-employee",
        name: "Star Employee Card",
        description: "Navy blue and gold award-style card for recognizing outstanding employees.",
        genre: "Employee Recognition",
        tags: ["star", "employee", "award", "card", "navy", "gold", "designed", "recognition"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0a1929", duration: 12,
            backgroundImage: "/templates/employee-month-bg.png",
            elements: [
                { id: uid(), type: "text", x: 250, y: 20, width: 460, height: 50, content: "⭐ STAR EMPLOYEE ⭐", style: { fontSize: 30, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "image", x: 60, y: 110, width: 320, height: 320, src: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", style: { borderRadius: "50%" } },
                { id: uid(), type: "text", x: 440, y: 100, width: 480, height: 60, content: "Employee Name", style: { fontSize: 42, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 440, y: 170, width: 480, height: 30, content: "Software Engineer · IT Department", style: { fontSize: 18, color: "#fbbf24", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "shape", x: 500, y: 215, width: 360, height: 3, style: { backgroundColor: "#fbbf2450" } },
                { id: uid(), type: "text", x: 440, y: 235, width: 480, height: 120, content: "\"Consistently exceeds expectations\nand brings innovative solutions to\nevery challenge. A true team player\nwho lifts everyone around them.\"", style: { fontSize: 17, color: "#e0e7ff", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 440, y: 370, width: 480, height: 30, content: "— Engineering Director", style: { fontSize: 16, color: "#94a3b8", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 200, y: 470, width: 560, height: 40, content: "🏆 March 2026 · Thank you for your excellence!", style: { fontSize: 18, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-card-promotion",
        name: "Promotion Card",
        description: "Royal blue and silver promotion announcement card with elegant design.",
        genre: "Promotions",
        tags: ["promotion", "card", "announcement", "career", "designed", "blue", "silver"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#1e3a5f", duration: 12,
            backgroundImage: "/templates/promotion-card-bg.png",
            elements: [
                { id: uid(), type: "text", x: 180, y: 30, width: 600, height: 50, content: "📢 PROMOTION ANNOUNCEMENT", style: { fontSize: 24, color: "#93c5fd", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 180, y: 80, width: 600, height: 70, content: "Congratulations!", style: { fontSize: 52, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "image", x: 310, y: 160, width: 340, height: 200, src: "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=400&h=240&fit=crop", style: { borderRadius: "16px" } },
                { id: uid(), type: "text", x: 180, y: 375, width: 600, height: 50, content: "Employee Name", style: { fontSize: 38, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 180, y: 420, width: 600, height: 30, content: "has been promoted to", style: { fontSize: 18, color: "#bfdbfe", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "text", x: 180, y: 455, width: 600, height: 40, content: "Senior Engineering Manager", style: { fontSize: 28, color: "#fbbf24", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 180, y: 500, width: 600, height: 25, content: "Effective March 2026 · IT Department", style: { fontSize: 14, color: "#93c5fd", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
            ],
        }],
    },
    {
        id: "tmpl-card-shoutout",
        name: "Team Shoutout Card",
        description: "Fun and vibrant teal shoutout card for quick team recognition.",
        genre: "Employee Recognition",
        tags: ["shoutout", "card", "fun", "vibrant", "kudos", "designed", "teal", "recognition"],
        slides: [{
            id: uid(), name: "Slide 1", backgroundColor: "#0d9488", duration: 10,
            backgroundImage: "/templates/shoutout-card-bg.png",
            elements: [
                { id: uid(), type: "text", x: 40, y: 30, width: 480, height: 60, content: "🎉 SHOUTOUT!", style: { fontSize: 52, color: "#ffffff", fontFamily: "Impact", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 40, y: 100, width: 480, height: 40, content: "This one goes to...", style: { fontSize: 22, color: "#ccfbf1", fontFamily: "Georgia", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
                { id: uid(), type: "text", x: 40, y: 160, width: 480, height: 60, content: "Employee Name", style: { fontSize: 40, color: "#ffffff", fontFamily: "Georgia", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 40, y: 240, width: 480, height: 100, content: "For absolutely crushing the server\nmigration project with zero downtime\nand keeping the whole team energized!", style: { fontSize: 18, color: "#f0fdfa", fontFamily: "Arial", fontWeight: "normal", textAlign: "center" } },
                { id: uid(), type: "image", x: 580, y: 100, width: 320, height: 320, src: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop", style: { borderRadius: "50%" } },
                { id: uid(), type: "text", x: 40, y: 380, width: 480, height: 40, content: "👏👏👏 You're awesome! 👏👏👏", style: { fontSize: 20, color: "#fbbf24", fontFamily: "Arial", fontWeight: "bold", textAlign: "center" } },
                { id: uid(), type: "text", x: 40, y: 440, width: 480, height: 30, content: "— From the entire Engineering Team", style: { fontSize: 16, color: "#99f6e4", fontFamily: "Arial", fontWeight: "normal", textAlign: "center", fontStyle: "italic" } },
            ],
        }],
    },
];
