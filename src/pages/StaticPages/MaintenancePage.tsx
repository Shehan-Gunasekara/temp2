import React from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Wrench } from "lucide-react";

const MaintenancePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* <Navigation displayingCredits={0} /> */}
      <div className="w-full max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-xl mx-auto mb-16 space-y-4">
          <Wrench className="mx-auto w-16 h-16 text-black/60" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-br from-black to-black/60 bg-clip-text text-transparent">
            We’re Under Maintenance
          </h1>
          <p className="text-base lg:text-xl text-black/60">
            Our website is currently undergoing scheduled maintenance to improve
            your experience. Please check back soon!
          </p>
        </div>
        <div className="flex justify-center">
          <Card className="w-full max-w-xl p-8 space-y-6 text-center">
            <p className="text-lg text-black/80">
              We’re working hard to make things better for you. If you have any
              urgent inquiries, feel free to contact us via email.
            </p>
            <Button
              as="a"
              href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
              className="w-full"
              variant="primary"
            >
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default MaintenancePage;
