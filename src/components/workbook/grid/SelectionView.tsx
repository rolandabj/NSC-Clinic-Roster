import React, { useSyncExternalStore } from 'react';
import type { GridSelection, GridSelectionState } from './gridSelection';

/**
 * A part of the grid that shows the selection (the status bar, the popup). It follows the
 * store by itself, so a key press draws it again without drawing the whole grid.
 */
export const SelectionView: React.FC<{ selection: GridSelection; render: (state: GridSelectionState) => React.ReactNode }> = ({
  selection,
  render,
}) => {
  const state = useSyncExternalStore(selection.subscribe, selection.getState);
  return <>{render(state)}</>;
};
