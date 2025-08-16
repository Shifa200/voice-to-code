import React, { useState, useEffect } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import CodeEditor from './components/CodeEditor';
import { generateCodeFromSpeech, testConnection } from './services/api';
import './App.css';

function App() {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendConnected, setBackendConnected] = useState(null);
  const [error, setError] = useState(null);
  const [generationStage, setGenerationStage] = useState('');
  const [projectHistory, setProjectHistory] = useState([]);

  // Test backend connection on app load
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await testConnection();
      setBackendConnected(isConnected);
    };
    
    checkConnection();
    loadProjectHistory();
  }, []);

  const handleTranscriptUpdate = (transcript) => {
    setCurrentTranscript(transcript);
    setError(null);
  };

  const generateCode = async () => {
    if (!currentTranscript.trim()) {
      setError('Please record some speech first!');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStage('Initializing AI...');
    
    try {
      console.log('🎤 Generating code for:', currentTranscript);
      
      // Simulate realistic AI processing stages
      const stages = [
        'Analyzing your request...',
        'Processing speech context...',
        'Generating component structure...',
        'Adding styling and interactions...',
        'Finalizing code...'
      ];

      let stageIndex = 0;
      const stageInterval = setInterval(() => {
        if (stageIndex < stages.length) {
          setGenerationStage(stages[stageIndex]);
          stageIndex++;
        }
      }, 800);

      const result = await generateCodeFromSpeech(currentTranscript);
      
      clearInterval(stageInterval);
      setGenerationStage('Complete! ✨');
      
      setGeneratedCode(result.code);
      
      // Add to project history
      const newProject = {
        id: Date.now(),
        transcript: currentTranscript,
        code: result.code,
        timestamp: new Date().toISOString(),
        title: generateProjectTitle(currentTranscript)
      };
      
      const updatedHistory = [newProject, ...projectHistory.slice(0, 4)]; // Keep last 5
      setProjectHistory(updatedHistory);
      localStorage.setItem('voiceCodeHistory', JSON.stringify(updatedHistory));
      
      console.log('✅ Code generated successfully');
      
    } catch (error) {
      console.error('❌ Code generation failed:', error);
      setError(error.message || 'Failed to generate code. Please try again.');
      setGenerationStage('');
      
      if (error.message.includes('Backend server is not running')) {
        console.log('🔄 Using fallback mock generation');
        const mockCode = generateMockCodeFallback(currentTranscript);
        setGeneratedCode(mockCode);
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationStage(''), 2000);
    }
  };

  const generateProjectTitle = (transcript) => {
    const words = transcript.toLowerCase().split(' ');
    if (words.some(w => ['button', 'btn'].includes(w))) return 'Interactive Button';
    if (words.some(w => ['form', 'login'].includes(w))) return 'Login Form';
    if (words.some(w => ['card', 'profile'].includes(w))) return 'Profile Card';
    if (words.some(w => ['nav', 'navigation', 'menu'].includes(w))) return 'Navigation Menu';
    return 'Custom Component';
  };

  const loadProjectHistory = () => {
    try {
      const saved = localStorage.getItem('voiceCodeHistory');
      if (saved) {
        setProjectHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load project history:', error);
    }
  };

  const loadHistoryProject = (project) => {
    setCurrentTranscript(project.transcript);
    setGeneratedCode(project.code);
    setError(null);
  };

  const clearHistory = () => {
    setProjectHistory([]);
    localStorage.removeItem('voiceCodeHistory');
  };

  const generateMockCodeFallback = (transcript) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fallback Generated</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .warning {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 10px;
      margin: 15px 0;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚠️ Fallback Mode</h1>
    <p>Backend server unavailable</p>
    <div class="warning">From: "${transcript}"</div>
    <p><small>Start your backend server for AI generation</small></p>
  </div>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <header className="glass-effect border-b border-white/20 p-8 text-center shadow-lg gradient-bg">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
           AI Voice-to-Code Generator
        </h1>
        <p className="text-xl text-grey-300 font-medium mb-4">
          Speak your ideas, watch code appear!
        </p>
        
        {backendConnected === null && (
          <div className="inline-flex items-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="animate-spin h-4 w-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></div>
            Checking backend connection...
          </div>
        )}
        
        {backendConnected === true && (
          <div className="inline-flex items-center bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            Backend connected - AI ready!
          </div>
        )}
        
        {backendConnected === false && (
          <div className="inline-flex items-center bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
            Backend offline - Using fallback mode
          </div>
        )}
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Generation Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <VoiceRecorder onTranscriptUpdate={handleTranscriptUpdate} />
              
              <div className="text-center space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-center font-medium">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}
                
                {generationStage && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center justify-center font-medium">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                    {generationStage}
                  </div>
                )}
                
                <button 
                  onClick={generateCode} 
                  disabled={isGenerating || !currentTranscript.trim()}
                  className="btn-gradient text-white border-none px-8 py-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg shimmer relative overflow-hidden"
                >
                  {isGenerating ? '🤖 AI is generating...' : '✨ Generate Code'}
                </button>
              </div>
            </div>

            <div>
              <CodeEditor 
                code={generatedCode}
                onCodeChange={setGeneratedCode}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Project History Sidebar */}
          {projectHistory.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 h-fit max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    🕒 Recent Projects
                  </h3>
                  <button 
                    onClick={clearHistory} 
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="space-y-3">
                  {projectHistory.map((project) => (
                    <div 
                      key={project.id} 
                      onClick={() => loadHistoryProject(project)}
                      className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="font-semibold text-gray-900 text-sm mb-1">
                        {project.title}
                      </div>
                      <div className="text-gray-600 text-xs leading-relaxed mb-1">
                        "{project.transcript.substring(0, 40)}..."
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(project.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="glass-effect border-t border-white/20 p-4 text-center text-gray-600 text-sm">
        <p>
          Built with ❤️ using MERN Stack + AI • 
          <span className="text-indigo-600 font-medium ml-2">
            {projectHistory.length} project{projectHistory.length !== 1 ? 's' : ''} generated
          </span>
        </p>
      </footer>6
    </div>
  );
}

export default App;