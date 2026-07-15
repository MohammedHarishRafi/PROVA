import React, { useState, useEffect } from 'react';
import { 
  Home, RefreshCw, Box, Search, Play, FileText, CheckCircle, Clock, Database, Layers, ArrowRight,
  Shield, Code, Link, Cpu, BarChart, ExternalLink, Moon, Sun, 
  Settings as SettingsIcon, LogOut, Check, ChevronDown, Download, AlertCircle, X, CheckSquare, Sparkles, Server, Map, GitMerge, List, BookOpen, Key, Eye, Layout, File, Target, FlaskConical 
} from 'lucide-react';
import { getStatus, getWorkflowStatus, getSession } from './api';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

// Import Pages
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import ProjectRunner from './pages/ProjectRunner';
import FunctionalTesting from './pages/FunctionalTesting';
import Settings from './pages/Settings';
import ChatbotWidget from './components/ChatbotWidget';
import Login from './pages/Login';
import AITestRecommendation from './pages/AITestRecommendation';
import Summary from './pages/Summary';

// Design Tokens for App
const T = {
  bg:        '#F7F8FC',
  card:      '#FFFFFF',
  primary:   '#5B5FF6',
  secondary: '#7B61FF',
  success:   '#12B76A',
  danger:    '#F04438',
  textPri:   '#101828',
  textSec:   '#667085',
  border:    '#EAECF0',
  radius:    '24px',
  shadow:    '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
};

const Card = ({ children, style, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    style={{
      background: T.card,
      borderRadius: T.radius,
      boxShadow: T.shadow,
      border: `1px solid ${T.border}`,
      ...style,
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);

  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  // Repository Analysis Page states
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisRepoUrl, setAnalysisRepoUrl] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisStatusText, setAnalysisStatusText] = useState('');
  const [analysisElapsedTime, setAnalysisElapsedTime] = useState(0);
  const [analysisTimeTaken, setAnalysisTimeTaken] = useState(null);

  // Migration Center Page states
  const [migrationResult, setMigrationResult] = useState(null);
  const [migrationRepoUrl, setMigrationRepoUrl] = useState('');
  const [migrationTargetVersion, setMigrationTargetVersion] = useState('21');
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationError, setMigrationError] = useState(null);
  const [migrationStatusText, setMigrationStatusText] = useState('');
  const [migrationHistory, setMigrationHistory] = useState([]);
  const [migrationElapsedTime, setMigrationElapsedTime] = useState(0);
  const [migrationTimeTaken, setMigrationTimeTaken] = useState(null);

  // Ticking effect for migration loading timer
  useEffect(() => {
    let intervalId;
    if (migrationLoading) {
      const startTime = Date.now();
      setMigrationElapsedTime(0);
      intervalId = setInterval(() => {
        setMigrationElapsedTime(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [migrationLoading]);


  // Auto sync migration details when analysis result updates
  useEffect(() => {
    if (analysisResult && analysisResult.repoUrl) {
      setAnalysisRepoUrl(analysisResult.repoUrl);
      setMigrationRepoUrl(analysisResult.repoUrl);
      if (analysisResult.migrationRecommendation) {
        if (analysisResult.migrationRecommendation.includes('21')) {
          setMigrationTargetVersion('21');
        } else if (analysisResult.migrationRecommendation.includes('17')) {
          setMigrationTargetVersion('17');
        }
      }
    }
  }, [analysisResult]);

  // KPI STATE for persistent cards
  const [status, setStatus] = useState({ ragInitialized: false, ragMessage: '', provider: '' });
  const [stats, setStats] = useState({ reposAnalyzed: 0, migrationsRun: 0, filesConverted: 0 });
  const [migrations, setMigrations] = useState([]);

  const [workflowState, setWorkflowState] = useState({ analysisCompleted: false, runnerCompleted: false });

  // Session Hydration
  useEffect(() => {
    if (!sessionId) return;
    getSession(sessionId).then(data => {
      if (data) {
        setSessionData(data);
        if (data.analysisResult) setAnalysisResult(data.analysisResult);
        if (data.repoUrl) {
          setAnalysisRepoUrl(data.repoUrl);
          setMigrationRepoUrl(data.repoUrl);
        }
        if (data.workflowState) {
          setWorkflowState(prev => ({
             ...prev, 
             analysisCompleted: data.workflowState.analysisCompleted || prev.analysisCompleted,
             runnerCompleted: data.workflowState.runnerCompleted || prev.runnerCompleted
          }));
        }
        if (data.migrationResult) setMigrationResult(data.migrationResult);
        if (data.stats) setStats(data.stats);
        if (data.migrations) setMigrations(data.migrations);
      }
    }).catch(console.error);
  }, [sessionId, activeTab]);

  useEffect(() => {
    const fetchStatus = () => {
      getStatus()
        .then(data => setStatus(data))
        .catch(() => setStatus({ ragInitialized: false, ragMessage: 'Disconnected', provider: '' }));
    };
    
    const fetchWorkflow = async () => {
      if (analysisRepoUrl) {
        const repoName = analysisRepoUrl.split('/').pop().replace('.git', '');
        try {
          const ws = await getWorkflowStatus(repoName);
          setWorkflowState(prev => ({
            ...prev,
            analysisCompleted: ws.analysisCompleted || prev.analysisCompleted,
            runnerCompleted: ws.runnerCompleted || prev.runnerCompleted
          }));
        } catch (e) {
          // Ignore
        }
      }
    };

    fetchStatus();
    fetchWorkflow();
    const interval = setInterval(() => {
      fetchStatus();
      fetchWorkflow();
    }, 5000);
    return () => clearInterval(interval);
  }, [analysisRepoUrl, activeTab]);

  // Compute KPI values
  const normalizedMigrations = migrations.map(m => {
    if (m.repoUrl && !m.repo) {
      const repoName = m.repoUrl.split('/').pop()?.replace('.git', '') || m.repoUrl;
      const statusStr = (m.success || m.buildStatus === 'Success' || m.buildStatus === 'Build Success') ? 'Success' : (m.buildStatus === 'Running' || m.buildStatus === 'PENDING' ? 'Running' : 'Failed');
      return {
        ...m,
        repo: repoName,
        status: statusStr,
      };
    }
    return m;
  });

  const applied = normalizedMigrations.filter(m => m.status === 'Success').length || 0;
  const failed = normalizedMigrations.filter(m => m.status === 'Failed').length || 0;
  const inProgress = normalizedMigrations.filter(m => m.status === 'Running').length || 0;
  const total = applied + failed + inProgress;
  const successRate = total > 0 ? Math.round((applied / total) * 100) : 0;

  // Wizard Nodes
  const wizardNodes = [
    { id: 'dashboard', label: 'Connect', icon: <Home size={18} /> },
    { id: 'discovery', label: 'Discovery', icon: <Search size={18} /> },
    { id: 'test-recommendation', label: 'Strategies', icon: <FlaskConical size={18} /> },
    { id: 'results', label: 'Testing', icon: <Layers size={18} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={18} /> }
  ];

  const renderContent = () => {
    return (
      <>
        <div className={activeTab === 'dashboard' ? 'block h-full w-full' : 'hidden'}>
          <Dashboard 
            setActiveTab={setActiveTab} 
            setAnalysisRepoUrl={setAnalysisRepoUrl}
            setAnalysisResult={setAnalysisResult}
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        </div>
        <div className={activeTab === 'settings' ? 'block h-full w-full' : 'hidden'}>
          <Settings />
        </div>
        <div className={activeTab === 'discovery' ? 'block h-full w-full' : 'hidden'}>
          <Discovery
            setActiveTab={setActiveTab}
            repoUrl={analysisRepoUrl}
            setRepoUrl={setAnalysisRepoUrl}
            loading={analysisLoading}
            setLoading={setAnalysisLoading}
            result={analysisResult}
            setResult={setAnalysisResult}
            error={analysisError}
            setError={setAnalysisError}
            statusText={analysisStatusText}
            setStatusText={setAnalysisStatusText}
            elapsedTime={analysisElapsedTime}
            timeTaken={analysisTimeTaken}
            setTimeTaken={setAnalysisTimeTaken}
            workflowState={workflowState}
            setWorkflowState={setWorkflowState}
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        </div>
        <div className={activeTab === 'test-recommendation' ? 'block h-full w-full' : 'hidden'}>
          <AITestRecommendation
            setActiveTab={setActiveTab}
            repoUrl={migrationRepoUrl}
            workflowState={workflowState}
            setWorkflowState={setWorkflowState}
            analysisResult={analysisResult}
            sessionId={sessionId}
          />
        </div>
        <div className={(activeTab === 'results' || activeTab === 'testing') ? 'block h-full w-full' : 'hidden'}>
          <FunctionalTesting
            setActiveTab={setActiveTab}
            repoUrl={migrationRepoUrl}
            analysisResult={analysisResult}
            result={migrationResult}
            workflowState={workflowState}
            setWorkflowState={setWorkflowState}
            sessionId={sessionId}
          />
        </div>
        <div className={activeTab === 'summary' ? 'block h-full w-full' : 'hidden'}>
          <Summary repoUrl={analysisRepoUrl || migrationRepoUrl} sessionId={sessionId} />
        </div>
      </>
    );
  };

  if (!isLoggedIn) {
    return <Login onLogin={(user) => { setIsLoggedIn(true); setCurrentUser(user); }} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F7F8FC] font-sans text-[#101828] overflow-hidden">
      
      {/* ── TOP HEADER ── */}
      <header className="bg-white border-b border-[#EAECF0] relative z-20 flex-shrink-0">
        <div className="w-full px-8 py-4 flex items-center justify-between h-[80px]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-[#5B5FF6] to-[#7B61FF] rounded-xl text-white shadow-soft">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="font-extrabold text-3xl text-[#101828] leading-tight tracking-tight">PROVA</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`text-[#667085] hover:text-[#5B5FF6] transition-colors p-1 flex items-center gap-1 text-sm font-medium ${activeTab === 'settings' ? 'text-[#5B5FF6]' : ''}`}
            title="Settings"
          >
            <SettingsIcon size={18} />
          </button>
          
          <div className="h-8 w-[1px] bg-[#EAECF0] mx-1"></div>
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#A5B4FC] to-[#818CF8] flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">
              {currentUser ? currentUser.substring(0, 2) : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-[#101828] leading-tight capitalize">{currentUser || 'User'}</p>
              <p className="text-xs text-[#667085]">Admin</p>
            </div>
          </div>
        </div>
        </div>
      </header>

      {/* Main View Container */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        
        {/* ── WORKFLOW WIZARD ── */}
        <div className="bg-white border-b border-[#EAECF0] px-8 py-6 flex-shrink-0">
          <div className="w-full">
            <div className="flex items-center justify-between relative max-w-7xl mx-auto">
              {/* Connector line behind nodes */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EAECF0] -translate-y-1/2 z-0" />
              
              {wizardNodes.map((node, index) => {
                const isActive = activeTab === node.id;
                // Basic logic: if index <= current active index, it's completed or current.
                // Since activeTab might not be in wizard (like settings), we just use exact match for current.
                const currentIndex = wizardNodes.findIndex(n => n.id === activeTab);
                const isCompleted = index < currentIndex;
                const isPending = index > currentIndex;
                let isLocked = false;
                let lockedReason = '';
                if ((node.id === 'test-recommendation' || node.id === 'results') && !workflowState.analysisCompleted) {
                  isLocked = true;
                  lockedReason = 'Complete Repository Analysis before accessing Strategies.';
                }
                
                let nodeStyle = {};
                let iconStyle = {};
                if (isActive) {
                  nodeStyle = { background: 'linear-gradient(135deg, #5B5FF6, #7B61FF)', color: 'white', border: 'none' };
                  iconStyle = { color: 'white' };
                } else if (isCompleted) {
                  nodeStyle = { background: '#12B76A', color: 'white', border: 'none' };
                  iconStyle = { color: 'white' };
                } else {
                  nodeStyle = { background: '#F7F8FC', color: '#98A2B3', border: '1px solid #EAECF0' };
                  iconStyle = { color: '#98A2B3' };
                }

                return (
                  <div 
                    key={node.id}
                    onClick={() => {
                      if (isLocked) {
                        alert(lockedReason);
                        return;
                      }
                      setActiveTab(node.id);
                    }}
                    className={`relative z-10 flex flex-col items-center gap-2 ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer group'}`}
                    title={isLocked ? lockedReason : ''}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${!isLocked && 'group-hover:scale-110'}`}
                      style={nodeStyle}
                    >
                      {node.icon}
                    </div>
                    <div className="text-center bg-white px-2 rounded flex flex-col items-center">
                      <p className={`text-sm font-bold ${isActive ? 'text-[#101828]' : 'text-[#667085]'}`}>
                        {node.label}
                      </p>
                      {isLocked && <div style={{ fontSize: 10, color: '#F04438' }}>Locked</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DYNAMIC CONTENT AREA ── */}
        <main className="px-4 md:px-8 p-8 w-full flex-1 flex flex-col">
          {renderContent()}
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}

