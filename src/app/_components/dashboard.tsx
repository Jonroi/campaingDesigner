"use client";

import { useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { CompanyCard } from "./company-card";
import { CreateCompanyModal } from "./create-company-modal";
import { ICPProfileCard } from "./icp-profile-card";
import { CampaignCard } from "./campaign-card";
import { ICPGenerator } from "./icp-generator";
import { Sidebar } from "./sidebar";
import { CompanyProfile } from "./company-profile";

export function Dashboard() {
  type Company = RouterOutputs["company"]["list"][number];
  type ICP = RouterOutputs["icp"]["list"][number];
  type Campaign = RouterOutputs["campaign"]["list"][number];
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [selectedICP, setSelectedICP] = useState<string | null>(null);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "generator" | "icp" | "designer" | "library"
  >("generator");
  const [sidebarTab, setSidebarTab] = useState("insights");

  const { data: companies, refetch: refetchCompanies } =
    api.company.list.useQuery();
  const { data: icpProfiles, refetch: refetchICPs } = api.icp.list.useQuery(
    { companyId: selectedCompany! },
    { enabled: !!selectedCompany },
  );
  const { data: campaigns, refetch: refetchCampaigns } =
    api.campaign.list.useQuery(
      { icpId: selectedICP! },
      { enabled: !!selectedICP },
    );

  const createCompany = api.company.create.useMutation({
    onSuccess: async () => {
      await refetchCompanies();
      setShowCreateCompany(false);
    },
  });

  const generateICP = api.icp.generate.useMutation({
    onSuccess: async () => {
      await refetchICPs();
    },
  });

  const generateCampaign = api.campaign.generate.useMutation({
    onSuccess: async () => {
      await refetchCampaigns();
    },
  });

  return (
    <div className="flex min-h-screen bg-[#0b0c10]">
      {/* Sidebar */}
      <Sidebar activeTab={sidebarTab} onTabChange={setSidebarTab} />

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <div className="border-b border-gray-800 bg-[#0f1115]">
          <div className="px-6">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-white">Simple</span>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
                  <div className="absolute right-1 h-4 w-4 rounded-full bg-white transition-transform"></div>
                </div>
                <span className="text-white">Pro</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                  <span className="text-sm font-medium text-white">U</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {sidebarTab === "profile" ? (
            <CompanyProfile companyId={selectedCompany} />
          ) : (
            <>
              {/* Page Title */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-100">
                  ICP & Campaign Insights
                </h1>
                <p className="text-sm text-gray-400">
                  Generate customer profiles and design winning campaigns with
                  AI.
                </p>
              </div>
              {/* Stats Overview */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-[#0f1115] p-6 shadow-sm ring-1 ring-gray-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20">
                        <svg
                          className="h-5 w-5 text-indigo-400"
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
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">
                        Companies
                      </p>
                      <p className="text-2xl font-semibold text-gray-100">
                        {(companies as Company[])?.length ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#0f1115] p-6 shadow-sm ring-1 ring-gray-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600/20">
                        <svg
                          className="h-5 w-5 text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">
                        ICP Profiles
                      </p>
                      <p className="text-2xl font-semibold text-gray-100">
                        {icpProfiles?.length ?? 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[#0f1115] p-6 shadow-sm ring-1 ring-gray-800">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20">
                        <svg
                          className="h-5 w-5 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">
                        Campaigns
                      </p>
                      <p className="text-2xl font-semibold text-gray-100">
                        {campaigns?.length ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                {/* Companies Section */}
                <div className="space-y-4 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-100">
                      Companies
                    </h2>
                    <div className="text-sm text-gray-400">
                      {companies?.length ?? 0} total
                    </div>
                  </div>
                  <div className="space-y-3">
                    {companies?.map((company: Company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        isSelected={selectedCompany === company.id}
                        onClick={() => {
                          setSelectedCompany(company.id);
                          setSelectedICP(null);
                        }}
                      />
                    ))}
                    {(!companies || companies.length === 0) && (
                      <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
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
                        <h3 className="mt-2 text-sm font-medium text-gray-100">
                          No companies
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          Get started by creating your first company.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={() => setShowCreateCompany(true)}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Add Company
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel with Tabs */}
                <div className="space-y-4 lg:col-span-3">
                  <div className="rounded-xl border border-gray-800 bg-[#0f1115]">
                    <div className="flex flex-wrap items-center gap-1 border-b border-gray-800 p-2">
                      {[
                        { id: "generator", label: "ICP Generator" },
                        { id: "icp", label: "ICP Profiles" },
                        { id: "designer", label: "Campaign Designer" },
                        { id: "library", label: "Campaign Idea Library" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() =>
                            setActiveTab(tab.id as typeof activeTab)
                          }
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? "bg-[#0b0c10] text-gray-100"
                              : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 md:p-6">
                      {activeTab === "generator" && (
                        <ICPGenerator companyId={selectedCompany} />
                      )}

                      {activeTab === "icp" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-100">
                              ICP Profiles
                            </h2>
                            {selectedCompany && (
                              <button
                                onClick={() => {
                                  const name = prompt(
                                    "Enter ICP profile name:",
                                  );
                                  if (name) {
                                    const desc = prompt(
                                      "Enter description (optional):",
                                    );
                                    generateICP.mutate({
                                      companyId: selectedCompany,
                                      name,
                                      description: desc ?? undefined,
                                    });
                                  }
                                }}
                                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
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
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Generate ICP
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            {icpProfiles?.map((icp: ICP) => (
                              <ICPProfileCard
                                key={icp.id}
                                icp={icp}
                                isSelected={selectedICP === icp.id}
                                onClick={() => setSelectedICP(icp.id)}
                              />
                            ))}
                            {(!icpProfiles || icpProfiles.length === 0) && (
                              <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
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
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-100">
                                  No ICP profiles
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                  {selectedCompany
                                    ? "Select a company to generate ICP profiles."
                                    : "Select a company first to generate ICP profiles."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === "designer" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-100">
                              Campaigns
                            </h2>
                            {selectedICP && (
                              <button
                                onClick={() => {
                                  const name = prompt("Enter campaign name:");
                                  const copyStyle = prompt("Enter copy style:");
                                  const mediaType = prompt("Enter media type:");
                                  const cta = prompt("Enter call-to-action:");
                                  const hooks = prompt("Enter hooks:");
                                  if (
                                    name &&
                                    copyStyle &&
                                    mediaType &&
                                    cta &&
                                    hooks
                                  ) {
                                    generateCampaign.mutate({
                                      icpId: selectedICP,
                                      name,
                                      copyStyle,
                                      mediaType,
                                      cta,
                                      hooks,
                                    });
                                  }
                                }}
                                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
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
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Generate Campaign
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            {campaigns?.map((campaign: Campaign) => (
                              <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                              />
                            ))}
                            {(!campaigns || campaigns.length === 0) && (
                              <div className="rounded-lg border-2 border-dashed border-gray-700 p-8 text-center">
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
                                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                                  />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-100">
                                  No campaigns
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                  {selectedICP
                                    ? "Generate campaigns based on your ICP profiles."
                                    : "Select an ICP profile first to generate campaigns."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === "library" && (
                        <div className="text-sm text-gray-400">
                          Campaign Idea Library is coming soon.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Company Modal */}
      {showCreateCompany && (
        <CreateCompanyModal
          onClose={() => setShowCreateCompany(false)}
          onSubmit={(data) => createCompany.mutate(data)}
          isLoading={createCompany.isPending}
        />
      )}
    </div>
  );
}
