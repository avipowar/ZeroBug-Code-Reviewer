import { savePullRequest } from "@/features/reviews/server/save-pull-request";
import { getGithubApp } from "../utils/github-app";
import { inngest } from "@/features/inngest/client";

const REVIEWABLE_ACTIONS = ["opened", "synchronize", "reopened"];

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

async function isSignatureValid(payload: string, signature: string | null) {
  console.log("Received Signature:", signature);
  console.log("Env Secret exists?:", !!process.env.GITHUB_WEBHOOK_SECRET);
  if (!signature) {
    return false;
  }

  const app = getGithubApp();
  const isValid = await app.webhooks.verify(payload, signature);

  return isValid;
}

export async function handleGithubWebhook(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const eventName = request.headers.get("x-github-event");

  const isValid = await isSignatureValid(payload, signature);

  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (eventName !== "pull_request") {
    return Response.json({ received: true });
  }

  const event = JSON.parse(payload) as PullRequestWebhookPayload;

  console.log("Webhook received");

  console.log("Event:", event);
  console.log("Action:", event.action);
  console.log("Repository:", event.repository.full_name);
  console.log("PR Number:", event.pull_request.number);

  if (!REVIEWABLE_ACTIONS.includes(event.action)) {
    return Response.json({ received: true });
  }

  const pullRequest = await savePullRequest(event);

  await inngest.send({
    name: "github/pr.received",
    data: { pullRequestId: pullRequest.id },
  });

  return Response.json({ received: true });
}
