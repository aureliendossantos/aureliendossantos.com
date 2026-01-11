import "dotenv/config"
import ws from "ws"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "generated/prisma/client"

// Node.js environment needs a WebSocket implementation
neonConfig.webSocketConstructor = ws
const adapter = new PrismaNeon({ connectionString: process.env.CATALOGUE_DB_URL })
export const prisma = new PrismaClient({ adapter })
