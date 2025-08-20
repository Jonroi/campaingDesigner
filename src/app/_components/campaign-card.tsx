"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    copyStyle: string;
    mediaType: string;
    adCopy: string;
    imagePrompt?: string | null;
    imageUrl?: string | null;
    cta: string;
    hooks: string;
    landingPageCopy: string;
    createdAt: Date;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: campaign.name,
    copyStyle: campaign.copyStyle,
    mediaType: campaign.mediaType,
    adCopy: campaign.adCopy,
    cta: campaign.cta,
    hooks: campaign.hooks,
    landingPageCopy: campaign.landingPageCopy,
  });

  const updateCampaign = api.campaign.update.useMutation();
  const deleteCampaign = api.campaign.delete.useMutation();

  const handleSave = () => {
    updateCampaign.mutate({
      id: campaign.id,
      ...editData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: campaign.name,
      copyStyle: campaign.copyStyle,
      mediaType: campaign.mediaType,
      adCopy: campaign.adCopy,
      cta: campaign.cta,
      hooks: campaign.hooks,
      landingPageCopy: campaign.landingPageCopy,
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-[#0f1115] p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-400">
            Created {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {campaign.copyStyle}
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              {campaign.mediaType}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
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
            onClick={() => setIsEditing(!isEditing)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this campaign?")) {
                deleteCampaign.mutate({ id: campaign.id });
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
        <div className="space-y-4 border-t border-gray-800 pt-3">
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Copy Style
                  </label>
                  <input
                    type="text"
                    value={editData.copyStyle}
                    onChange={(e) =>
                      setEditData({ ...editData, copyStyle: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Media Type
                  </label>
                  <input
                    type="text"
                    value={editData.mediaType}
                    onChange={(e) =>
                      setEditData({ ...editData, mediaType: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CTA
                  </label>
                  <input
                    type="text"
                    value={editData.cta}
                    onChange={(e) =>
                      setEditData({ ...editData, cta: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hooks
                </label>
                <textarea
                  value={editData.hooks}
                  onChange={(e) =>
                    setEditData({ ...editData, hooks: e.target.value })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ad Copy
                </label>
                <textarea
                  value={editData.adCopy}
                  onChange={(e) =>
                    setEditData({ ...editData, adCopy: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Landing Page Copy
                </label>
                <textarea
                  value={editData.landingPageCopy}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      landingPageCopy: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Ad Copy</h4>
                <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {campaign.adCopy}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Hooks</h4>
                <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {campaign.hooks}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Call to Action
                </h4>
                <p className="mt-1 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                  {campaign.cta}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Landing Page Copy
                </h4>
                <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {campaign.landingPageCopy}
                </p>
              </div>
              {campaign.imagePrompt && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Image Prompt
                  </h4>
                  <p className="mt-1 rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {campaign.imagePrompt}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
