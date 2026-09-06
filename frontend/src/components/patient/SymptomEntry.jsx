import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { BODY_SYSTEMS, COMMON_SYMPTOMS } from '../../data/mockData';
import {
  Heart,
  Wind,
  Brain,
  Activity,
  Zap,
  Shield,
  Thermometer,
  AlertTriangle,
  Search,
  Check,
  Sparkles,
  Clock,
  Loader2,
  Plus
} from 'lucide-react';
import AIAnalysisResult from './AIAnalysisResult';

const SYSTEM_ICONS = {
  cardiovascular: Heart,
  respiratory: Wind,
  neurological: Brain,
  gastrointestinal: Activity,
  endocrine: Zap,
  musculoskeletal: Shield,
  systemic: Thermometer
};

export default function SymptomEntry() {
  const { currentPatient, analyzeAndSubmitSymptoms } = useMediSense();

  const [selectedSystem, setSelectedSystem] = useState('all');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severity, setSeverity] = useState(7);
  const [duration, setDuration] = useState('Less than 2 hours');
  const [generalNotes, setGeneralNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Toggle symptom
  const toggleSymptom = (sym) => {
    if (selectedSymptoms.some(s => s.id === sym.id)) {
      setSelectedSymptoms(prev => prev.filter(s => s.id !== sym.id));
    } else {
      setSelectedSymptoms(prev => [...prev, sym]);
    }
  };

  // Filter symptoms
  const filteredSymptoms = COMMON_SYMPTOMS.filter(sym => {
    const matchesSystem = selectedSystem === 'all' || sym.system === selectedSystem;
    const matchesSearch = sym.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSystem && matchesSearch;
  });

  // Handle AI analysis execution
  const handleAnalyze = () => {
    let symptomsToAnalyze = [...selectedSymptoms];
    // If user didn't click any tags but clicked button, auto-select a reasonable symptom based on text or default
    if (symptomsToAnalyze.length === 0 && !generalNotes.trim()) {
      const defaultSym = COMMON_SYMPTOMS[0]; // Chest pain
      symptomsToAnalyze = [defaultSym];
      setSelectedSymptoms([defaultSym]);
    }

    setIsScanning(true);
    setTimeout(() => {
      const result = analyzeAndSubmitSymptoms({
        selectedSymptoms: symptomsToAnalyze,
        generalNotes: generalNotes || 'Patient reported acute clinical discomfort.',
        onsetDuration: duration,
        primarySeverity: severity
      });
      setIsScanning(false);
      setAnalysisResult(result);
    }, 1000);
  };

  // Quick preset load for hackathon demo
  const loadCardiacEmergencyPreset = () => {
    const chestPain = COMMON_SYMPTOMS.find(s => s.id === 'sym_chest_pain');
    const radiating = COMMON_SYMPTOMS.find(s => s.id === 'sym_radiating_pain');
    const diaphoresis = COMMON_SYMPTOMS.find(s => s.id === 'sym_diaphoresis');
    const dyspnea = COMMON_SYMPTOMS.find(s => s.id === 'sym_dyspnea');
    setSelectedSymptoms([chestPain, radiating, diaphoresis, dyspnea].filter(Boolean));
    setSeverity(9);
    setDuration('Less than 2 hours');
    setGeneralNotes('Sudden severe retrosternal crushing chest pain, cold sweating, shortness of breath radiating to left arm.');
  };

  return (
    <div className="space-y-8">
      
      {/* Patient Welcome Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider">
              <span>Patient Assessment Wizard</span>
              <span>•</span>
              <span>{currentPatient.name} ({currentPatient.age}y {currentPatient.gender})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              AI Symptom Analyzer & Triage Check
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Tag your active symptoms below. Our clinical inference model checks for emergency red-flags, estimates probable conditions, and forwards the case to on-duty doctors.
            </p>
          </div>

          <button
            onClick={loadCardiacEmergencyPreset}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>⚡ Load Demo Cardiac Emergency</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive System & Symptom Picker (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Organ / Body System Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              1. Select Affected Anatomical System
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setSelectedSystem('all')}
                className={`p-3 rounded-2xl text-left border transition-all text-xs font-bold flex items-center justify-between ${
                  selectedSystem === 'all'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>All Symptoms</span>
                <Sparkles className={`w-3.5 h-3.5 ${selectedSystem === 'all' ? 'text-white' : 'text-teal-600'}`} />
              </button>

              {BODY_SYSTEMS.map(sys => {
                const IconComponent = SYSTEM_ICONS[sys.id] || Activity;
                const isSelected = selectedSystem === sys.id;
                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedSystem(sys.id)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs font-semibold flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{sys.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Symptom Tag Cloud */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Click Symptoms to Select ({selectedSymptoms.length} Selected)
              </label>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 text-xs text-slate-900 pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filteredSymptoms.map(sym => {
                const isSelected = selectedSymptoms.some(s => s.id === sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                      isSelected
                        ? sym.redFlag
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                          : 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    )}
                    <span>{sym.name}</span>
                    {sym.redFlag && (
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-tight ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                      }`}>
                        Red Flag
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chief Complaint Free-Text */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Describe What You Are Feeling (Chief Complaint in Your Own Words)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Severe chest pain starting 40 minutes ago, feels heavy like an elephant on my chest, sweating and dizzy..."
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

        </div>

        {/* Right Column: Acuity Scaling & Clinical Trigger (1 Col) */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Severity & Timing</span>
            </h4>

            {/* Severity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700">Subjective Pain / Distress</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  severity >= 8 ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  severity >= 5 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {severity} / 10 ({severity >= 8 ? 'Severe' : severity >= 5 ? 'Moderate' : 'Mild'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Mild</span>
                <span>5 Moderate</span>
                <span>10 Unbearable</span>
              </div>
            </div>

            {/* Duration Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Onset & Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-900 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:bg-white"
              >
                <option value="Less than 2 hours">Acute: Less than 2 hours</option>
                <option value="2 to 12 hours">Acute: 2 to 12 hours</option>
                <option value="1 to 2 days">Subacute: 1 to 2 days</option>
                <option value="Several days">Subacute: 3 to 7 days</option>
                <option value="More than a week">Chronic: Greater than 1 week</option>
              </select>
            </div>

            {/* Selected Symptoms Summary */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5">
                <span>Tagged Symptoms ({selectedSymptoms.length})</span>
                {selectedSymptoms.length > 0 && (
                  <button onClick={() => setSelectedSymptoms([])} className="text-[11px] text-slate-400 hover:text-rose-500">
                    Clear all
                  </button>
                )}
              </div>
              <div className="min-h-[70px] p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-wrap gap-1.5">
                {selectedSymptoms.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">No tags selected yet. Click tags on the left or type your complaint.</span>
                ) : (
                  selectedSymptoms.map(s => (
                    <span
                      key={s.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        s.redFlag ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {s.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Run AI Analysis CTA */}
            <button
              onClick={handleAnalyze}
              disabled={isScanning}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Clinical AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Analyze with MediSense AI</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center italic">
              AI Decision Support: Computes urgency, probable conditions, and alerts on-duty physician.
            </p>

          </div>

        </div>

      </div>

      {/* AI Result Modal */}
      {analysisResult && (
        <AIAnalysisResult
          result={analysisResult}
          onClose={() => setAnalysisResult(null)}
        />
      )}

    </div>
  );
}
