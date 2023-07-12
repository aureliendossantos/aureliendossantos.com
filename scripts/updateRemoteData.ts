import { updateGames } from "./updateGames"
import { updatePlaces } from "./updatePlaces"

const [gameCount, placesCount] = await Promise.all([updateGames(), updatePlaces()])

console.log(`Got data for ${gameCount} games & ${placesCount} places.`)
