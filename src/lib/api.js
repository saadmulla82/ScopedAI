export async function requestProposal(prompt, rounds) {
  let res;
  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, rounds }),
    });
  } catch {
    throw new Error("Could not reach the server. Check your internet connection and try again.");
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (!res.ok || !data?.proposal) {
    throw new Error(data?.error || `Something went wrong (${res.status}). Please try again.`);
  }
  return data.proposal;
}
