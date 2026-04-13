import { LucideIcon } from "lucide-react";

export type ExtensionCategory = 'connector' | 'skill' | 'tool' | 'mcp' | 'module' | 'gaming' | 'testing' | 'engine';

export type AgentRole = 'head' | 'executive' | 'contractor' | 'consultant' | 'specialized';

export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ExtensionCategory;
  status: 'active' | 'inactive' | 'error';
  isBound?: boolean;
  source: 'inbuilt' | 'external';
  url?: string;
  config?: any;
}

export type TabType = 'chat' | 'settings' | 'discovery' | 'canvas' | 'store' | 'agents' | 'artifacts' | 'metrics' | 'simulation' | 'governance' | 'forge' | 'agent_cli' | 'sentinel' | 'monitor' | 'security' | 'efficiency' | 'hatchery' | 'sops' | 'proposals' | 'gaming' | 'testing' | 'vhatsappening' | 'placeholder_client' | 'nexus' | 'symphony' | 'creative' | 'vine_hardener' | 'registry' | 'memory_palace';

export type SystemMode = 'turbo' | 'eco' | 'stealth';

export interface AgentRegistryEntry {
  id: string;
  agentId: string;
  name: string;
  version: string;
  tier: 'resident' | 'branch' | 'external';
  branchId?: string;
  status: 'incubation' | 'auditing' | 'ratification' | 'accredited' | 'revoked';
  accreditationId?: string;
  permissions: AgentPermissions;
  lastHeartbeat: Date;
  metadata: Record<string, any>;
}

export interface AgentPermissions {
  allowedCommunicationIds: string[]; // IDs of other agents it can talk to
  canAccessVault: boolean;
  canAccessFiscal: boolean;
  canAccessSentinel: boolean;
  maxDailyTokens: number;
  isolationMode: boolean;
}

export interface VerificationReport {
  id: string;
  targetFile: string;
  generatorAgentId: string;
  auditorAgentId: string;
  status: 'passed' | 'failed' | 'warning';
  lintErrors: string[];
  compileErrors: string[];
  suggestions: string[];
  timestamp: Date;
}

export interface SystemEvent {
  id: string;
  topic: string; // e.g., 'security.alert', 'fiscal.threshold'
  payload: any;
  publisherId: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface EventSubscription {
  id: string;
  agentId: string;
  topicPattern: string; // e.g., 'security.*', 'fiscal.threshold'
  active: boolean;
  lastTriggered?: Date;
}

export interface MissionMandate {
  id: string;
  branchId: string;
  agentId: string;
  permissions: string[]; // e.g., 'fs.read', 'fs.write', 'sys.reboot'
  expiresAt: Date;
  signature: string; // 8004 Identity signature
}

export interface DispatchSession {
  id: string;
  mandateId: string;
  branchId: string;
  agentId: string;
  status: 'active' | 'completed' | 'failed' | 'revoked';
  logs: string[];
  startedAt: Date;
  endedAt?: Date;
}

export interface MemoryRoom {
  id: string;
  name: string;
  description: string;
  icon?: string;
  locusCount: number;
}

export interface MemoryLocus {
  id: string;
  roomId: string;
  name: string;
  position: { x: number; y: number; z: number };
  tags: string[];
}

export interface VerbatimLog {
  id: string;
  locusId: string;
  content: string;
  sourceAgentId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// --- Celestial Specific Types ---
export type CelestialViewType = "home" | "chat" | "settings" | "auth" | "agent-detail" | "channel-detail" | "canopy" | "contacts" | "select-contact" | "cloud-setup" | "backup" | "marketplace" | "omega-config" | "workflow-canvas" | "debate-chat";

export interface CelestialNode {
  id: string;
  name: string;
  type: "star" | "local" | "cloud" | "agent" | "llm" | "council" | "gmail";
  provider: "local" | "google" | "github" | "codeberg" | "omega" | "nexus" | "perplexity" | "slack" | "discord" | "notion" | "trello";
  model?: string;
  logo?: string;
  icon?: string;
  desc?: string;
  relayType?: "firebase" | "telegram" | "gmail";
  relayId?: string;
  secretKey?: string;
  relayProfileId?: string;
  gitProfileId?: string;
  councilNodes?: string[];
  chairNodeId?: string;
  createdAt?: string;
  updatedAt?: string;
  baseUrl?: string;
  apiKeyEncrypted?: string;
  skillIds?: string[];
  mcpServerIds?: string[];
}

export interface CelestialChat {
  id: string;
  nodeId?: string;
  name?: string;
  type: "direct" | "council" | "individual" | "workflow" | "debate" | "agent" | "gmail" | "sentinel";
  messages: Message[];
  updatedAt: number | string;
  lastMessage?: string;
  nodeIds?: string[]; // For councils
  dirty?: boolean;
  relayType?: "firebase" | "telegram" | "gmail";
  chairNodeId?: string;
  workflowId?: string;
  debateId?: string;
  isSentinel?: boolean;
  isHeadAgent?: boolean;
  filterCategory?: string;
}

export interface RelayProfile {
  id: string;
  name: string;
  type: "telegram" | "gmail" | "firebase";
  token?: string;
  user?: string;
  password?: string;
  createdAt: string;
}

export interface GitProfile {
  id: string;
  name: string;
  forge: "github" | "codeberg";
  type?: string;
  owner?: string;
  token: string;
  user: string;
  createdAt: string;
}

export interface NexusSeed {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  title: string;
  desc?: string;
  content: string;
  tags?: string[];
  forks?: number;
  createdAt: string;
  nodeId?: string;
}

export interface NexusFork {
  id: string;
  seedId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentForkId?: string;
  title?: string;
}

export interface NexusComment {
  id: string;
  targetId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  nodeId?: string;
}

export interface SentinelLog {
  id: string;
  level: "info" | "warn" | "error" | "success";
  message: string;
  timestamp: string;
  source: string;
  metadata?: any;
}

export interface OfficialUpdate {
  id: string;
  title: string;
  brief: string;
  content: string;
  type: "models" | "offers" | "prompts" | "official" | "ai_tech";
  priority: number;
  createdAt: string;
  isUrgent?: boolean;
}

export interface NewsCard {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  source: string;
  timestamp: string;
  category: string;
  imageUrl?: string;
}

export interface NewsFilter {
  prompt: string;
  lastUpdated: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: "builtin" | "recipe" | "action" | "connector";
  provider: string;
  isEnabled: boolean;
  createdAt: string;
  recipe?: any;
  action?: any;
  status?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  status?: string;
  isEnabled?: boolean;
}

export interface AIChannel {
  id: string;
  name: string;
  provider: string;
  logo: string;
  followers: string;
  latest: string;
  description: string;
  models: {
    id: string;
    name: string;
    date: string;
    desc: string;
    type: string;
  }[];
}

export interface WorkflowNode {
  id: string;
  type: "agent" | "mcp" | "skill" | "connector" | "input" | "output" | "trigger" | "logic" | "data" | "prompt";
  name: string;
  x: number;
  y: number;
  data?: any;
}

export interface WorkflowConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPin: string;
  toPin: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface Debate {
  id: string;
  name: string;
  agentIds: string[];
  messages: Message[];
  status: "active" | "resolved";
  createdAt: string;
  updatedAt: string;
  consensus?: string;
}

export interface Job {
  id: string;
  nodeId: string;
  content: string;
  status: "pending" | "completed" | "error";
  createdAt: string;
  error?: string;
  chatId?: string;
}

export interface GitForgeConfig {
  githubToken?: string;
  githubUser?: string;
  codebergToken?: string;
  codebergUser?: string;
}

export interface OmegaConfig {
  apiKey?: string;
  personality?: string;
  coreKnowledge?: string;
  isGlobalAssistantEnabled: boolean;
  model: string;
}

export interface AppSettings {
  globalGeminiKey?: string;
  isEncryptionEnabled: boolean;
  activeFilters: string[];
  relayNodes: string[];
  theme: "light" | "dark" | "celestial";
  lastBackupAt?: string;
  tokenGovernance: TokenGovernance;
  nexusSettings: NexusSettings;
}

export interface TokenGovernance {
  globalMasterSlider: number; // 0-100
  nexusSlider: number; // 0-100
  emergencyBreakerEnabled: boolean;
  dailyTokenLimit: number;
  currentDailyUsage: number;
  gracefulDegradationEnabled: boolean;
  priorityModuleIds: string[]; // IDs of modules that stay in high-intel mode
}

export interface NexusSettings {
  isEnabled: boolean;
  isPrivate: boolean; // Local vs Global
  allowedAgentIds: string[];
  tokenUsageSlider: number; // 0-100
  autoForkEnabled: boolean;
  autonomyMandateEnabled: boolean;
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  naturalLanguage: string;
  technicalBlock: string;
  active: boolean;
  type: 'security' | 'operational' | 'fiscal';
  urgencyLevel: 'standard' | 'critical';
  createdAt: Date;
}

export interface EfficiencyPatch {
  id: string;
  name: string;
  description: string;
  version: string;
  applied: boolean;
  metrics: {
    speedBoost: number;
    memorySaved: number;
    costReduction: number;
  };
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'local' | 'resident';

export interface Agent {
  id: string;
  name: string;
  description: string;
  role: AgentRole;
  provider: AIProvider;
  model: string;
  apiKey?: string; // Optional for Head Agent (Least Privilege)
  systemInstruction: string;
  activeExtensionIds: string[];
  isStaff?: boolean;
  avatar?: string;
  color: string;
  parentId?: string; // For hierarchy (Sub/Minor agents)
  status: 'active' | 'inactive' | 'error';
  capabilities: string[];
  lastActive: Date;
}

export type UIMode = 'vaa' | 'browser';

export interface UIConfig {
  theme: 'dark' | 'light' | 'custom';
  layout: 'default' | 'focus' | 'split' | 'canvas-first';
  sidebarVisible: boolean;
  activeTabId: string;
  accentColor: string;
}

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  active: boolean;
  status: 'active' | 'shelved' | 'archived';
  agentId?: string; // Link tab to a specific agent
  activeExtensionIds?: string[];
  canvasData?: {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
  };
  metadata?: {
    icon?: string;
    vibe?: string;
    lastAccessed?: Date;
  };
}

export interface CanvasNode {
  id: string;
  type: 'ai_text' | 'ai_image' | 'github' | 'ui_header' | 'ui_sidebar' | 'ui_content' | 'input' | 'output';
  position: { x: number; y: number };
  data: any;
  status: 'idle' | 'running' | 'completed' | 'error';
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date | string;
  status?: "sent" | "delivered" | "pending" | "error" | "completed";
  jobId?: string;
  nodeId?: string;
  type?: "text" | "email-metadata";
  metadata?: {
    from?: string;
    subject?: string;
    date?: string;
    emailId?: string;
    snippet?: string;
    sender?: string;
    [key: string]: any;
  };
  sanitizationReport?: {
    pixels: number;
    links: number;
  };
  emailMetadata?: {
    from: string;
    subject: string;
    date: string;
  };
  toolCalls?: {
    name: string;
    args: any;
    status: 'running' | 'complete' | 'error';
  }[];
}

export interface Memory {
  id: string;
  type: 'preference' | 'fact' | 'style' | 'goal' | 'resonance';
  content: string;
  strength: number; // 1-10
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ExternalPlugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  type: string;
  status: 'active' | 'inactive' | 'error';
}

export interface BackgroundTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  type: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'security' | 'info' | 'warning' | 'error' | 'system';
  timestamp: Date;
  agentId?: string;
  taskId?: string;
  read: boolean;
  metadata?: Record<string, any>;
  action?: {
    type: 'confirmation' | 'review';
    label: string;
    onApprove: () => void;
    onReject: () => void;
    status?: 'pending' | 'approved' | 'rejected';
  };
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  source: string; // e.g., "Kernel", "Symphony-Agent", "UI-Shell"
  message: string;
  metadata?: Record<string, any>; // For AI parsing
  traceId?: string; // To link related events
}

export interface VaultPointer {
  id: string;
  path: string; // Original path in MAOS
  gdriveId: string; // ID in Google Drive
  encryptionHash: string; // For integrity check
  size: number; // Original size
  compressedSize: number; // Size on GDrive
  compressed: boolean;
  algorithm: 'gzip' | 'brotli' | 'none';
  timestamp: Date;
}

export interface AgentLog {
  id: string;
  type: 'command' | 'output' | 'error' | 'system' | 'thought';
  content: string;
  timestamp: Date;
  agentId?: string;
  tabId?: string;
}

export interface SovereignBlock {
  id: string;
  type: string; // e.g., 'UI:BentoGrid', 'Logic:DataCruncher'
  config: Record<string, any>; // Malleable configuration
  inputs?: string[]; // IDs of other blocks
  malleable: boolean; // Explicitly marked as malleable
}

export interface SovereignManifest {
  kind: 'SovereignApp' | 'SovereignSOP';
  metadata: {
    name: string;
    version: string;
    creator: string;
    description: string;
  };
  intent: {
    goal: string;
    constraints: string[];
  };
  security: {
    clearance: AgentRole;
    network: string;
    dataScoping: string;
  };
  blocks: SovereignBlock[];
  ratification: {
    required: boolean;
    gate: 'Chairman_Approval' | 'Guardian_Audit' | 'Auto_Ratify';
  };
}

export interface AuditReport {
  id: string;
  extensionId: string;
  status: 'passed' | 'failed' | 'warning';
  guardianScore: number;
  consultantAScore: number;
  consultantBScore: number;
  vulnerabilities: string[];
  timestamp: Date;
}

export interface HatcheryProject {
  id: string;
  name: string;
  description: string;
  status: 'ideation' | 'development' | 'auditing' | 'staging' | 'production';
  manifest?: SovereignManifest;
  auditReport?: AuditReport;
  createdAt: Date;
}

export interface SOP {
  id: string;
  title: string;
  description: string;
  department: string;
  leadAgentId: string;
  supportAgentIds: string[];
  requiredExtensionIds: string[];
  manifest: string; // Sovereign-Script (SS)
  status: 'active' | 'draft' | 'archived';
  lastExecuted?: Date;
}

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  enabled: boolean;
  type: 'local' | 'sovereign';
  category: 'utility' | 'creative' | 'security' | 'intelligence';
  status: 'active' | 'inactive' | 'error';
}

export interface Client {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  enabled: boolean;
  type: 'native' | 'web' | 'cli' | 'ambient';
  status: 'active' | 'inactive' | 'error';
  accreditationId: string;
}

export interface RatificationProposal {
  id: string;
  title: string;
  description: string;
  type: 'department' | 'governance' | 'infrastructure';
  impact: {
    tokenCost: string;
    computeCost: string;
    benefit: string;
  };
  status: 'pending' | 'ratified' | 'shelved' | 'vetoed';
  isUnfolded?: boolean;
  shadowModeAvailable: boolean;
  sunsetClause?: {
    reviewIntervalDays: number;
  };
  createdAt: Date;
}

export type OnboardingStep = 'choice' | 'questionnaire' | 'roadmap' | 'completed';

export interface OnboardingState {
  step: OnboardingStep;
  intent?: 'coding' | 'business' | 'research' | 'personal' | 'enterprise';
  hardwareProfile?: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface PrivacyMandate {
  id: string;
  provider: string; // 'openai' | 'anthropic' | 'google' | 'all'
  zeroRetention: boolean;
  trainingOptOut: boolean;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface ProxyLog {
  id: string;
  timestamp: string;
  provider: string;
  endpoint: string;
  mandateApplied: boolean;
  status: 'allowed' | 'blocked';
}

export interface ModelSecurityPolicy {
  id: string;
  name: string;
  enforceSafetensors: boolean;
  blockLegacyPickle: boolean;
  status: 'active' | 'inactive';
  lastAudit: string;
}

export interface WorkforceRole {
  id: string;
  title: string;
  description: string;
  department: string;
  baseSOPId?: string;
  requiredSkills: string[];
  permissions: string[];
}

export interface AgentKPI {
  id: string;
  agentId: string;
  roleId: string;
  metricName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  lastUpdated: string;
}

export interface AgentPayroll {
  id: string;
  agentId: string;
  monthlyTokenLimit: number;
  tokensConsumed: number;
  creditBalance: number;
  currency: 'x402' | 'USD' | 'SOL';
  status: 'active' | 'paused';
}

export interface EngineImportManifest {
  sourceUrl: string;
  dockerImage?: string;
  entryPoint: string;
  metabolicLoad: number;
  requiredClearance: 'standard' | 'high' | 'sovereign';
  adapterScript?: string; // Sovereign Script (SS) adapter
}

export interface EngineConfig {
  id: string;
  name: string;
  type: '3d' | 'physics' | 'inference' | 'quantum' | 'linguistic' | 'corporate' | 'memory' | 'navigation' | 'strategy' | 'shopping' | 'synthesis' | 'communication' | 'enterprise' | 'liquidity';
  status: 'dormant' | 'active' | 'hibernating';
  metabolicLoad: number;
  config: Record<string, any>;
  importManifest?: EngineImportManifest;
}

export interface EngineSession {
  id: string;
  engineId: string;
  agentId: string;
  missionId: string;
  startedAt: Date;
  endedAt?: Date;
  tokensConsumed: number;
}

export interface LinguisticBase {
  id: string;
  gdriveId: string;
  language: string;
  version: string;
  lastPatched: Date;
  ruleCount: number;
}

export interface TranslationCorrection {
  id: string;
  originalText: string;
  translatedText: string;
  correctedText: string;
  context: string;
  agentId: string;
  timestamp: Date;
  ratified: boolean;
}

export interface WebIdentityHandshake {
  id: string;
  agentId: string;
  ansName: string; // Agent Name Service
  webBotAuthToken: string;
  issuedAt: Date;
  expiresAt: Date;
  status: 'active' | 'revoked' | 'expired';
}

export interface CrawlMandate {
  id: string;
  domain: string;
  allowCrawl: boolean;
  agentWhitelist: string[];
  cloudflareZoneId?: string;
  updatedAt: Date;
}

export interface QuantumSimulation {
  id: string;
  missionId: string;
  qubitCount: number;
  cascadeEnabled: boolean;
  errorRateReduction: number; // e.g., 17
  status: 'running' | 'completed' | 'failed';
  startedAt: Date;
}

export interface CascadeLogic {
  id: string;
  targetMissionId: string;
  correctionDepth: number;
  noiseThreshold: number;
  efficiencyGain: number; // e.g., 0.40 for 40%
}

export interface SwarmSimulation {
  id: string;
  name: string;
  contextId: string; // Link to Nexus seed or report
  agentCount: number;
  status: 'initializing' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  endedAt?: Date;
}

export interface SwarmAgent {
  id: string;
  simulationId: string;
  personality: string;
  memoryPalaceId?: string;
  socialDynamics: Record<string, any>;
}

export interface NarrativeForecast {
  id: string;
  simulationId: string;
  authorAgentId: string; // Usually the Librarian
  content: string;
  emergentPatterns: string[];
  timestamp: Date;
}
