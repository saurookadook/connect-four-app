import { randomUUID, type UUID } from 'node:crypto';

type SeedPlayer = {
  playerID: UUID;
  username: string;
  password: string;
};

export const seedPlayersData: SeedPlayer[] = [
  {
    playerID: 'b56f607d-73a7-49cf-bfd7-6b054afb8c44',
    username: 'saurookadook',
    password: 'boopy1991&',
  },
  {
    playerID: 'd621e67d-bbdd-4b8a-8b50-2d3a41a9572f',
    username: 'BabbyBooby',
    password: 'ilovezero',
  },
  {
    playerID: randomUUID(),
    username: 'BobbyFischer',
    password: 'ch3ssm4Ster!',
  },
];
