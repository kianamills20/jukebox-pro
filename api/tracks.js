import express from "express";
const router = express.Router();
export default router;

import {
  getTracks,
  getTrackById,
  getPlaylistsByTrackIdAndUserId,
} from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("Id must be a number.");
  }

  try {
    const track = await getTrackById(id);

    if (!track) {
      return res.status(404).send("Track not found.");
    }

    res.send(track);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send("Id must be a number.");
  }

  try {
    const track = await getTrackById(id);
    if (!track) {
      return res.status(404).send("Track not found.");
    }

    const playlists = await getPlaylistsByTrackIdAndUserId(id, req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});