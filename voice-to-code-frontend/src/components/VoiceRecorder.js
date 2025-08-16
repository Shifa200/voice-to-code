import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

const VoiceRecorder = ({ onTranscriptUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configure recognition settings
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      // Handle speech recognition results
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        
        // Combine all results
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        setTranscript(currentTranscript);
        onTranscriptUpdate(currentTranscript);
      };
      
      // Handle recognition end
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
    }
  }, [onTranscriptUpdate]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      onTranscriptUpdate('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    onTranscriptUpdate('');
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <p className="text-red-700 font-medium mb-2">
              Sorry! Your browser doesn't support speech recognition.
            </p>
            <p className="text-red-600 text-sm">
              Try using Chrome, Edge, or Safari for the best experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-5">
      <div className="flex flex-wrap gap-3 mb-5">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isSupported}
          className={`flex items-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <Square size={24} />
              <span>Stop Recording</span>
            </>
          ) : (
            <>
              <Mic size={24} />
              <span>Start Recording</span>
            </>
          )}
        </button>
        
        {transcript && (
          <button 
            onClick={clearTranscript} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg transition-colors duration-200"
          >
            Clear
          </button>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center gap-2 text-red-500 font-medium mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span>Listening...</span>
        </div>
      )}

      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          What you said:
        </label>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 min-h-16 text-base leading-relaxed text-gray-900">
          {transcript || (isRecording ? "Speak now..." : "Click the microphone to start")}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;