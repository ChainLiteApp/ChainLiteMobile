# ChainLite API Examples

This document provides cURL commands to interact with the ChainLite API. The production server is available at `https://chainlite.onrender.com`.

## Request/Response Validation

### Transaction Model
```json
{
  "sender": "string (required, regex: ^0x[a-fA-F0-9]{6,}$)",
  "recipient": "string (required, regex: ^0x[a-fA-F0-9]{6,}$)", 
  "amount": "number (required, must be > 0)",
  "signature": "string (required, min length: 1)",
  "timestamp": "integer (required, epoch milliseconds)"
}
```

### Node Registration Model
```json
{
  "nodes": ["string array (required, min items: 1)"]
}
```

### Address Validation
- All wallet addresses must follow the format: `^0x[a-fA-F0-9]{6,}$`
- Example valid address: `0xabc123456789`

### Common Response Format
Most endpoints return data in this structure:
```json
{
  "data": { /* endpoint-specific data */ },
  "message": "string (for some endpoints)"
}
```

## 1. View Available Endpoints

```bash
curl -X 'GET' \
  'https://chainlite.onrender.com/' \
  -H 'accept: application/json'
```

## 2. Create a New Transaction

**Request Validation:**
- `sender` and `recipient` must be valid hex addresses (format: `^0x[a-fA-F0-9]{6,}$`)
- `amount` must be positive number
- `signature` and `timestamp` are required fields
- Server auto-generates transaction hash based on all fields

```bash
curl -X 'POST' \
  'https://chainlite.onrender.com/transactions' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "sender": "0xabc123456789",
  "recipient": "0xdef987654321",
  "amount": 10.5,
  "signature": "signed_payload_hex_or_base64",
  "timestamp": 1712345678901
}'
```

**Response:** Returns the created transaction object with auto-generated hash.

## 3. Mine a New Block

**Optional Parameters:**
- `miner_address` (query param): Valid hex address to receive mining reward (defaults to node identifier)

**Process:**
1. Performs proof-of-work algorithm
2. Adds reward transaction (1 coin to miner)
3. Creates new block with all pending transactions
4. Validates miner address format if provided

```bash
curl -X 'GET' \
  'https://chainlite.onrender.com/mine' \
  -H 'accept: application/json'
```

**With custom miner address:**
```bash
curl -X 'GET' \
  'https://chainlite.onrender.com/mine?miner_address=0xabc123456789' \
  -H 'accept: application/json'
```

**Response Format:**
```json
{
  "message": "New block forged",
  "index": 2,
  "transactions": [...],
  "nonce": 12345,
  "hash": "000abc123...",
  "previous_hash": "000def456..."
}
```

## 4. View the Full Blockchain

Returns full chain from database with each block including:
- `index`, `timestamp`, `transactions` (without internal `_id`),
- `nonce` (mapped from internal `proof`), `previous_hash`, and computed `hash`.

```bash
curl -X 'GET' \
  'https://chainlite.onrender.com/chain' \
  -H 'accept: application/json'
```

**Response Shape:**
```json
{
  "data": {
    "chain": [
      {
        "index": 1,
        "timestamp": 1712345678901,
        "transactions": [...],
        "nonce": 100,
        "previous_hash": null,
        "hash": "0000..."
      }
    ]
  }
}
```

## 5. Register New Nodes

- If body `nodes` is empty or omitted, the server auto-registers itself using its IP and the request port for mobile-friendly access.
- Each node can be provided with or without scheme; it will be normalized internally.
- Successful registrations are broadcast to existing peers.

```bash
curl -X 'POST' \
  'https://chainlite.onrender.com/nodes' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "nodes": [
    "http://node1:8000",
    "http://node2:8000"
  ]
}'
```

## 6. Resolve Chain Conflicts (Consensus)

Applies consensus algorithm by checking all registered nodes for the longest valid chain.

```bash
curl -X 'GET' \
  'https://chainlite.onrender.com/nodes/resolve' \
  -H 'accept: application/json'
```

**Response (Chain Replaced):**
```json
{
  "message": "Chain was replaced",
  "chain": [
    {
      "index": 1,
      "timestamp": 1712345678901,
      "transactions": [...],
      "nonce": 100,
      "previous_hash": null,
      "hash": "000..."
    }
  ]
}
```

**Response (Local Chain Authoritative):**
```json
{
  "message": "Local chain is authoritative"
}
```

<!-- Removed legacy/local-only sections to reflect the latest production API surface: List Nodes, Unregister Node(s), Pending Transactions, Balance, Blocks, Latest Transactions, Transaction by Hash, Transactions for Address, Mining Status. -->

## Testing the API

Here's a sequence of commands to test the basic flow:

1. **Create a transaction**:
   ```bash
   curl -X 'POST' \
    'https://chainlite.onrender.com/transactions' \
     -H 'accept: application/json' \
     -H 'Content-Type: application/json' \
     -d '{
       "sender": "0xabc123456789",
       "recipient": "0xdef987654321",
       "amount": 10.5,
       "signature": "signed_payload_hex_or_base64",
       "timestamp": 1712345678901
     }'
   ```

2. **Mine a block**:
   ```bash
   curl -X 'GET' 'https://chainlite.onrender.com/mine'
   ```

3. **View the blockchain**:
   ```bash
   curl -X 'GET' 'https://chainlite.onrender.com/chain'
   ```

4. **Register a peer node** (if you have another instance running):
   ```bash
   curl -X 'POST' 'https://chainlite.onrender.com/nodes' -H 'Content-Type: application/json' -d '{"nodes":["http://node1:8000"]}'
   ```

5. **Resolve conflicts** (if you have multiple nodes):
   ```bash
   curl -X 'GET' 'https://chainlite.onrender.com/nodes/resolve'
   ```

## Multiple Node Setup

To test the full functionality with multiple nodes, you'll need to:

1. Ensure additional nodes are reachable (e.g., `http://node1:8000`, `http://node2:8000`).
