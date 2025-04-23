
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, User } from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8 bg-cashdapp-gray animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </Button>
          </div>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-2">Profile</h2>
            <p className="text-gray-400">Update your email, username, and other profile details here.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Security</h2>
            <p className="text-gray-400">Change your password, enable 2FA, and manage security settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">Preferences</h2>
            <p className="text-gray-400">Personalize your notification and appearance preferences.</p>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
