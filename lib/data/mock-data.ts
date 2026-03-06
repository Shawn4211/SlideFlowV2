import { 
  Screen, 
  Asset, 
  Folder, 
  Playlist, 
  Schedule, 
  Template, 
  App,
  User,
  Team,
  Organization
} from "@/lib/types";

export const mockUser: User = {
  id: "1",
  email: "admin@slideflow.com",
  firstName: "Admin",
  lastName: "User",
  role: "owner",
};

export const mockOrganization: Organization = {
  id: "1",
  name: "Demo Organization",
  slug: "demo-org",
};

export const mockTeam: Team = {
  id: "1",
  name: "Default Team",
  slug: "default",
  organizationId: "1",
};

export const mockScreens: Screen[] = [
  {
    id: "1",
    name: "Lobby Display",
    pairingCode: "ABC123",
    platform: "webos",
    orientation: "landscape",
    resolution: { width: 1920, height: 1080 },
    timezone: "America/New_York",
    tags: ["lobby", "main"],
    location: { building: "Main Office", floor: "1st" },
    isOnline: true,
    isLocked: false,
    lastHeartbeat: new Date(),
    playerVersion: "1.0.0",
    currentPlaylistId: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Conference Room",
    pairingCode: "DEF456",
    platform: "android",
    orientation: "landscape",
    resolution: { width: 1920, height: 1080 },
    timezone: "America/New_York",
    tags: ["conference", "meeting"],
    location: { building: "Main Office", floor: "2nd" },
    isOnline: true,
    isLocked: false,
    lastHeartbeat: new Date(),
    playerVersion: "1.0.0",
    currentPlaylistId: "2",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Cafeteria Menu",
    pairingCode: "GHI789",
    platform: "windows",
    orientation: "portrait",
    resolution: { width: 1080, height: 1920 },
    timezone: "America/New_York",
    tags: ["cafeteria", "menu"],
    location: { building: "Main Office", floor: "1st" },
    isOnline: false,
    isLocked: false,
    lastHeartbeat: new Date(Date.now() - 3600000),
    playerVersion: "1.0.0",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

export const mockFolders: Folder[] = [
  { id: "1", teamId: "1", name: "Images", securityLevel: "inherit", allowedRoles: [], createdAt: new Date() },
  { id: "2", teamId: "1", name: "Videos", securityLevel: "inherit", allowedRoles: [], createdAt: new Date() },
  { id: "3", teamId: "1", name: "Documents", securityLevel: "inherit", allowedRoles: [], createdAt: new Date() },
  { id: "4", teamId: "1", parentId: "1", name: "Logos", securityLevel: "inherit", allowedRoles: [], createdAt: new Date() },
];

export const mockAssets: Asset[] = [
  {
    id: "1",
    teamId: "1",
    folderId: "1",
    name: "Welcome Banner",
    type: "image",
    mimeType: "image/png",
    fileSize: 1024000,
    fileUrl: "https://via.placeholder.com/1920x1080/4F46E5/ffffff?text=Welcome+Banner",
    thumbnailUrl: "https://via.placeholder.com/300x200/4F46E5/ffffff?text=Welcome",
    duration: 10,
    metadata: { width: 1920, height: 1080 },
    status: "active",
    createdBy: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    teamId: "1",
    folderId: "1",
    name: "Company Logo",
    type: "image",
    mimeType: "image/svg+xml",
    fileSize: 51200,
    fileUrl: "https://via.placeholder.com/500x500/10B981/ffffff?text=Logo",
    thumbnailUrl: "https://via.placeholder.com/150x150/10B981/ffffff?text=Logo",
    metadata: { width: 500, height: 500 },
    status: "active",
    createdBy: "1",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    teamId: "1",
    folderId: "2",
    name: "Product Demo",
    type: "video",
    mimeType: "video/mp4",
    fileSize: 52428800,
    fileUrl: "https://via.placeholder.com/1920x1080/F59E0B/ffffff?text=Video+Demo",
    thumbnailUrl: "https://via.placeholder.com/300x200/F59E0B/ffffff?text=Video",
    duration: 120,
    metadata: { width: 1920, height: 1080, codec: "h264" },
    status: "active",
    createdBy: "1",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: "1",
    teamId: "1",
    name: "Main Playlist",
    description: "Primary content for lobby displays",
    isShared: false,
    transition: "fade",
    approvalStatus: "approved",
    items: [
      {
        id: "1",
        playlistId: "1",
        position: 0,
        itemType: "asset",
        assetId: "1",
        duration: 10,
        resumeOnNext: false,
        enabled: true,
        conditions: {},
      },
      {
        id: "2",
        playlistId: "1",
        position: 1,
        itemType: "asset",
        assetId: "2",
        duration: 5,
        resumeOnNext: false,
        enabled: true,
        conditions: {},
      },
    ],
    createdBy: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    teamId: "1",
    name: "Conference Room Loop",
    description: "Content for conference room displays",
    isShared: false,
    transition: "slide",
    approvalStatus: "approved",
    items: [
      {
        id: "3",
        playlistId: "2",
        position: 0,
        itemType: "asset",
        assetId: "3",
        duration: 120,
        resumeOnNext: false,
        enabled: true,
        conditions: {},
      },
    ],
    createdBy: "1",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

export const mockSchedules: Schedule[] = [
  {
    id: "1",
    teamId: "1",
    name: "Business Hours",
    timezone: "America/New_York",
    defaultPlaylistId: "1",
    isActive: true,
    entries: [
      {
        id: "1",
        scheduleId: "1",
        playlistId: "1",
        startTime: "09:00",
        endTime: "17:00",
        daysOfWeek: [1, 2, 3, 4, 5],
        priority: 1,
      },
    ],
    createdBy: "1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const mockTemplates: Template[] = [
  {
    id: "1",
    name: "Welcome Screen",
    description: "Classic welcome screen with logo and greeting",
    thumbnailUrl: "https://via.placeholder.com/300x200/4F46E5/ffffff?text=Welcome+Template",
    designData: {},
    orientation: "landscape",
    resolution: { width: 1920, height: 1080 },
    tags: ["welcome", "corporate"],
    isSystem: true,
    isLocked: false,
    industry: "Corporate",
    useCount: 150,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Digital Menu",
    description: "Restaurant menu template with sections",
    thumbnailUrl: "https://via.placeholder.com/300x200/10B981/ffffff?text=Menu+Template",
    designData: {},
    orientation: "portrait",
    resolution: { width: 1080, height: 1920 },
    tags: ["menu", "restaurant", "food"],
    isSystem: true,
    isLocked: false,
    industry: "Restaurant",
    useCount: 89,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Social Media Wall",
    description: "Display social media feeds",
    thumbnailUrl: "https://via.placeholder.com/300x200/EC4899/ffffff?text=Social+Template",
    designData: {},
    orientation: "landscape",
    resolution: { width: 1920, height: 1080 },
    tags: ["social", "media", "engagement"],
    isSystem: true,
    isLocked: false,
    industry: "Marketing",
    useCount: 234,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
  },
];

export const mockApps: App[] = [
  {
    id: "1",
    slug: "weather",
    name: "Weather",
    description: "Display current weather and forecast",
    iconUrl: "https://via.placeholder.com/64x64/60A5FA/ffffff?text=W",
    category: "utility",
    minPlan: "free",
    configSchema: {
      type: "object",
      properties: {
        location: { type: "string", title: "Location" },
        units: { type: "string", enum: ["celsius", "fahrenheit"], title: "Units" },
      },
    },
    isActive: true,
  },
  {
    id: "2",
    slug: "clock",
    name: "Clock",
    description: "Digital or analog clock display",
    iconUrl: "https://via.placeholder.com/64x64/60A5FA/ffffff?text=C",
    category: "utility",
    minPlan: "free",
    configSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["12h", "24h"], title: "Time Format" },
        showSeconds: { type: "boolean", title: "Show Seconds" },
      },
    },
    isActive: true,
  },
  {
    id: "3",
    slug: "youtube",
    name: "YouTube",
    description: "Embed YouTube videos or playlists",
    iconUrl: "https://via.placeholder.com/64x64/EF4444/ffffff?text=Y",
    category: "social",
    minPlan: "standard",
    configSchema: {
      type: "object",
      properties: {
        videoUrl: { type: "string", title: "Video URL" },
        autoplay: { type: "boolean", title: "Autoplay" },
      },
    },
    isActive: true,
  },
];

export async function getScreens(): Promise<Screen[]> {
  return mockScreens;
}

export async function getScreenById(id: string): Promise<Screen | undefined> {
  return mockScreens.find(s => s.id === id);
}

export async function getAssets(): Promise<Asset[]> {
  return mockAssets;
}

export async function getFolders(): Promise<Folder[]> {
  return mockFolders;
}

export async function getPlaylists(): Promise<Playlist[]> {
  return mockPlaylists;
}

export async function getSchedules(): Promise<Schedule[]> {
  return mockSchedules;
}

export async function getTemplates(): Promise<Template[]> {
  return mockTemplates;
}

export async function getApps(): Promise<App[]> {
  return mockApps;
}

export async function getUser(): Promise<User> {
  return mockUser;
}

export async function getTeam(): Promise<Team> {
  return mockTeam;
}

export async function getOrganization(): Promise<Organization> {
  return mockOrganization;
}
