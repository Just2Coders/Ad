import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface VerificationPromptProps {
  isOpen?: boolean;
  onVerify?: (code: string) => void;
  onClose?: () => void;
  isError?: boolean;
  isSuccess?: boolean;
}

const VerificationPrompt = ({
  isOpen = true,
  onVerify = () => {},
  onClose = () => {},
  isError = false,
  isSuccess = false,
}: VerificationPromptProps) => {
  const [code, setCode] = React.useState("");

  React.useEffect(() => {
    // Reset code when dialog opens
    setCode("");
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Enter Verification Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter the code shown in the video"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`text-center text-lg ${isError ? "border-red-500" : ""} ${isSuccess ? "border-green-500" : ""}`}
            />

            {isError && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Invalid code. Please try again.</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Code verified successfully!</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!code.trim() || isSuccess}>
              Verify
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationPrompt;
