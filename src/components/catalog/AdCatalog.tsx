import { useState, useEffect } from "react";
import VideoPlayer from "../VideoPlayer";
import VerificationPrompt from "../VerificationPrompt";
import { useAuth } from "@/lib/auth";
import { getAds, getViewedAds, markAdAsViewed, getUserQuota } from "@/lib/api";
import { Ad, ViewedAd, AdQuota } from "@/lib/types";
import { useToast } from "../ui/use-toast";

interface AdCatalogProps {
  searchQuery?: string;
  selectedCategory?: string;
  onWatchComplete?: () => void;
}

export default function AdCatalog({
  searchQuery = "",
  selectedCategory = "All",
  onWatchComplete = () => {},
}: AdCatalogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [viewedAds, setViewedAds] = useState<ViewedAd[]>([]);
  const [userQuota, setUserQuota] = useState<AdQuota | null>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [adsData, viewedData, quotaData] = await Promise.all([
        getAds(),
        getViewedAds(user.id),
        getUserQuota(user.id),
      ]);

      console.log("Loaded data:", { adsData, viewedData, quotaData });

      setAds(adsData);
      setViewedAds(viewedData);
      setUserQuota(quotaData);
      onWatchComplete(); // Update header progress
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load ads",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAdViewed = (ad: Ad) => {
    return viewedAds.some((v) => v.ad_id === ad.id && v.is_valid);
  };

  const handleAdClick = (ad: Ad) => {
    if (isAdViewed(ad)) return; // Prevent clicking viewed ads
    setSelectedAd(ad);
    setShowVideo(true);
    setVerificationCode("");
    setVerificationError(false);
    setVerificationSuccess(false);
  };

  const handleVideoClose = () => {
    setShowVideo(false);
    setShowVerification(true);
  };

  const handleCodeAppear = (code: string) => {
    setVerificationCode(code);
  };

  const handleVerify = async (code: string) => {
    if (code === verificationCode && selectedAd) {
      try {
        await markAdAsViewed(selectedAd.id, code);
        setVerificationSuccess(true);
        setVerificationError(false);
        setTimeout(() => {
          setShowVerification(false);
          setSelectedAd(null);
          loadData(); // Reload data to update viewed ads
        }, 1500);
      } catch (error) {
        console.error("Error verifying ad:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify ad view",
        });
      }
    } else {
      setVerificationError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => {
          const viewed = isAdViewed(ad);
          return (
            <div
              key={ad.id}
              className={`bg-white rounded-lg overflow-hidden shadow-md transition-shadow ${viewed ? "opacity-50" : "hover:shadow-lg cursor-pointer"}`}
              onClick={() => !viewed && handleAdClick(ad)}
            >
              <div className="aspect-video relative group">
                <img
                  src={ad.thumbnail}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                />
                {!viewed && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium">Watch Ad</span>
                  </div>
                )}
                {viewed && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium">
                      Already Viewed
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{ad.title}</h3>
                <p className="text-sm text-muted-foreground">{ad.category}</p>
                {ad.price && (
                  <p className="text-sm font-medium">${ad.price.toFixed(2)}</p>
                )}
              </div>
            </div>
          );
        })}

        {!isLoading && filteredAds.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No ads found matching your criteria
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideo && selectedAd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <VideoPlayer
            videoUrl={selectedAd.video_url}
            minWatchTime={5}
            onClose={handleVideoClose}
            onCodeAppear={handleCodeAppear}
          />
        </div>
      )}

      {/* Verification Dialog */}
      <VerificationPrompt
        isOpen={showVerification}
        onVerify={handleVerify}
        onClose={() => {
          setShowVerification(false);
          setSelectedAd(null);
        }}
        isError={verificationError}
        isSuccess={verificationSuccess}
      />
    </>
  );
}
