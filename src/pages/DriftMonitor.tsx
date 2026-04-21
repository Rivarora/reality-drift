import DashboardLayout from '@/components/DashboardLayout';
import DriftCard from '@/components/DriftCard';
import { store } from '@/lib/store';
import { Activity } from 'lucide-react';

const DriftMonitor = () => {
  const drifts = store.getDrifts();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Drift Monitor</h1>
        <p className="text-muted-foreground mt-1">Real-time drift detection and analysis</p>
      </div>

      {drifts.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <Activity className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No drift events to display.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {drifts.map(d => <DriftCard key={d.id} drift={d} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DriftMonitor;
