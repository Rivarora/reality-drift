import DashboardLayout from '@/components/DashboardLayout';
import { store } from '@/lib/store';
import { FileCode, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AILogs = () => {
  const logs = store.getLogs();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Analysis Logs</h1>
        <p className="text-muted-foreground mt-1">Detailed AI request and response logs</p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <FileCode className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No AI logs available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map(log => (
            <div key={log.id} className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{log.entityName}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock size={12} /> {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</p>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono font-semibold bg-primary/15 text-primary border border-primary/30">AI LOG</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Request Data</p>
                <pre className="rounded-lg bg-input border border-border p-4 text-sm text-muted-foreground font-mono overflow-x-auto">
{JSON.stringify(log.requestData, null, 2)}
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">AI Response</p>
                <pre className="rounded-lg bg-input border border-border p-4 text-xs severity-low font-mono overflow-x-auto">
{JSON.stringify({
  driftDetected: log.responseData.driftDetected,
  changeSummary: log.responseData.changeSummary,
  severity: log.responseData.severity,
  confidence: log.responseData.confidence,
  explanation: log.responseData.explanation,
  recommendedAction: log.responseData.recommendedAction,
}, null, 2)}
                </pre>
              </div>

              <p className="text-xs text-muted-foreground/60 font-mono">Log ID: {log.id.slice(0, 8)}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AILogs;
