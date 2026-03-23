import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylistsByUserId,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylistsByUserId(req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireBody(["name", "description"]), async (req, res) => {
  const { name, description } = req.body;

  const playlist = await createPlaylist(
    name,
    description,
    req.user.id   
  );

  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);

  if (!playlist) return res.status(404).send("Playlist not found.");

  if (playlist.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res, next) => {
  try {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/tracks", requireBody(["trackId"]), async (req, res, next) => {
  try {
    const trackId = Number(req.body.trackId);

    if (isNaN(trackId)) {
      return res.status(400).send("trackId must be a number.");
    }

    const track = await getTrackById(trackId);
    if (!track) {
      return res.status(400).send("Track not found.");
    }

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  } catch (err) {
    next(err);
  }
});