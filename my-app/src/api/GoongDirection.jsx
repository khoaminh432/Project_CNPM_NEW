// src/api/goongDirection.js
import GoongClient from "./GoongClient";

export async function getDirection(origin, destination, vehicle = "car") {
  const res = await GoongClient.get("/Direction", {
    params: {
      origin,        // "lat,lng"
      destination,   // "lat,lng"
      vehicle,
    },
  });
  return res.data.routes;
}
