# FlowMind AI Workflow Builder

This document details the React Flow canvas setup and the custom Validation Engine.

## React Flow Canvas Setup

The editor canvas is located under `src/features/workflows/builder/components/WorkflowCanvas.tsx` and integrates:
- **Node Palette**: Allows drag-and-drop workflow nodes.
- **Controls & MiniMap**: Standard helper canvas widgets.
- **Dagre Auto-Layout**: Preserves layout configurations while optimizing graph rendering for large nodes collections (200+ nodes).

## Validation Engine

Validation is executed client-side and acts as a gateway before publishing workflows. All rules are situated under `src/features/workflows/builder/validation/rules/`:
1. **Start Node Rule**: Workflow must contain exactly one Start node.
2. **End Node Rule**: Workflow must contain at least one End node.
3. **Connectivity Rule**: Every node must be connected, checking that no orphan nodes exist.
4. **Cycle Detection Rule**: Evaluates the workflow using Depth-First Search (DFS) to identify and prevent circular loops.
5. **Config Validation Rule**: Inspects each node configuration form (like Prompt node configurations or chat node inputs) to ensure forms are valid before publishing.
