import { getUserById } from "#db/queries/users";
import { verifyToken } from "../utils/jwt.js";

export default async function requireUser(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = verifyToken(token);
    const user = await getUserById(id);

    if (!user) {
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).send("Unauthorized");
  }
}