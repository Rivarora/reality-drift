import { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import DriftCard from '@/components/DriftCard';
import LiveChat from '@/components/LiveChat';
import { store } from '@/lib/store';
import { Activity, TrendingUp, AlertTriangle, Target } from 'lucide-react';
const Dashboard = () => {
  const entities = store.getEntities();
  const drifts = store.getDrifts();

  const stats = useMemo(() => {
    const highSev = drifts.filter(d => d.severity === 'HIGH').length;
    const avgConf = drifts.length ? Math.round(drifts.reduce((s, d) => s + d.confidence, 0) / drifts.length) : 0;
    return { total: entities.length, driftEvents: drifts.length, highSev, avgConf };
  }, [entities, drifts]);

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-4rem)]">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Real-time AI drift monitoring and analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Entities" value={stats.total} icon={Activity} />
            <StatCard label="Drift Events" value={stats.driftEvents} icon={TrendingUp} />
            <StatCard label="High Severity" value={stats.highSev} icon={AlertTriangle} iconColor="text-destructive" />
            <StatCard label="Avg Confidence" value={stats.avgConf ? `${stats.avgConf}%` : '—'} icon={Target} iconColor="severity-low" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-4">Recent Drift Activity</h2>
          {drifts.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <Activity className="mx-auto mb-3 text-muted-foreground" size={40} />
              <p className="text-muted-foreground">No drift events detected yet.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Create entities and trigger events to see drift analysis here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {drifts.slice(0, 10).map(d => <DriftCard key={d.id} drift={d} />)}
            </div>
          )}
        </div>

        {/* Live Chat column */}
        <div className="w-72 shrink-0 rounded-lg border border-border bg-card flex flex-col overflow-hidden">
          <LiveChat />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
