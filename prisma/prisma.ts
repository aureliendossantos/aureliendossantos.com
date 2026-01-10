import { PrismaClient } from "generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import "dotenv/config"

const connectionString = `${process.env.CATALOGUE_DB_URL}`

const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter })
