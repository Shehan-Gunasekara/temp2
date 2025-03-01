import React from "react";
// import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card"; // Reusing your Card component

interface TermsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export const TermsPopup: React.FC<TermsPopupProps> = ({
  isOpen,
  onClose,
  onAgree,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card className="w-full h-full max-w-lg p-6 space-y-6 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">
          Terms and Conditions
        </h2>
        <div className="h-60 overflow-y-auto pr-2 text-gray-700 text-sm">
          <p>
            By signing up for our service, you agree to the following terms and
            conditions. Please read them carefully before proceeding.
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-2">
            <li>You must be at least 18 years old to use our platform.</li>
            <li>
              Your personal information will be processed in accordance with
              our privacy policy.
            </li>
            <li>
              You agree not to use our services for unlawful or prohibited
              activities.
            </li>
            <li>
              We reserve the right to suspend or terminate your account for
              violations of these terms.
            </li>
          </ul>
          <p className="mt-4">
            For full details, please refer to our{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancel
          </Button>
          <Button onClick={onAgree} className="bg-black text-white hover:bg-gray-900">
            Agree
          </Button>
        </div>
      </Card>
    </div>
  );
};
