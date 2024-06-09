const hostAddress = "192.168.1.10";
const port = "8006"

export const host = `${hostAddress}:${port}`;

export const username = process.env.USR;
export const password = process.env.PASSWORD!;