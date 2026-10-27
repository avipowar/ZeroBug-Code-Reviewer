import { requireAuth, requireUnAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { GithubConnectCard } from "@/features/github/components/github-connect-card";
import { getInstallationStatus } from "@/features/github/server/installation";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "GitHub App · Dashboard",
};

const DashboardGithubPage = async () => {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Github App"
        description="Install or disconnect the reviewer app on your github account"
      />
      <GithubConnectCard userId={session.user.id} installation={installation} />
    </>
  );
};

export default DashboardGithubPage;
