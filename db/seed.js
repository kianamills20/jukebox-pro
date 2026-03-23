import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  for (let i = 1; i <= 3; i++) {
    const user = await createUser("user" + i, "password");
    const playlist = await createPlaylist("playlist" + i, "description", user.id);

    for (let j = 1; j <= 5; j++) {
      await createPlaylistTrack(playlist.id, (i - 1) * 5 + j);
    }
  }
}
