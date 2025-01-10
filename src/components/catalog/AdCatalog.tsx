import { useState } from "react";
import VideoPlayer from "../VideoPlayer";
import VerificationPrompt from "../VerificationPrompt";

interface Ad {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
}

interface AdCatalogProps {
  searchQuery?: string;
  selectedCategory?: string;
  onWatchComplete?: () => void;
  ads?: Ad[];
}

export default function AdCatalog({
  searchQuery = "",
  selectedCategory = "All",
  onWatchComplete = () => {},
  ads = [
    {
      id: "1",
      title: "Sports Equipment Pro",
      category: "Sports",
      videoUrl: "https://download.samplelib.com/mp4/sample-5s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
      views: 150,
    },
    {
      id: "2",
      title: "Latest Smartphone Review",
      category: "Electronics",
      videoUrl: "https://download.samplelib.com/mp4/sample-10s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      views: 300,
    },
    {
      id: "3",
      title: "Gourmet Pizza Making",
      category: "Food",
      videoUrl: "https://download.samplelib.com/mp4/sample-15s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      views: 250,
    },
    {
      id: "5",
      title: "Luxury Car Review",
      category: "Automotive",
      videoUrl: "https://download.samplelib.com/mp4/sample-30s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      views: 420,
    },
    {
      id: "6",
      title: "Smart Home Gadgets",
      category: "Electronics",
      videoUrl: "https://download.samplelib.com/mp4/sample-15s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1558002038-1055907df827",
      views: 280,
    },
    {
      id: "7",
      title: "Makeup Tutorial",
      category: "Beauty",
      videoUrl: "https://download.samplelib.com/mp4/sample-20s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
      views: 310,
    },
    {
      id: "4",
      title: "Summer Fashion Collection",
      category: "Fashion",
      videoUrl: "https://download.samplelib.com/mp4/sample-20s.mp4",
      thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050",
      views: 180,
    },
  ],
}: AdCatalogProps) {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || ad.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdClick = (ad: Ad) => {
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

  const handleVerify = (code: string) => {
    if (code === verificationCode) {
      setVerificationSuccess(true);
      setVerificationError(false);
      setTimeout(() => {
        setShowVerification(false);
        setSelectedAd(null);
        setVerificationCode("");
        onWatchComplete();
      }, 1500);
    } else {
      setVerificationError(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleAdClick(ad)}
          >
            <div className="aspect-video relative group">
              <img
                src={ad.thumbnail}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium">Watch Ad</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{ad.title}</h3>
              <p className="text-sm text-muted-foreground">{ad.category}</p>
              <p className="text-sm text-muted-foreground">{ad.views} views</p>
            </div>
          </div>
        ))}

        {filteredAds.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No ads found matching your criteria
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideo && selectedAd && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <VideoPlayer
            videoUrl={selectedAd.videoUrl}
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
          setVerificationCode("");
        }}
        isError={verificationError}
        isSuccess={verificationSuccess}
      />
    </>
  );
}
