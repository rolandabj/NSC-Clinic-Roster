/** What a step of the roster's step bar does when pressed. */
export type RosterStepAction = 'fillAll' | 'fillEmpty' | 'problems' | 'publish' | 'change';

export interface RosterStep {
  label: string;
  done: boolean;
  current: boolean;
  /** None for Create, which cannot be pressed. */
  action?: RosterStepAction;
}

/**
 * The step bar: Create, Fill, Fix problems, Publish (or Send changes). The first step not
 * done is the current one.
 */
export function rosterSteps(r: {
  hasRoster: boolean;
  shiftCount: number;
  mustFix: number;
  /** The roster's status is Published. */
  published: boolean;
  /** A version of this roster was published at some time. */
  hasPublished: boolean;
  /** Cells that differ from the last published version. */
  changedSincePublish: number;
}): RosterStep[] {
  const filled = r.shiftCount > 0;
  const done = [r.hasRoster, filled, filled && r.mustFix === 0, r.published && r.changedSincePublish === 0];
  const current = done.findIndex((d) => !d);
  const steps: { label: string; action?: RosterStepAction }[] = [
    { label: 'Create' },
    { label: filled ? 'Filled' : 'Fill', action: filled ? 'fillEmpty' : 'fillAll' },
    { label: !filled ? 'Fix problems' : r.mustFix > 0 ? `Fix problems · ${r.mustFix} must fix` : 'No problems to fix', action: 'problems' },
    {
      label: r.hasPublished && r.changedSincePublish > 0 ? `Send changes (${r.changedSincePublish})` : r.published ? 'Published' : 'Publish',
      action: r.hasPublished ? 'change' : 'publish',
    },
  ];
  return steps.map((s, i) => ({ ...s, done: done[i], current: i === current }));
}
