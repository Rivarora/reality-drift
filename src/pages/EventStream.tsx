import { useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { store } from '@/lib/store';
import { DriftEvent } from '@/lib/types';
import { analyzeDrift } from '@/lib/drift-engine';
import { v4 } from '@/lib/utils-id';
import { Plus, Radio, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EVENT_TYPES: DriftEvent['eventType'][] = ['accident', 'status_change', 'policy_update', 'news_alert'];

const EventStream = () => {
  const [events, setEvents] = useState(store.getEvents());
  const entities = store.getEntities();
  const [showForm, setShowForm] = useState(false);
  const [entityId, setEntityId] = useState('');
  const [eventType, setEventType] = useState<DriftEvent['eventType']>('status_change');
  const [description, setDescription] = useState('');
  const [newState, setNewState] = useState('');

  const refresh = useCallback(() => setEvents(store.getEvents()), []);

  const handleTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const entity = entities.find(en => en.id === entityId);
    if (!entity) return;

    const event: DriftEvent = { id: v4(), entityId, entityName: entity.name, eventType, description, newState, timestamp: new Date().toISOString() };
    store.addEvent(event);

    // Run drift analysis
    const drift = analyzeDrift(entity.id, entity.name, entity.currentState, newState);
    store.addDrift(drift);
    store.addLog({
      id: v4(),
      entityId: entity.id,
      entityName: entity.name,
      requestData: { previous_state: entity.currentState, current_state: newState },
      responseData: drift,
      timestamp: new Date().toISOString(),
    });

    // Update entity state
    store.updateEntity(entity.id, { currentState: newState });

    setEntityId(''); setDescription(''); setNewState(''); setShowForm(false);
    refresh();
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Stream</h1>
          <p className="text-muted-foreground mt-1">Trigger events and monitor real-time drift detection</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus size={16} /> Trigger Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleTrigger} className="rounded-lg border border-border bg-card p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-foreground">Trigger New Event</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Entity</label>
              <select value={entityId} onChange={e => setEntityId(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select entity</option>
                {entities.map(en => <option key={en.id} value={en.id}>{en.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value as DriftEvent['eventType'])} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Brief description of the event" className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New State</label>
            <textarea value={newState} onChange={e => setNewState(e.target.value)} required placeholder="Describe the new state after this event..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Trigger Event</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Live Event Feed</h3>
        {events.length === 0 ? (
          <div className="text-center py-8">
            <Radio className="mx-auto mb-3 text-muted-foreground" size={40} />
            <p className="text-muted-foreground">No events recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <AlertCircle size={16} className="text-primary mt-1" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{ev.eventType.toUpperCase()}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{formatDistanceToNow(new Date(ev.timestamp), { addSuffix: true })}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{ev.entityName || ev.eventType}</p>
                  <p className="text-xs text-muted-foreground/60 font-mono">Entity ID: {ev.entityId.slice(0, 8)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventStream;
