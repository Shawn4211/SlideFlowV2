export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
}

export interface Screen {
  id: string;
  name: string;
  pairingCode?: string;
  platform?: string;
  orientation: 'landscape' | 'portrait';
  resolution?: { width: number; height: number };
  timezone: string;
  tags: string[];
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
    building?: string;
    floor?: string;
  };
  isOnline: boolean;
  isLocked: boolean;
  lastHeartbeat?: Date;
  playerVersion?: string;

  currentScheduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScreenZone {
  id: string;
  screenId: string;
  name?: string;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isPrimary: boolean;

  zIndex: number;
}

export interface Asset {
  id: string;
  teamId: string;
  folderId?: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'design' | 'website';
  mimeType?: string;
  fileSize?: number;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  metadata: Record<string, any>;
  liveAt?: Date;
  expireAt?: Date;
  status: 'active' | 'processing' | 'archived';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  teamId: string;
  parentId?: string;
  name: string;
  securityLevel: 'inherit' | 'restricted' | 'public';
  allowedRoles: string[];
  createdAt: Date;
}



export interface Schedule {
  id: string;
  teamId: string;
  name: string;
  timezone: string;

  isActive: boolean;
  entries: ScheduleEntry[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleEntry {
  id: string;
  scheduleId: string;

  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  startDate?: Date;
  endDate?: Date;
  recurrence?: Record<string, any>;
  priority: number;

}

export interface Template {
  id: string;
  teamId?: string;
  categoryId?: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  designData: Record<string, any>;
  orientation: 'landscape' | 'portrait';
  resolution?: { width: number; height: number };
  tags: string[];
  isSystem: boolean;
  isLocked: boolean;
  industry?: string;
  useCount: number;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface App {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconUrl?: string;
  category: string;
  minPlan: string;
  configSchema: Record<string, any>;
  isActive: boolean;
}

export interface AppInstance {
  id: string;
  teamId: string;
  appId: string;
  name: string;
  config: Record<string, any>;
  app: App;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProofOfPlay {
  id: string;
  screenId: string;

  assetId?: string;
  appId?: string;
  startedAt: Date;
  endedAt?: Date;
  durationSec?: number;
  zoneId?: string;
  metadata?: Record<string, any>;
}
