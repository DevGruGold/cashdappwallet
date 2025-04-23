
import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="p-8 bg-cashdapp-gray animate-fade-in">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
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
    </div>
  );
};

export default Settings;
