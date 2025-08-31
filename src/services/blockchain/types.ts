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

export interface MineResponse {
  message: string;
  index: number;
  transactions: Transaction[];
  nonce: number;
  hash: string;
  previous_hash: string;
  reward?: number;
}

export interface RegisterNodeResponse {
  message?: string;
  registered_nodes?: string[];
  total_nodes?: string[];
  total_count?: number;
}

export interface ConsensusResponse {
  message?: string;
  chain?: Block[];
}

export interface AddressActivity {
  address: string;
  sent: Array<{
    recipient: string;
    amount: string | number;
    timestamp: string | number;
    hash: string;
    block_index: string | number | null;
  }>;
  received: Array<{
    sender: string;
    amount: string | number;
    timestamp: string | number;
    hash: string;
    block_index: string | number | null;
  }>;
  total_sent: number;
  total_received: number;
  balance: number;
}
