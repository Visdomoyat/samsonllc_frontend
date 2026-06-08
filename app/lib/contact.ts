import { apiUrl } from "./env";
import { ApiError } from "./api";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function submitContact(payload: ContactPayload): Promise<{ ok: true }> {
  const response = await fetch(apiUrl("/contact/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data
        ? String((data as { error: string }).error)
        : response.statusText;
    throw new ApiError(message || "Request failed", response.status);
  }

  return data as { ok: true };
}
