"use client";

import { useState } from "react";

interface CreateCompanyModalProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    companyData: Array<{ fieldName: string; fieldValue: string }>;
  }) => void;
  isLoading: boolean;
}

const DEFAULT_FIELDS = [
  {
    name: "industry",
    label: "Industry",
    placeholder: "e.g., Technology, Healthcare, Finance",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "e.g., San Francisco, CA",
  },
  { name: "size", label: "Company Size", placeholder: "e.g., 10-50 employees" },
  { name: "revenue", label: "Annual Revenue", placeholder: "e.g., $1M-$10M" },
  {
    name: "targetMarket",
    label: "Target Market",
    placeholder: "e.g., B2B, B2C, Enterprise",
  },
  {
    name: "painPoints",
    label: "Pain Points",
    placeholder: "e.g., Limited resources, Need for solutions",
  },
  {
    name: "goals",
    label: "Business Goals",
    placeholder: "e.g., Growth, Efficiency, Innovation",
  },
];

export function CreateCompanyModal({
  onClose,
  onSubmit,
  isLoading,
}: CreateCompanyModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [companyData, setCompanyData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      alert("Please enter a company name");
      return;
    }

    const dataArray = Object.entries(companyData)
      .filter(([_, value]) => value.trim())
      .map(([fieldName, fieldValue]) => ({ fieldName, fieldValue }));

    onSubmit({
      name: companyName.trim(),
      companyData: dataArray,
    });
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-gray-800 bg-[#0f1115] p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-100">
            Create New Company
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter company name"
              required
            />
          </div>

          {/* Company Data Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Company Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {DEFAULT_FIELDS.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    id={field.name}
                    value={companyData[field.name] ?? ""}
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={companyData.website ?? ""}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="founded"
                  className="block text-sm font-medium text-gray-700"
                >
                  Founded Year
                </label>
                <input
                  type="number"
                  id="founded"
                  value={companyData.founded ?? ""}
                  onChange={(e) => handleFieldChange("founded", e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Company"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
