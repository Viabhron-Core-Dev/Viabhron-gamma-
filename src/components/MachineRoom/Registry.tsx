import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Globe, 
  Cpu, 
  ExternalLink, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  ShieldAlert,
  Fingerprint,
  Activity,
  Zap
} from 'lucide-react';
import { AgentRegistryEntry, AgentPermissions } from '../../types';
import { db, auth } from '../../lib/firebase';
import { collection, onSnapshot, query, doc, updateDoc } from 'firebase/firestore';

export const Registry: React.FC = () => {
  const [entries, setEntries] = useState<AgentRegistryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'resident' | 'branch' | 'external'>('all');
  const [selectedEntry, setSelectedEntry] = useState<AgentRegistryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'users', auth.currentUser.uid, 'governance', 'registry', 'entries'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        lastHeartbeat: doc.data().lastHeartbeat?.toDate() || new Date()
      })) as unknown as AgentRegistryEntry[];
      setEntries(data);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching registry:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.agentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || entry.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accredited': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'ratification': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'auditing': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'incubation': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      case 'revoked': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'resident': return <Globe className="w-4 h-4" />;
      case 'branch': return <Cpu className="w-4 h-4" />;
      case 'external': return <ExternalLink className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0c] text-slate-300 font-sans">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Sovereign Federated Registry</h1>
            <p className="text-sm text-slate-500 font-mono uppercase tracking-widest">Protocol 8009 // Agent Governance Control Plane</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">Registry Sync: Active</span>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-600/20">
            Register New Agent
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main List */}
        <div className="flex-1 flex flex-col border-r border-white/5 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-white/5 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search agents by name or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {(['all', 'resident', 'branch', 'external'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFilterTier(tier)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                    filterTier === tier 
                      ? 'bg-white/10 text-white border border-white/20' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  <span className="text-xs font-mono text-slate-500">Synchronizing Federated Index...</span>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 italic text-sm">
                No agents found in the registry.
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  layoutId={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                    selectedEntry?.id === entry.id
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        entry.status === 'accredited' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white">{entry.name}</h3>
                          <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-tighter">v{entry.version}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase">
                            {getTierIcon(entry.tier)}
                            {entry.tier}
                          </div>
                          <div className="w-1 h-1 rounded-full bg-slate-700" />
                          <div className="text-[10px] font-mono text-slate-500 uppercase">
                            ID: {entry.agentId.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence mode="wait">
          {selectedEntry ? (
            <motion.div
              key="detail"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96 bg-white/[0.01] border-l border-white/5 flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Agent Details</h2>
                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="text-slate-500 hover:text-white transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-4 shadow-2xl">
                    <Fingerprint className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedEntry.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-widest">{selectedEntry.tier} Agent // v{selectedEntry.version}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Status</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedEntry.status === 'accredited' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs font-bold text-white uppercase">{selectedEntry.status}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-500 uppercase block mb-1">Heartbeat</span>
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-bold">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Accreditation */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Accreditation ID</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-600/5 border border-blue-500/20 font-mono text-[10px] text-blue-300 break-all leading-relaxed">
                    {selectedEntry.accreditationId || 'PENDING_RATIFICATION_GATE'}
                  </div>
                </section>

                {/* Permissions Matrix */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Permissions Matrix</h4>
                  </div>
                  <div className="space-y-3">
                    <PermissionItem 
                      icon={<ShieldCheck className="w-3 h-3" />}
                      label="Sentinel Access"
                      enabled={selectedEntry.permissions.canAccessSentinel}
                    />
                    <PermissionItem 
                      icon={<Activity className="w-3 h-3" />}
                      label="Fiscal Access"
                      enabled={selectedEntry.permissions.canAccessFiscal}
                    />
                    <PermissionItem 
                      icon={<Lock className="w-3 h-3" />}
                      label="Vault Access"
                      enabled={selectedEntry.permissions.canAccessVault}
                    />
                    <PermissionItem 
                      icon={<Zap className="w-3 h-3" />}
                      label="Isolation Mode"
                      enabled={selectedEntry.permissions.isolationMode}
                      warning={selectedEntry.permissions.isolationMode}
                    />
                  </div>
                </section>

                {/* Communication Topology */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest">Communication Topology</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-slate-500 mb-3 uppercase tracking-wider">Allowed Peer Connections</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.permissions.allowedCommunicationIds.length > 0 ? (
                        selectedEntry.permissions.allowedCommunicationIds.map(id => (
                          <span key={id} className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono text-slate-300 border border-white/5">
                            {id.slice(0, 8)}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No peer connections allowed (Isolated)</span>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex gap-3">
                <button className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all">
                  Edit Permissions
                </button>
                <button className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 transition-all">
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10 text-slate-700" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Select an Agent</h3>
              <p className="text-sm text-slate-500 max-w-xs">
                Select an agent from the registry to view its accreditation status, communication topology, and governance settings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface PermissionItemProps {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  warning?: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ icon, label, enabled, warning }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
    enabled 
      ? warning ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
      : 'bg-white/5 border-white/10 opacity-60'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`${enabled ? (warning ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-500'}`}>
        {icon}
      </div>
      <span className={`text-xs font-medium ${enabled ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
    {enabled ? (
      <CheckCircle2 className={`w-4 h-4 ${warning ? 'text-amber-400' : 'text-emerald-400'}`} />
    ) : (
      <Lock className="w-4 h-4 text-slate-600" />
    )}
  </div>
);
