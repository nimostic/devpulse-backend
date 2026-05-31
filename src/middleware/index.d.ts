import type { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request{
            user?:JwtPayload
        }
    }
}

// Express এর built-in Request type এ user নামে কোনো property নেই, ekarone global tyype decalre kora hoyse