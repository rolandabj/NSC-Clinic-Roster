/** Future coverage budgets shared by doctor and Nurse Clinic jobs. */
export interface CapacityJob {
  id: string;
  date: string;
  hours: number;
  /** Nurses available and eligible for this job on this date. */
  nurseIds: string[];
}

interface Edge { to: number; reverse: number; capacity: number }
const EPSILON = 1e-8;

/**
 * An optimistic hours check, not a roster solver: one nurse budget is shared between
 * all their specialties and dates. A nurse's daily capacity is capped at one shift.
 * Rest, whole shifts and rolling limits are still checked when placing actual duties.
 * An existing shortage does not freeze other work: protect the coverage still possible.
 */
export function futureCapacity(jobs: readonly CapacityJob[], budgets: ReadonlyMap<string, number>) {
  const solve = (omit?: string): number => {
    const graph: Edge[][] = [[], []];
    const node = () => { graph.push([]); return graph.length - 1; };
    const edge = (from: number, to: number, capacity: number) => {
      graph[from].push({ to, reverse: graph[to].length, capacity });
      graph[to].push({ to: from, reverse: graph[from].length - 1, capacity: 0 });
    };
    const nurseNodes = new Map<string, number>();
    for (const [id, hours] of budgets) {
      if (id === omit || hours <= EPSILON) continue;
      const n = node(); nurseNodes.set(id, n); edge(0, n, hours);
    }
    const dates = new Map<string, { node: number; nurseId: string; hours: number }>();
    for (const job of jobs) {
      if (job.hours <= EPSILON) continue;
      const j = node(); edge(j, 1, job.hours);
      for (const id of new Set(job.nurseIds)) {
        if (!nurseNodes.has(id)) continue;
        const key = `${id}|${job.date}`;
        let day = dates.get(key);
        if (!day) { day = { node: node(), nurseId: id, hours: 0 }; dates.set(key, day); }
        day.hours = Math.max(day.hours, job.hours);
        edge(day.node, j, job.hours);
      }
    }
    for (const day of dates.values()) edge(nurseNodes.get(day.nurseId)!, day.node, day.hours);
    let total = 0;
    for (;;) {
      const level = new Int32Array(graph.length).fill(-1);
      const queue = [0]; level[0] = 0;
      for (let head = 0; head < queue.length; head++) {
        const from = queue[head];
        for (const e of graph[from]) if (e.capacity > EPSILON && level[e.to] < 0) {
          level[e.to] = level[from] + 1; queue.push(e.to);
        }
      }
      if (level[1] < 0) return total;
      const next = new Int32Array(graph.length);
      const send = (from: number, available: number): number => {
        if (from === 1) return available;
        for (; next[from] < graph[from].length; next[from]++) {
          const e = graph[from][next[from]];
          if (e.capacity <= EPSILON || level[e.to] !== level[from] + 1) continue;
          const amount = send(e.to, Math.min(available, e.capacity));
          if (amount <= EPSILON) continue;
          e.capacity -= amount; graph[e.to][e.reverse].capacity += amount;
          return amount;
        }
        return 0;
      };
      for (let amount = send(0, Infinity); amount > EPSILON; amount = send(0, Infinity)) total += amount;
    }
  };
  const coverableHours = solve();
  const optional = new Map<string, number>();
  return {
    coverableHours,
    /** Most hours this nurse can spend now without reducing future achievable cover. */
    optionalHours(nurseId: string): number {
      if (!optional.has(nurseId)) {
        const required = Math.max(0, coverableHours - solve(nurseId));
        optional.set(nurseId, Math.max(0, (budgets.get(nurseId) || 0) - required));
      }
      return optional.get(nurseId)!;
    },
  };
}
