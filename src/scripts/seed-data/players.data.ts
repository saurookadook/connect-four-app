import { type UUID } from 'node:crypto';

export type PlayerSeed = {
  playerID: UUID;
  username: string;
  password: string;
};

export const playersSeedData: PlayerSeed[] = [
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
    playerID: 'f2e0eff3-8861-44fb-81d9-304cc47f1b74',
    username: 'BobbyFischer',
    password: 'ch3ssm4Ster!',
  },
];
