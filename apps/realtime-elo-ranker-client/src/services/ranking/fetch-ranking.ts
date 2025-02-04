import { PlayerData } from "@realtime-elo-ranker/libs/ui";

const URL = "/api/ranking";

/**
 * Fetch the ranking.
 * 
 * Sends a GET request to the server to fetch the ranking.
 * 
 * @returns {Promise<PlayerData[]>} A promise of future ranking data
 */
export default function fetchRanking(baseUrl: string): Promise<PlayerData[]> {
  return fetch(baseUrl + URL, { method: "GET" })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      else if (res.status === 404) {
        return [];
      }
      throw new Error("Failed to fetch ranking");
    });
}