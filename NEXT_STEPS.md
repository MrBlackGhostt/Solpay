# Phase 7: SPL Token Support (Proposed)

Currently, SolPay only handles SOL. A real wallet needs to support tokens like **USDC, BONK, or Tether**.

## Implementation Plan

### 1. Token Assets (Dashboard)
- Fetch owned token accounts via `connection.getParsedTokenAccountsByOwner`
- Display Token Name, Symbol, and Balance
- Auto-refresh support

### 2. Send Tokens (SendModal)
- Update the "Send" modal to include a **Token Selector**
- Handle token decimals (e.g., USDC has 6 decimals, SOL has 9)
- Use `createTransferInstruction` for SPL transfers

### Dependencies
- `@solana/spl-token`

Shall we start this phase? 🚀
