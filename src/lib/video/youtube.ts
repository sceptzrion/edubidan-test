export function extractYouTubeVideoId(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.replace("/embed/", "").split("/")[0] || null;
      }

      if (parsedUrl.pathname.startsWith("/shorts/")) {
        return parsedUrl.pathname.replace("/shorts/", "").split("/")[0] || null;
      }

      return parsedUrl.searchParams.get("v");
    }

    if (host === "youtu.be") {
      return parsedUrl.pathname.replace("/", "").split("/")[0] || null;
    }

    return null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (
      (host === "youtube.com" || host === "m.youtube.com") &&
      parsedUrl.pathname.startsWith("/embed/")
    ) {
      return parsedUrl.toString();
    }

    const videoId = extractYouTubeVideoId(url);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function parseIsoDurationToSeconds(duration: string) {
  const match = duration.match(
    /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );

  if (!match) return null;

  const weeks = Number(match[3] ?? 0);
  const days = Number(match[4] ?? 0);
  const hours = Number(match[5] ?? 0);
  const minutes = Number(match[6] ?? 0);
  const seconds = Number(match[7] ?? 0);

  return (
    weeks * 7 * 24 * 60 * 60 +
    days * 24 * 60 * 60 +
    hours * 60 * 60 +
    minutes * 60 +
    seconds
  );
}

export async function getYouTubeVideoDurationMinutes(url?: string | null) {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  const videoId = extractYouTubeVideoId(url);

  if (!apiKey || !videoId) return null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const result = (await response.json()) as {
      items?: Array<{
        contentDetails?: {
          duration?: string;
        };
      }>;
    };

    const duration = result.items?.[0]?.contentDetails?.duration;

    if (!duration) return null;

    const seconds = parseIsoDurationToSeconds(duration);

    if (!seconds || seconds <= 0) return null;

    return Math.ceil(seconds / 60);
  } catch (error) {
    console.error("Failed to get YouTube video duration:", error);

    return null;
  }
}

export function roundUpToNearestFive(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return 0;

  return Math.ceil(minutes / 5) * 5;
}

export function formatMinutes(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return "- menit";

  return `${minutes} menit`;
}

export function formatRoundedModuleMinutes(minutes: number | null | undefined) {
  const roundedMinutes = roundUpToNearestFive(minutes ?? 0);

  return `${roundedMinutes} menit`;
}