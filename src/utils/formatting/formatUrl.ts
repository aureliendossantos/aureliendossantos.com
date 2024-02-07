export const getDomainName = (url: string, keepPages = false) => {
	const string = url.replace("http://", "").replace("https://", "").replace("www.", "")
	if (keepPages) return string
	return string.replace(/\/.*/, "")
}
