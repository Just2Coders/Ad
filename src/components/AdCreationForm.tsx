import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { createAd, incrementUserAdsCreated } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AdCreationFormProps {
  isUnlocked?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
}

const categories = [
  "Sports",
  "Electronics",
  "Food",
  "Fashion",
  "Home",
  "Beauty",
  "Automotive",
];

const AdCreationForm = ({
  isUnlocked = false,
  onSuccess = () => {},
  onClose = () => {},
}: AdCreationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      const formData = new FormData(e.currentTarget);

      const adData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        video_url: formData.get("video_url") as string,
        thumbnail: formData.get("thumbnail") as string,
      };

      await createAd(adData);
      await incrementUserAdsCreated(user.id);

      toast({
        description: "Advertisement created successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create advertisement",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Advertisement</h2>
          {!isUnlocked && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md">
              Complete video viewing quota to unlock
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter product title"
                disabled={!isUnlocked || isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                disabled={!isUnlocked || isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price"
                disabled={!isUnlocked || isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                name="video_url"
                type="url"
                placeholder="Enter video URL"
                disabled={!isUnlocked || isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                type="url"
                placeholder="Enter thumbnail URL"
                disabled={!isUnlocked || isSubmitting}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              rows={4}
              disabled={!isUnlocked || isSubmitting}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={!isUnlocked || isSubmitting}
            >
              {isSubmitting ? (
                "Creating Advertisement..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Advertisement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default AdCreationForm;
