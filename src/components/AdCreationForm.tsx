import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImagePlus, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AdCreationFormProps {
  isUnlocked?: boolean;
  onSubmit?: (data: FormData) => void;
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
  onSubmit = () => {},
}: AdCreationFormProps) => {
  return (
    <div className="w-full max-w-[800px] min-h-[600px] mx-auto p-6 bg-white">
      <Card className="p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create New Advertisement</h2>
            {!isUnlocked && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md">
                Complete video viewing quota to unlock
              </div>
            )}
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              onSubmit(formData);
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter product title"
                  disabled={!isUnlocked}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" disabled={!isUnlocked}>
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

              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  disabled={!isUnlocked}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  rows={4}
                  disabled={!isUnlocked}
                />
              </div>

              <div>
                <Label>Product Images</Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-2 h-[150px]"
                    >
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Add Image {index}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={!isUnlocked}>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Advertisement
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AdCreationForm;
