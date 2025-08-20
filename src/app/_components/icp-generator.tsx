"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

interface ICPGeneratorProps {
  companyId: number | null;
}

type Competitor = {
  name: string;
  website: string;
  social: string;
};

const MAX_COMPETITORS = 6;

export function ICPGenerator({ companyId }: ICPGeneratorProps) {
  const [profileName, setProfileName] = useState("ICP Profile");
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "", website: "", social: "" },
    { name: "", website: "", social: "" },
    { name: "", website: "", social: "" },
  ]);

  const canAddMore = competitors.length < MAX_COMPETITORS;

  const hasAnyData = useMemo(
    () =>
      competitors.some(
        (c) => c.name.trim() || c.website.trim() || c.social.trim(),
      ),
    [competitors],
  );

  const bulkUpdate = api.company.bulkUpdateData.useMutation();
  const generateICP = api.icp.generate.useMutation();

  const handleAddCompetitor = () => {
    if (!canAddMore) return;
    setCompetitors((prev) => [...prev, { name: "", website: "", social: "" }]);
  };

  const handleRemoveCompetitor = (idx: number) => {
    setCompetitors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (
    idx: number,
    field: keyof Competitor,
    value: string,
  ) => {
    setCompetitors((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    );
  };

  const handleGenerate = async () => {
    if (!companyId) {
      alert("Select a company first from the list on the left.");
      return;
    }

    if (!profileName.trim()) {
      alert("Enter a profile name.");
      return;
    }

    const updates: Array<{ fieldName: string; fieldValue: string }> = [];
    competitors.forEach((c, i) => {
      const index = i + 1;
      if (c.name.trim())
        updates.push({
          fieldName: `competitor${index}_name`,
          fieldValue: c.name.trim(),
        });
      if (c.website.trim())
        updates.push({
          fieldName: `competitor${index}_website`,
          fieldValue: c.website.trim(),
        });
      if (c.social.trim())
        updates.push({
          fieldName: `competitor${index}_social`,
          fieldValue: c.social.trim(),
        });
    });

    try {
      if (updates.length > 0) {
        await bulkUpdate.mutateAsync({ companyId, companyData: updates });
      }

      const description = competitors
        .map((c) => c.name)
        .filter(Boolean)
        .join(", ");

      await generateICP.mutateAsync({
        companyId,
        name: profileName.trim(),
        description: description
          ? `Based on competitors: ${description}`
          : undefined,
      });
      alert("ICP generated.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate ICP. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-100 md:text-2xl">
            ICP Generator
          </h2>
          <p className="text-sm text-gray-400">
            Input competitor data to generate Ideal Customer Personas.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#0b0c10] p-4 md:p-6">
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              ICP Profile Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-[#0f1115] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="e.g., Core ICP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Selected Company
            </label>
            <input
              disabled
              value={
                companyId ? String(companyId) : "Select a company on the left"
              }
              className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-700 bg-[#0f1115] px-3 py-2 text-sm text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-300">
            Competitors (1-6)
          </div>
          {competitors.map((c, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-800 bg-[#0f1115] p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-200">
                  Name of Competitor
                </div>
                {competitors.length > 1 && (
                  <button
                    onClick={() => handleRemoveCompetitor(idx)}
                    className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    aria-label="Remove competitor"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={c.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                placeholder="Competitor Inc."
                className="mb-3 block w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-gray-400">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={c.website}
                    onChange={(e) =>
                      handleChange(idx, "website", e.target.value)
                    }
                    placeholder="https://competitor.com"
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400">
                    Social Media (e.g., LinkedIn)
                  </label>
                  <input
                    type="url"
                    value={c.social}
                    onChange={(e) =>
                      handleChange(idx, "social", e.target.value)
                    }
                    placeholder="https://linkedin.com/company/competitor"
                    className="mt-1 block w-full rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddCompetitor}
              disabled={!canAddMore}
              className="rounded-md border border-gray-700 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Competitor
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={
                  !companyId ||
                  !hasAnyData ||
                  generateICP.isPending ||
                  bulkUpdate.isPending
                }
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generateICP.isPending || bulkUpdate.isPending
                  ? "Generating..."
                  : "Generate ICP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
