# FlowMind AI State Management

We use Zustand as our lightweight, reactive global state manager.

## Global Stores

1. **`authStore.ts`**:
   - Manages active user profiles, login tokens (JWTs), user organization settings, and permissions.
   - Synchronizes state to `localStorage` using Zustand's `persist` middleware, enabling persistent sessions across tab loads.
2. **`organizationStore.ts`**:
   - Manages active organizational domains and workspace switches.
3. **`uiStore.ts`**:
   - Manages desktop/mobile sidebar state toggles and current client theme choices (light, dark, system).
4. **`realtimeStore.ts`**:
   - Manages socket.io state triggers, active execution statuses, and metric updates.

## Best Practices
- **Partial Storage**: We only select the minimal state required inside individual components to limit redundant re-renders (e.g. `const role = useAuthStore(state => state.role)`).
- **Offline States**: Offline state hooks disable mutations and show sticky banner warnings without triggering queries refetch loops.
