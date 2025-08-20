"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface ICPProfileCardProps {
  icp: {
    id: string;
    name: string;
    description?: string | null;
    profileData: any;
    confidenceLevel: string;
    createdAt: Date;
    campaigns: Array<{
      id: string;
      name: string;
    }>;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function ICPProfileCard({
  icp,
  isSelected,
  onClick,
}: ICPProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const deleteICP = api.icp.delete.useMutation();

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case "high":
        return (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "medium":
        return (
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "low":
        return (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border bg-[#0f1115] p-4 shadow-sm transition-all hover:shadow-md ${
        isSelected
          ? "border-green-500 ring-2 ring-green-500/20"
          : "border-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-100">{icp.name}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getConfidenceColor(icp.confidenceLevel)}`}
            >
              {getConfidenceIcon(icp.confidenceLevel)}
              {icp.confidenceLevel}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Created {new Date(icp.createdAt).toLocaleDateString()}
          </p>
          {icp.description && (
            <p className="mt-1 text-sm text-gray-400">{icp.description}</p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              {icp.campaigns.length} campaigns
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm("Are you sure you want to delete this ICP profile?")
              ) {
                deleteICP.mutate({ id: icp.id });
              }
            }}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
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

      {isExpanded && (
        <div className="space-y-3 border-t border-gray-800 pt-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-100">Profile Data</h4>
            <div className="space-y-2">
              {icp.profileData &&
                typeof icp.profileData === "object" &&
                Object.entries(icp.profileData as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div key={key} className="rounded-md bg-gray-800 px-3 py-2">
                      <div className="text-sm font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </div>
                      <div className="mt-1 text-sm text-gray-400">
                        {typeof value === "object" ? (
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          String(value)
                        )}
                      </div>
                    </div>
                  ),
                )}
            </div>
          </div>

          {icp.campaigns.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-100">
                Related Campaigns
              </h4>
              <div className="space-y-1">
                {icp.campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between rounded-md bg-indigo-900/20 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-indigo-400">
                      {campaign.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
