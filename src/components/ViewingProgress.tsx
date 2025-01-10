import React from "react";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";

interface ViewingProgressProps {
  totalRequired?: number;
  watched?: number;
}

const ViewingProgress = ({
  totalRequired = 5,
  watched = 2,
}: ViewingProgressProps) => {
  const progress = (watched / totalRequired) * 100;

  return (
    <Card className="w-[300px] p-6 bg-white">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Viewing Progress</h3>
          <span className="text-sm text-muted-foreground">
            {watched} / {totalRequired} videos
          </span>
        </div>

        <Progress value={progress} className="h-2" />

        <p className="text-sm text-muted-foreground">
          {totalRequired - watched} more videos needed to unlock ad creation
        </p>
      </div>
    </Card>
  );
};

export default ViewingProgress;
