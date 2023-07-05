const colorByNumber = (num: number) => {
	if (num < 100) return 0x00DC00;
	else if (num < 400) return 0xFFDC00;
	else if (num < 700) return 0xFF6400;
	else if (num < 1000) return 0xC80000;
	else return 0x000000;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export {
	colorByNumber,
	sleep,
}