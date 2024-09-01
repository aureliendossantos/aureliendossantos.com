export type GameState = "intro" | "create" | "login" | "overview" | "fullscreen" | "error"

export const getGameState = () => {
	const gameState = sessionStorage.getItem("gameState") as GameState | null
	if (!gameState) console.error("No game state found in session storage")
	return sessionStorage.getItem("gameState") as GameState
}
