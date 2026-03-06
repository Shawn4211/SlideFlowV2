import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPlaylists, getAssets } from "@/lib/data/mock-data";
import { ListVideo, Plus, Play, Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function PlaylistsPage() {
  const playlists = await getPlaylists();
  const assets = await getAssets();

  const getAssetName = (assetId?: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
          <p className="text-muted-foreground">
            Create and manage content playlists
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Playlist
        </Button>
      </div>

      <div className="grid gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ListVideo className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{playlist.name}</CardTitle>
                    <CardDescription>{playlist.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={playlist.approvalStatus === "approved" ? "default" : "secondary"}>
                    {playlist.approvalStatus}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>{playlist.items.length} items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {Math.floor(playlist.items.reduce((acc, item) => acc + item.duration, 0) / 60)}m{" "}
                      {playlist.items.reduce((acc, item) => acc + item.duration, 0) % 60}s
                    </span>
                  </div>
                </div>

                
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {playlist.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-24 h-16 bg-gray-100 rounded border flex flex-col items-center justify-center text-xs"
                    >
                      <span className="font-medium">{index + 1}</span>
                      <span className="text-muted-foreground truncate w-full text-center px-1">
                        {item.itemType === "asset" ? getAssetName(item.assetId) : item.itemType}
                      </span>
                      <span className="text-muted-foreground">{item.duration}s</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Playlist
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Create New Playlist</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
              Combine images, videos, apps, and designs into a sequence
            </p>
            <Button>Create Playlist</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
