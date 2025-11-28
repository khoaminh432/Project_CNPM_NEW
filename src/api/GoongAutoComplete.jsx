// src/api/goongAutocomplete.js
import GoongClient from "./GoongClient";

export async function autocompletePlace(input) {
  if (!input || input.length < 2) return [];
  const res = await GoongClient.get("/Place/AutoComplete", {
    params: { input },
  });
  return res.data.predictions;
}
