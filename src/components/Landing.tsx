import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Video Ad Exchange Platform</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Watch ads to earn credits and promote your own products. Join our
          community of advertisers and consumers today.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
