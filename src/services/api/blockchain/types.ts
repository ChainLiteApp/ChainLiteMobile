export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previous_hash: string;
  difficulty?: number;
}

export interface Transaction {
  sender: string;
  recipient: string;
  amount: number;
  signature: string;
  timestamp?: number;
  hash?: string;
  block_index?: number;
}

export interface Wallet {
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface MiningStatus {
  inProgress: boolean;
  lastBlock: {
    index: number;
    hash: string;
  } | null;
  nonceAttempts: number;
  hashRate: number;
  difficulty: number;
}
