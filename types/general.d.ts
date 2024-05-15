export type GameOptions = {
	winCases: {
		ambo: boolean;
		terno: boolean;
		cinquina: boolean;
		decina: boolean;
		tombola: boolean;
	};
	maxPlayers: number;
	minCards: number;
	maxCards: number;
};

export type Player = {
	socketId: string;
	username: string;
	avatarUrl: string;
	numCards: number | null;
};
