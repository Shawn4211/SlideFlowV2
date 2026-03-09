"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent } from "@/hooks/use-content";
import { Folder, FileText, Upload, Search, Grid, List, MoreVertical, Move, Trash2, Eye, Edit, X, ChevronRight, Home, FileType, FileImage, FileVideo } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<ReturnType<typeof useContent>['assets'][0] | null>(null);
  const [moveAssetDialog, setMoveAssetDialog] = useState<{ open: boolean; assetId: string | null }>({ open: false, assetId: null });
  const [newFolderDialog, setNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [draggedAsset, setDraggedAsset] = useState<ReturnType<typeof useContent>['assets'][0] | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const {
    assets,
    folders,
    currentFolderId,
    isLoading,
    error,
    fetchAssets,
    fetchFolders,
    uploadFile,
    createFolder,
    moveAsset,
    deleteAsset,
    deleteFolder,
    navigateToFolder,
  } = useContent();

  useEffect(() => {
    fetchAssets();
    fetchFolders();
  }, [fetchAssets, fetchFolders]);

  const getAssetIcon = (type: string, mimeType?: string | null) => {
    const iconClass = "h-8 w-8";
    switch (type) {
      case "image":
        return <FileImage className={cn(iconClass, "text-blue-500")} />;
      case "video":
        return <FileVideo className={cn(iconClass, "text-red-500")} />;
      case "document":
        return <FileType className={cn(iconClass, "text-green-500")} />;
      default:
        return <FileText className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const getFileTypeLabel = (mimeType: string | null) => {
    if (!mimeType) return "Unknown";
    if (mimeType.startsWith("image/")) return "Image";
    if (mimeType.startsWith("video/")) return "Video";
    if (mimeType === "application/pdf") return "PDF";
    return "Document";
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadFile(file, currentFolderId);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim());
      setNewFolderDialog(false);
      setNewFolderName("");
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  const handleMoveAsset = async (folderId: string | null) => {
    if (!moveAssetDialog.assetId) return;
    try {
      await moveAsset(moveAssetDialog.assetId, folderId);
      setMoveAssetDialog({ open: false, assetId: null });
    } catch (err) {
      console.error("Error moving asset:", err);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this file? This action cannot be undone.")) return;
    try {
      await deleteAsset(assetId);
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  const handleDragStart = (e: React.DragEvent, asset: any) => {
    setDraggedAsset(asset);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = async (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setDragOverFolder(null);
    if (draggedAsset && draggedAsset.folder_id !== folderId) {
      try {
        await moveAsset(draggedAsset.id, folderId);
      } catch (err) {
        console.error("Error moving asset:", err);
      }
    }
    setDraggedAsset(null);
  };

  const getBreadcrumbPath = () => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: "Home" }];
    if (currentFolderId) {
      const folder = folders.find(f => f.id === currentFolderId);
      if (folder) {
        path.push({ id: folder.id, name: folder.name });
      }
    }
    return path;
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "images") return matchesSearch && asset.type === "image";
    if (activeTab === "videos") return matchesSearch && asset.type === "video";
    if (activeTab === "documents") return matchesSearch && asset.type === "document";
    return matchesSearch;
  });

  const filteredFolders = folders.filter(folder => {

    const matchesCurrentFolder = folder.parent_id === currentFolderId;
    return matchesCurrentFolder;
  });

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content</h1>
          <p className="text-muted-foreground">
            Manage your media assets and files
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.ppt,.pptx,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>


      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {getBreadcrumbPath().map((item, index, array) => (
          <div key={item.id || "home"} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            <button
              onClick={() => navigateToFolder(item.id)}
              className={cn(
                "hover:text-foreground transition-colors",
                index === array.length - 1 && "text-foreground font-medium"
              )}
            >
              {index === 0 ? <Home className="h-4 w-4" /> : item.name}
            </button>
          </div>
        ))}
      </div>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>


        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-1"
          )}>
            {filteredFolders.map((folder) => (
              <Card
                key={folder.id}
                className={cn(
                  "cursor-pointer hover:bg-accent transition-colors",
                  dragOverFolder === folder.id && "ring-2 ring-primary bg-accent",
                  viewMode === "list" && "flex items-center"
                )}
                onClick={() => navigateToFolder(folder.id)}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, folder.id)}
              >
                <CardContent className={cn(
                  "flex items-center",
                  viewMode === "grid" ? "p-4 flex-col text-center" : "p-3 flex-row gap-3"
                )}>
                  <Folder className={cn(
                    "text-yellow-500",
                    viewMode === "grid" ? "h-10 w-10 mb-2" : "h-6 w-6"
                  )} />
                  <span className="text-sm font-medium truncate flex-1">{folder.name}</span>
                </CardContent>
              </Card>
            ))}


            <Dialog open={newFolderDialog} onOpenChange={setNewFolderDialog}>
              <DialogTrigger asChild>
                <Card className="border-dashed cursor-pointer hover:bg-accent">
                  <CardContent className={cn(
                    "flex items-center justify-center",
                    viewMode === "grid" ? "p-4 flex-col text-center" : "p-3 flex-row gap-3"
                  )}>
                    <div className={cn(
                      "rounded-full bg-primary/10 flex items-center justify-center",
                      viewMode === "grid" ? "h-10 w-10 mb-2" : "h-6 w-6"
                    )}>
                      <span className="text-primary text-xl">+</span>
                    </div>
                    <span className="text-sm font-medium">New Folder</span>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new folder
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewFolderDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No files yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload files to get started
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className={cn(
                    "overflow-hidden cursor-move",
                    viewMode === "list" && "flex flex-row items-center"
                  )}
                  draggable
                  onDragStart={(e) => handleDragStart(e, asset)}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-video bg-gray-100 relative group">
                        {asset.thumbnail_url ? (
                          <img
                            src={asset.thumbnail_url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getAssetIcon(asset.type, asset.mime_type)}
                          </div>
                        )}
                        {asset.type === "video" && asset.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {Math.floor(asset.duration / 60)}:{String(asset.duration % 60).padStart(2, "0")}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{asset.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(asset.file_size)} • {getFileTypeLabel(asset.mime_type)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setPreviewAsset(asset)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/editor/${asset.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setMoveAssetDialog({ open: true, assetId: asset.id })}>
                                <Move className="mr-2 h-4 w-4" />
                                Move
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteAsset(asset.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPreviewAsset(asset)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => router.push(`/editor/${asset.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <div className="p-3">
                        {asset.thumbnail_url ? (
                          <img
                            src={asset.thumbnail_url}
                            alt={asset.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          getAssetIcon(asset.type, asset.mime_type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-3 pr-3">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(asset.file_size)} • {getFileTypeLabel(asset.mime_type)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 pr-3">
                        <Button variant="ghost" size="icon" onClick={() => setPreviewAsset(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/editor/${asset.id}`)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setMoveAssetDialog({ open: true, assetId: asset.id })}>
                              <Move className="mr-2 h-4 w-4" />
                              Move
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteAsset(asset.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>


      <Dialog open={!!previewAsset} onOpenChange={() => setPreviewAsset(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{previewAsset?.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setPreviewAsset(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center bg-black/5 rounded-lg overflow-hidden" style={{ maxHeight: "60vh" }}>
            {previewAsset?.type === "image" ? (
              <img
                src={previewAsset.file_url}
                alt={previewAsset.name}
                className="max-w-full max-h-[60vh] object-contain"
              />
            ) : previewAsset?.type === "video" ? (
              <video
                src={previewAsset.file_url}
                controls
                className="max-w-full max-h-[60vh]"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12">
                {getAssetIcon(previewAsset?.type || "other", previewAsset?.mime_type)}
                <p className="mt-4 text-muted-foreground">Preview not available for this file type</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewAsset(null)}>
              Close
            </Button>
            <Button onClick={() => router.push(`/editor/${previewAsset?.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={moveAssetDialog.open} onOpenChange={(open) => setMoveAssetDialog({ open, assetId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
            <DialogDescription>
              Select a folder to move this file to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleMoveAsset(null)}
            >
              <Home className="mr-2 h-4 w-4" />
              Main Folder
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleMoveAsset(folder.id)}
              >
                <Folder className="mr-2 h-4 w-4 text-yellow-500" />
                {folder.name}
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveAssetDialog({ open: false, assetId: null })}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
