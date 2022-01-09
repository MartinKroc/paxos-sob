export interface VotesList {
  proposes: Array<Vote>;
}

export interface Vote {
  serverId: number;
  value: number;
}
