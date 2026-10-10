import React from "react";
import prisma from "@/lib/prisma";
import { Settings as SettingsIcon, Save } from "lucide-react";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settingsList.forEach((s) => {
    settingsMap[s.keyName] = s.valueText;
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure site announcements, hero carousel images, and contact
          information.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <SettingsForm
          initialSettings={{
            site_announcement:
              settingsMap["site_announcement"] ||
              "Direct bookings now open for the 2026/2027 Southern Sri Lanka sunny season!",
            helpline_phone: settingsMap["helpline_phone"] || "+94760224529",
            admin_email: settingsMap["admin_email"] || "admin@mirissastays.com",
            hero_slides:
              settingsMap["hero_slides"] ||
              JSON.stringify(
                [
                  {
                    image:
                      "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=1920&q=80",
                    title: "Coconut Tree Hill & Mirissa Bay",
                    subtitle: "Scenic Southern Province Coastline",
                  },
                ],
                null,
                2,
              ),
          }}
        />
      </div>
    </div>
  );
}
