import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { useAuth } from "@/lib/auth";
import { getViewedAds } from "@/lib/api";

const REQUIRED_VIEWS = 5;

export default function ViewingProgress() {
  const { user } = useAuth();
  const [viewedCount, setViewedCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadViewedCount();
    }
  }, [user]);

  const loadViewedCount = async () => {
    try {
      const viewedAds = await getViewedAds(user!.id);
      setViewedCount(viewedAds.length);
    } catch (error) {
      console.error("Error loading viewed ads count:", error);
    }
  };

  const progress = (viewedCount / REQUIRED_VIEWS) * 100;

  return (
    <Card className="w-[300px] p-6 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Viewing Progress</h3>
          <span className="text-sm text-muted-foreground">
            {viewedCount} / {REQUIRED_VIEWS} videos
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <p className="text-sm text-muted-foreground">
          {REQUIRED_VIEWS - viewedCount} more videos needed to unlock ad
          creation
        </p>
      </div>
    </Card>
  );
}
