# State Management with Redux Toolkit

This document explains the state management architecture used in the ChainLite Mobile application.

## Overview

We use Redux Toolkit for state management, which provides a standardized way to write Redux logic with less boilerplate. The state is organized into feature-based slices.

## Store Structure

The main store is configured in `app/store/index.ts` and includes:

- Redux Toolkit's `configureStore` for store setup
- TypeScript types for the root state and dispatch
- Custom hooks for typed selectors and dispatch

## Slices

Each feature has its own slice in the `app/features` directory. A slice contains:

- The initial state
- Reducers (automatically generates action creators)
- Selectors

### Example: Wallet Slice

Located at `app/features/wallet/walletSlice.ts`:

```typescript
interface WalletState {
  balance: number;
  address: string | null;
  transactions: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
```

## Usage in Components

### Reading State

```typescript
import { useAppSelector } from '../store';
import { selectWallet } from '../features/wallet/walletSlice';

function MyComponent() {
  const { balance, address } = useAppSelector(selectWallet);
  // ...
}
```

### Dispatching Actions

```typescript
import { useAppDispatch } from '../store';
import { setBalance } from '../features/wallet/walletSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const updateBalance = (newBalance: number) => {
    dispatch(setBalance(newBalance));
  };
  // ...
}
```

## Best Practices

1. **Feature Organization**: Keep all related state, actions, and selectors in the same feature directory.
2. **Immutability**: Always return new state objects in reducers.
3. **Type Safety**: Use TypeScript types for all state and actions.
4. **Selectors**: Use selectors to access state to avoid unnecessary re-renders.
5. **Async Logic**: Use Redux Thunk for async operations (already included in Redux Toolkit).

## Error Handling

Use the `error` field in your state to handle and display errors to users.

## Performance

- Use React.memo for components that read from Redux
- Use selectors to compute derived data
- Normalize state shape to avoid deep nesting

## Testing

Test files should be colocated with their corresponding feature files:
- `__tests__/featureName.test.ts` for unit tests
- `__tests__/components/ComponentName.test.tsx` for component tests

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux Style Guide](https://redux.js.org/style-guide/)
