import React, { useState, useMemo } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import { TriageBadge } from '../common/Badge';
import RedFlagAlert from '../common/RedFlagAlert';
import logoImg from '../../assets/logo.png';
import {
  CheckCircle2,
  Activity,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  Printer,
  Sparkles,
  QrCode,
  ArrowRight,
  ChevronDown,
  X,
  FileText
} from 'lucide-react';

export default function AIAnalysisResult({ result, onClose }) {
  const { setPatientTab, hospitalDoctors = [], bookAppointment, currentPatient } = useMediSense();

  if (!result) return null;

  const isEmergency = result.triageLevel === 'EMERGENCY';

  // 1. Match and score hospital doctors based on symptoms & primary condition
  const matchedDoctors = useMemo(() => {
    const condition = (result.aiAnalysis?.primaryCondition || '').toLowerCase();
    const complaint = (result.chiefComplaint || '').toLowerCase();
    const symptomsText = (result.symptoms || []).map(s => s.name.toLowerCase()).join(' ');
    const allText = `${condition} ${complaint} ${symptomsText}`;

    return (hospitalDoctors || []).map(doc => {
      let score = 80;
      let matchReason = '';

      if (allText.includes('chest') || allText.includes('heart') || allText.includes('coronary') || allText.includes('cardiac') || allText.includes('angina') || allText.includes('palpitation')) {
        if (doc.department?.toLowerCase().includes('cardio')) {
          score = 98;
          matchReason = 'Direct Cardiovascular Match: Clinical presentation exhibits coronary/ischemic markers requiring immediate CCU evaluation.';
        } else if (doc.department?.toLowerCase().includes('emerg')) {
          score = 93;
          matchReason = 'Emergency Medicine Match: Immediate stabilization and continuous bedside ECG telemetry.';
        }
      } else if (allText.includes('headache') || allText.includes('migraine') || allText.includes('stroke') || allText.includes('neuro') || allText.includes('facial') || allText.includes('weakness') || allText.includes('vertigo')) {
        if (doc.department?.toLowerCase().includes('neuro')) {
          score = 97;
          matchReason = 'Neurovascular Match: Symptoms match acute intracranial or migraine presentation under stroke protocol.';
        }
      } else if (allText.includes('cough') || allText.includes('wheez') || allText.includes('breath') || allText.includes('dyspnea') || allText.includes('asthma') || allText.includes('pulmon') || allText.includes('stridor')) {
        if (doc.department?.toLowerCase().includes('pulm')) {
          score = 98;
          matchReason = 'Pulmonology Match: Acute airway bronchospasm and oxygen saturation monitoring required.';
        }
      } else if (allText.includes('abdomin') || allText.includes('appendic') || allText.includes('rebound') || allText.includes('stomach') || allText.includes('vomit') || allText.includes('surg')) {
        if (doc.department?.toLowerCase().includes('surg')) {
          score = 97;
          matchReason = 'Trauma & General Surgery Match: Clinical presentation matches acute surgical abdomen & ultrasound triage.';
        }
      } else if (allText.includes('glucos') || allText.includes('diabet') || allText.includes('thirst') || allText.includes('urination') || allText.includes('endo')) {
        if (doc.department?.toLowerCase().includes('endo')) {
          score = 96;
          matchReason = 'Endocrinology Match: Acute metabolic instability and glycemic regulation protocol.';
        }
      } else {
        if (doc.department?.toLowerCase().includes('emerg')) {
          score = 95;
          matchReason = 'Emergency Triage Match: Broad spectrum acute assessment and bedside stabilization.';
        }
      }

      if (doc.status === 'AVAILABLE') {
        score = Math.min(score + 1, 99);
      }

      return {
        ...doc,
        matchScore: score,
        matchReason: matchReason || `Specialist in ${doc.department} with clinical expertise in acute inpatient triage.`
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [result, hospitalDoctors]);

  // Top #1 Doctor is automatically selected by default!
  const [selectedDoctorId, setSelectedDoctorId] = useState(matchedDoctors[0]?.id || 'doc_001');
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [bookedReceipt, setBookedReceipt] = useState(null);

  const selectedDoctor = matchedDoctors.find(d => d.id === selectedDoctorId) || matchedDoctors[0];

  // Instant Appointment Booking with Official Receipt Generation
  const handleConfirmBooking = () => {
    const aptNumber = Math.floor(1000 + Math.random() * 9000);
    const tokenPrefix = selectedDoctor.department?.includes('Cardio')
      ? 'OPD-B'
      : selectedDoctor.department?.includes('Emerg')
      ? 'OPD-EM'
      : selectedDoctor.department?.includes('Neuro')
      ? 'OPD-N'
      : 'OPD-A';
    const tokenSlot = Math.floor(10 + Math.random() * 40);

    const newApt = bookAppointment({
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.title,
      department: selectedDoctor.department,
      room: selectedDoctor.cabin,
      appointmentDate: 'Today (06 Sep 2026)',
      timeSlot: selectedDoctor.nextFreeTime === 'Free Now' ? 'Immediate Priority Slot (Free Now)' : selectedDoctor.nextFreeTime,
      consultationType: isEmergency ? 'Emergency Critical Triage OPD' : 'Specialist Priority Review',
      reason: `${result.aiAnalysis.primaryCondition} - Reported: ${result.chiefComplaint}`
    });

    setBookedReceipt({
      ...newApt,
      tokenNumber: `#${tokenPrefix}${tokenSlot}`,
      doctorCabin: selectedDoctor.cabin,
      doctorShift: selectedDoctor.dutyShift,
      doctorContact: selectedDoctor.contact,
      matchScore: selectedDoctor.matchScore,
      matchReason: selectedDoctor.matchReason
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const goToAppointments = () => {
    onClose();
    setPatientTab('appointments');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 my-6 max-h-[92vh] overflow-y-auto">
        
        {/* VIEW 1: BOOKED TOKEN RECEIPT VIEW */}
        {bookedReceipt ? (
          <div className="space-y-6">
            
            {/* Receipt Success Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Appointment Confirmed & Token Generated!</h4>
                  <p className="text-xs text-emerald-700">Your consultation is registered with Dr. {bookedReceipt.doctorName.replace('Dr. ', '')}.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-black bg-white px-3 py-1 rounded-xl border border-emerald-300 text-emerald-800 shadow-sm">
                {bookedReceipt.tokenNumber}
              </span>
            </div>

            {/* Official Hospital Token Receipt Box (Printable) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-6 print:border-black print:p-0">
              
              {/* Hospital Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div className="flex items-center gap-3">
                  <img src={logoImg} alt="MediSense AI" className="w-10 h-10 object-contain rounded-xl" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      MediSense Central Hospital
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Official Outpatient (OPD) & Clinical Triage Admission Slip
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">RECEIPT REF:</div>
                  <div className="font-mono font-bold text-xs text-slate-800">{bookedReceipt.id}</div>
                  <span className="text-[10px] text-slate-500">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Digital Token Badge */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Digital OPD Queue Token</span>
                  <div className="text-3xl font-black text-teal-900 font-mono tracking-tight mt-0.5">
                    {bookedReceipt.tokenNumber}
                  </div>
                  <p className="text-xs text-teal-800 font-medium mt-1">
                    Present this token at OPD Wing B or proceed directly to <span className="font-bold">{bookedReceipt.doctorCabin}</span>.
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <TriageBadge level={result.triageLevel} />
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Token Confirmed
                  </span>
                </div>
              </div>

              {/* Patient & Assigned Doctor Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Patient Box */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Information</span>
                  <div className="text-sm font-bold text-slate-900">{currentPatient.name}</div>
                  <div className="text-slate-600 font-medium">UHID: <span className="font-mono text-slate-800">{currentPatient.id}</span></div>
                  <div className="text-slate-500">{currentPatient.age} yrs • {currentPatient.gender} • Blood Group: <span className="font-bold text-teal-700">{currentPatient.bloodType}</span></div>
                </div>

                {/* Doctor Box */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Matched Consulting Specialist</span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {bookedReceipt.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-sm font-bold text-indigo-900">{bookedReceipt.doctorName}</div>
                  <div className="text-slate-600 font-medium">{bookedReceipt.department}</div>
                  <div className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="font-bold text-slate-800">{bookedReceipt.doctorCabin}</span>
                    <span>• Shift: {bookedReceipt.doctorShift}</span>
                  </div>
                </div>

              </div>

              {/* Clinical Indication & Assessment */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Indication & AI Assessment</span>
                <div className="font-bold text-slate-900">
                  {result.aiAnalysis.primaryCondition} ({result.aiAnalysis.primaryProbability}% Match Confidence)
                </div>
                <div className="text-slate-600 text-[11px] leading-relaxed">
                  <span className="font-semibold text-slate-700">Reported Complaint: </span>
                  {result.chiefComplaint}
                </div>
              </div>

              {/* Barcode & Verification Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <QrCode className="w-10 h-10 text-slate-700 shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-mono font-bold text-slate-800">AUTH-TOKEN-VERIFIED</span>
                    <span className="block text-slate-400">Scannable by hospital OPD check-in kiosks</span>
                  </div>
                </div>

                <div className="text-center sm:text-right text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-600 inline mr-1" />
                  Official Hospital Document • MediSense AI
                </div>
              </div>

            </div>

            {/* Receipt Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Official Token Receipt</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={goToAppointments}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 transition-all shadow cursor-pointer"
                >
                  View in My Bookings & Receipts →
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* VIEW 2: AI ANALYSIS + AUTOMATED DOCTOR MATCH & BOOKING FORM */
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Symptom Triage Assessment</h3>
                  <p className="text-xs text-slate-500">MediSense Clinical Decision Support Engine v3.4</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TriageBadge level={result.triageLevel} />
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Red Flag Alert if Emergency */}
            {isEmergency && (
              <RedFlagAlert
                title="CRITICAL RED-FLAG ALERT"
                message="Your reported symptoms indicate high-acuity cardiovascular or acute systemic concern. Immediate hospital emergency evaluation is advised."
              />
            )}

            {/* Primary AI Assessment */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Primary Probable Condition
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  {result.aiAnalysis.primaryProbability}% AI Confidence
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900">
                {result.aiAnalysis.primaryCondition}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {result.aiAnalysis.urgencyAssessment}
              </p>
            </div>

            {/* Differential Considerations */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Differential Considerations
              </h5>
              <div className="space-y-2">
                {result.aiAnalysis.differentialDiagnoses.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium">
                    <span className="text-slate-800">{item.condition}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${idx === 0 ? 'bg-teal-600' : 'bg-slate-400'}`}
                          style={{ width: `${item.probability}%` }}
                        ></div>
                      </div>
                      <span className="text-slate-700 font-bold w-10 text-right">{item.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 🤖 AUTOMATICALLY RECOMMENDED DOCTOR (Auto-Selected based on symptoms) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-teal-50/50 to-white border-2 border-indigo-200 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>AI Specialist Recommendation (Auto-Selected for Your Symptoms)</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>{showDoctorDropdown ? 'Hide Other Doctors' : 'View Other Matched Doctors'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDoctorDropdown ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Pre-Selected Doctor Card */}
              <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
                    {selectedDoctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">
                        {selectedDoctor.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {selectedDoctor.matchScore}% Clinical Match
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-indigo-800 mt-0.5">
                      {selectedDoctor.title} • {selectedDoctor.department}
                    </p>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {selectedDoctor.cabin}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedDoctor.status === 'AVAILABLE' ? 'Available (Free Now)' : selectedDoctor.statusLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Next Priority Intake:</span>
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 inline-block mt-0.5">
                    Today • 10:30 AM Slot
                  </span>
                </div>

              </div>

              {/* Clinical Match Rationale */}
              <div className="p-3.5 rounded-2xl bg-indigo-100/50 border border-indigo-200/70 text-xs text-indigo-950 leading-relaxed font-medium">
                <strong className="text-indigo-900 font-bold">Why this doctor was selected: </strong>
                {selectedDoctor.matchReason}
              </div>

              {/* Optional Dropdown to Pick Another Matched Hospital Doctor */}
              {showDoctorDropdown && (
                <div className="space-y-2 pt-2 border-t border-indigo-100 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-600 block">Or Select Alternate Attending Specialist:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedDoctors.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setShowDoctorDropdown(false);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          selectedDoctorId === doc.id
                            ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-900 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{doc.name}</div>
                          <div className="text-[11px] text-slate-500">{doc.department} ({doc.cabin})</div>
                        </div>
                        <span className="font-bold text-teal-700 text-xs">{doc.matchScore}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Instant Booking Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              
              <button
                onClick={handleConfirmBooking}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment with {selectedDoctor.name.split(',')[0]} & Get Receipt →</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close Without Booking
              </button>

            </div>

          </>
        )}

      </div>
    </div>
  );
}
