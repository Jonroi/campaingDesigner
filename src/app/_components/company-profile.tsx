"use client";

import { useState } from "react";
import React from "react";
import { api } from "~/trpc/react";

interface CompanyProfileProps {
  companyId: number | null;
}

export function CompanyProfile({ companyId }: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "details" | "ai" | "notifications"
  >("profile");
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    location: "",
    industry: "",
    shortDescription: "",
    productsServices: "",
  });

  // Fetch company data
  const { data: company, isLoading } = api.company.getById.useQuery(
    { id: companyId! },
    { enabled: !!companyId },
  );

  // Update form data when company data is loaded
  React.useEffect(() => {
    if (company) {
      const companyDataMap = company.companyData.reduce(
        (acc, data) => {
          acc[data.fieldName] = data.fieldValue;
          return acc;
        },
        {} as Record<string, string>,
      );

      setFormData({
        companyName: company.name,
        website: companyDataMap.website || "",
        location: companyDataMap.location || "",
        industry: companyDataMap.industry || "",
        shortDescription: companyDataMap.shortDescription || "",
        productsServices: companyDataMap.productsServices || "",
      });
    }
  }, [company]);

  const updateCompany = api.company.update.useMutation();
  const bulkUpdateData = api.company.bulkUpdateData.useMutation();

  const handleSave = async () => {
    if (!companyId) return;

    try {
      // Update company name
      await updateCompany.mutateAsync({
        id: companyId,
        name: formData.companyName,
      });

      // Update other fields as company data
      const updates = [
        { fieldName: "website", fieldValue: formData.website },
        { fieldName: "location", fieldValue: formData.location },
        { fieldName: "industry", fieldValue: formData.industry },
        {
          fieldName: "shortDescription",
          fieldValue: formData.shortDescription,
        },
        {
          fieldName: "productsServices",
          fieldValue: formData.productsServices,
        },
      ];

      await bulkUpdateData.mutateAsync({
        companyId,
        companyData: updates,
      });

      alert("Company profile updated successfully!");
    } catch (error) {
      console.error("Failed to update company profile:", error);
      alert("Failed to update company profile. Please try again.");
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!companyId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Company Profile</h1>
          <p className="mt-1 text-sm text-gray-400">
            This information helps our AI create better personalizations for
            you.
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-[#0f1115] p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-100">
            No Company Selected
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Please select a company from the left sidebar to view and edit its
            profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Company Profile</h1>
          <p className="mt-1 text-sm text-gray-400">
            This information helps our AI create better personalizations for
            you.
          </p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-[#0f1115] p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-4 text-sm text-gray-400">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Company Profile</h1>
        <p className="mt-1 text-sm text-gray-400">
          This information helps our AI create better personalizations for you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-800">
        {[
          { id: "profile", label: "Profile" },
          { id: "details", label: "Profile Details" },
          { id: "ai", label: "AI Settings" },
          { id: "notifications", label: "Notifications" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-orange-500 bg-[#0b0c10] text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-800 bg-[#0f1115] p-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-100">Profile</h2>
                <p className="mt-1 text-sm text-gray-400">
                  This information was auto-filled from your website. Feel free
                  to edit it.
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="rounded p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="rounded p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Company Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Website */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Website
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="flex-1 rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <button className="flex items-center space-x-2 rounded-md bg-gray-700 px-4 py-2 text-gray-200 transition-colors hover:bg-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) =>
                    handleInputChange("industry", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Short Description
                  </label>
                  <div className="flex space-x-2">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Products/Services */}
              <div className="md:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Products/Services
                  </label>
                  <div className="flex space-x-2">
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <textarea
                  value={formData.productsServices}
                  onChange={(e) =>
                    handleInputChange("productsServices", e.target.value)
                  }
                  rows={3}
                  className="w-full resize-none rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="py-12 text-center">
            <p className="text-gray-400">
              Profile Details tab content coming soon...
            </p>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="py-12 text-center">
            <p className="text-gray-400">
              AI Settings tab content coming soon...
            </p>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="py-12 text-center">
            <p className="text-gray-400">
              Notifications tab content coming soon...
            </p>
          </div>
        )}
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={
            !companyId || updateCompany.isPending || bulkUpdateData.isPending
          }
          className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0b0c10] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {updateCompany.isPending || bulkUpdateData.isPending
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
