"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    createdAt: Date;
    companyData: Array<{
      id: string;
      fieldName: string;
      fieldValue: string;
    }>;
  };
  isSelected: boolean;
  onClick: () => void;
}

export function CompanyCard({
  company,
  isSelected,
  onClick,
}: CompanyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const updateCompanyData = api.company.updateData.useMutation();
  const deleteCompany = api.company.delete.useMutation();

  const handleAddField = () => {
    if (newFieldName.trim() && newFieldValue.trim()) {
      updateCompanyData.mutate({
        companyId: company.id,
        fieldName: newFieldName.trim(),
        fieldValue: newFieldValue.trim(),
      });
      setNewFieldName("");
      setNewFieldValue("");
    }
  };

  return (
    <div
      className={`cursor-pointer rounded-lg border bg-[#0f1115] p-4 shadow-sm transition-all hover:shadow-md ${
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-500/20"
          : "border-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-100">
            {company.name}
          </h3>
          <p className="text-sm text-gray-400">
            Created {new Date(company.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {company.companyData.slice(0, 3).map((data) => (
              <span
                key={data.id}
                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
              >
                {data.fieldName}: {data.fieldValue}
              </span>
            ))}
            {company.companyData.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                +{company.companyData.length - 3} more
              </span>
            )}
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
              if (confirm("Are you sure you want to delete this company?")) {
                deleteCompany.mutate({ id: company.id });
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
            <h4 className="text-sm font-medium text-gray-100">Company Data</h4>
            <div className="space-y-2">
              {company.companyData.map((data) => (
                <div
                  key={data.id}
                  className="flex items-center justify-between rounded-md bg-gray-800 px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-300">
                      {data.fieldName}:
                    </span>
                    <span className="ml-2 text-sm text-gray-400">
                      {data.fieldValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-100">Add New Field</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Field name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="flex-1 rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                placeholder="Field value"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                className="flex-1 rounded-md border border-gray-700 bg-[#0b0c10] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddField();
                }}
                disabled={!newFieldName.trim() || !newFieldValue.trim()}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
