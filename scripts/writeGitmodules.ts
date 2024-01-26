import "dotenv/config"
import fs from "node:fs"

fs.writeFileSync(
	".gitmodules",
	`[submodule \"src/content\"]\npath = src/content\nurl = https://${process.env.GITHUB_TOKEN}@github.com/aureliendossantos/aureliendossantos.com-content.git`
)
console.log("Wrote in .gitmodules")
