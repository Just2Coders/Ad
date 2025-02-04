import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import VerificationPrompt from "./VerificationPrompt";
import AdCreationForm from "./AdCreationForm";
import AdCatalog from "./catalog/AdCatalog";
import { Button } from "./ui/button";
import { LogOut, Plus, Search } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { getViewedAds } from "@/lib/api";

const categories = [
  "All",
  "Sports",
  "Electronics",
  "Food",
  "Fashion",
  "Home",
  "Beauty",
  "Automotive",
];

const REQUIRED_VIEWS = 5;

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [viewedCount, setViewedCount] = useState(0);
  const [showAdForm, setShowAdForm] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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

  const handleWatchComplete = async () => {
    await loadViewedCount();
  };

  const isQuotaMet = viewedCount >= REQUIRED_VIEWS;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Progress */}
      <header className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-xl font-bold">Ad Platform</h1>

          <div className="flex items-center gap-4">
            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isQuotaMet ? "animate-pulse bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${(viewedCount / REQUIRED_VIEWS) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">
                {viewedCount}/{REQUIRED_VIEWS}
              </span>

              {isQuotaMet && (
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-2 text-green-600 border-green-600"
                  onClick={() => setShowAdForm(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Ad
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Sidebar - Categories */}
        <div className="w-64 bg-white border-r p-4">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search ads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories */}
          <h2 className="font-semibold mb-4">Categories</h2>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${selectedCategory === cat ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="w-full">
              <h2 className="text-2xl font-bold mb-6">Browse Ads</h2>
              <AdCatalog
                searchQuery={search}
                selectedCategory={selectedCategory}
                onWatchComplete={handleWatchComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Creation Dialog */}
      <Dialog open={showAdForm} onOpenChange={setShowAdForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AdCreationForm
            isUnlocked={isQuotaMet}
            onSuccess={loadViewedCount}
            onClose={() => setShowAdForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
