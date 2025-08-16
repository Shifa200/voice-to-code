import React, { useState } from 'react';
import { Copy, Download, Eye, Code } from 'lucide-react';

const CodeEditor = ({ code, onCodeChange, isGenerating }) => {
  const [activeTab, setActiveTab] = useState('code');
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'generated-code.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 text-center">
          <h3 className="text-xl font-semibold">🤖 AI is crafting your code...</h3>
        </div>
        <div className="p-8">
          <div className="bg-gray-900 rounded-lg p-6 mb-4 space-y-3">
            <div className="h-5 bg-gray-700 rounded animate-pulse w-4/5"></div>
            <div className="h-5 bg-gray-700 rounded animate-pulse w-3/5"></div>
            <div className="h-5 bg-gray-700 rounded animate-pulse w-2/5"></div>
            <div className="h-5 bg-gray-700 rounded animate-pulse w-4/5"></div>
            <div className="h-5 bg-gray-700 rounded animate-pulse w-3/5"></div>
          </div>
          <div className="text-center text-gray-600 text-lg">
            <div className="inline-flex items-center gap-2">
              <div className="text-2xl animate-bounce">🎯</div>
              <div>
                Analyzing your request
                <span className="inline-block w-6 text-left">
                  <span className="animate-pulse">...</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-xl font-semibold text-gray-900">Generated Code</h3>
        </div>
        <div className="p-12 text-center text-gray-500">
          <Code size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2 text-gray-600">Your generated code will appear here</p>
          <span className="text-sm text-gray-400">
            Try saying: "Create a button" or "Make a login form"
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-fit">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Generated Code</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Code size={16} />
              Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'preview'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye size={16} />
              Preview
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
            title="Copy Code"
          >
            <Copy size={16} />
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadCode}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
            title="Download"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="h-96">
        {activeTab === 'code' ? (
          <textarea
            value={code}
            onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
            className="w-full h-full bg-gray-900 text-gray-100 p-6 font-mono text-sm leading-relaxed resize-none outline-none border-none"
            placeholder="Generated code will appear here..."
            spellCheck="false"
          />
        ) : (
          <iframe
            srcDoc={code}
            title="Code Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full border-none bg-white"
          />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
