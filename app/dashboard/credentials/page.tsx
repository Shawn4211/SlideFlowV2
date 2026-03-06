"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, Upload } from "lucide-react";

export default function CredentialsPage() {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [profile, setProfile] = useState({ first_name: "", last_name: "", username: "" });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [passwords, setPasswords] = useState({ current: "", new_pw: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser({ email: user.email || "", id: user.id });


      const { data } = await supabase
        .from("credentials")
        .select("first_name, last_name, username")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || user.email || "",
        });
      } else {
        setProfile({
          first_name: user.user_metadata?.first_name || "",
          last_name: user.user_metadata?.last_name || "",
          username: user.email || "",
        });
      }


      const { data: avatarData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user.id}/avatar`);


      try {
        const res = await fetch(avatarData.publicUrl, { method: "HEAD" });
        if (res.ok) {
          setAvatarUrl(avatarData.publicUrl + "?t=" + Date.now());
        }
      } catch {

      }
    }
    loadUser();
  }, []);

  const initials = (
    (profile.first_name?.[0] || "") + (profile.last_name?.[0] || "")
  ).toUpperCase() || "U";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;


    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }


    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be under 2MB.");
      return;
    }

    setUploadingAvatar(true);
    setMessage("");

    const filePath = `${user.id}/avatar`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) {
      setMessage("Failed to upload avatar: " + error.message);
    } else {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl + "?t=" + Date.now());
      setMessage("Avatar updated successfully!");
    }
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("credentials")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Failed to save changes: " + error.message);
    } else {
      setMessage("Changes saved successfully!");
    }
    setSaving(false);
  };

  const handlePasswordUpdate = async () => {
    setPasswordMessage("");
    if (!passwords.current) {
      setPasswordMessage("Please enter your current password.");
      return;
    }
    if (!passwords.new_pw) {
      setPasswordMessage("Please enter a new password.");
      return;
    }
    if (passwords.new_pw !== passwords.confirm) {
      setPasswordMessage("New passwords do not match.");
      return;
    }
    if (passwords.new_pw.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: passwords.new_pw,
    });

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage("Password updated successfully!");
      setPasswords({ current: "", new_pw: "", confirm: "" });
    }
    setUpdatingPassword(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
        <p className="text-muted-foreground">
          Manage your personal information and credentials
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={profile.first_name}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={profile.last_name}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
            </div>
            {message && (
              <div className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.new_pw}
                onChange={(e) => setPasswords({ ...passwords, new_pw: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
            {passwordMessage && (
              <div className={`text-sm ${passwordMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {passwordMessage}
              </div>
            )}
            <Button onClick={handlePasswordUpdate} disabled={updatingPassword}>
              {updatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
