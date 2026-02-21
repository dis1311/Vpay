import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceVisualizer from './VoiceVisualizer';

const VoiceAssistant = ({ onIntentDetected }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("Could not access microphone. Please ensure permissions are granted.");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_command.wav');

      const response = await fetch('http://localhost:8000/api/speech/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      onIntentDetected(data);
    } catch (err) {
      console.error("Error processing audio:", err);
      setError("Failed to process voice command. Backend might be down.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-sm mx-auto w-full relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 bg-indigo-100 rounded-full blur-3xl opacity-50 transition-colors duration-500 ${isRecording ? 'bg-red-100' : 'bg-indigo-100'}`} />
      
      <div className="relative mb-6">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.2 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 rounded-full bg-red-500 border-4 border-red-500"
            />
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 fill-current" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </motion.button>
      </div>

      <div className="text-center space-y-3 z-10">
        <div className="flex items-center justify-center gap-2">
          {isProcessing && <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />}
          <h3 className="text-xl font-bold text-gray-900">
            {isRecording ? "I'm Listening..." : isProcessing ? "Thinking..." : "Voice Command"}
          </h3>
        </div>
        
        <div className="h-12 flex items-center justify-center">
          {isRecording ? (
            <VoiceVisualizer isRecording={true} />
          ) : (
            <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
              {isProcessing 
                ? "Analyzing your request..." 
                : "Tap to pay bills using your voice in any language"}
            </p>
          )}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 flex items-center text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100"
        >
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceAssistant;
