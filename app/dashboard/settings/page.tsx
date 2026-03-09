"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export default function SettingsPage() {
  const [slideUpdates, setSlideUpdates] = useState(true);
  const [presentationAlerts, setPresentationAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved preferences on mount
    const saved = localStorage.getItem("slideflow_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.slideUpdates === "boolean") setSlideUpdates(parsed.slideUpdates);
        if (typeof parsed.presentationAlerts === "boolean") setPresentationAlerts(parsed.presentationAlerts);
        if (typeof parsed.weeklyReports === "boolean") setWeeklyReports(parsed.weeklyReports);
      } catch (e) {
        console.error("Error parsing saved notifications:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const savePreferences = (key: string, value: boolean) => {
    const currentPrefs = {
      slideUpdates,
      presentationAlerts,
      weeklyReports,
      [key]: value,
    };
    localStorage.setItem("slideflow_notifications", JSON.stringify(currentPrefs));
  };

  const handleSlideUpdatesChange = (checked: boolean) => {
    setSlideUpdates(checked);
    savePreferences("slideUpdates", checked);
  };

  const handlePresentationAlertsChange = (checked: boolean) => {
    setPresentationAlerts(checked);
    savePreferences("presentationAlerts", checked);
  };

  const handleWeeklyReportsChange = (checked: boolean) => {
    setWeeklyReports(checked);
    savePreferences("weeklyReports", checked);
  };

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Slide updates</p>
              <p className="text-sm text-muted-foreground">
                Get notified when slides are updated
              </p>
            </div>
            <Switch
              checked={slideUpdates}
              onCheckedChange={handleSlideUpdatesChange}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Presentation alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified about presentation issues
              </p>
            </div>
            <Switch
              checked={presentationAlerts}
              onCheckedChange={handlePresentationAlertsChange}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly reports</p>
              <p className="text-sm text-muted-foreground">
                Receive weekly analytics reports
              </p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={handleWeeklyReportsChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
