import { Jwt, JwtPayload  } from "jsonwebtoken";
import { toNamespacedPath } from "path";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | string;
        }
    }
}