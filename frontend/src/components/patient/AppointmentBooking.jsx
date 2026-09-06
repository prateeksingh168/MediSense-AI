import React, { useState } from 'react';
import { useMediSense } from '../../context/MediSenseContext';
import logoImg from '../../assets/logo.png';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Printer,
  CheckCircle2,
  FileText,
  MapPin,
  QrCode,
  ShieldCheck,
  Building2,
  Plus
} from 'lucide-react';

const DOCTORS_LIST = [
  {
    name: 'Dr. Robert Chen, MD',
    specialty: 'Cardiology & Emergency Triage',
    department: 'Cardiovascular Sciences',
    room: 'Consultation Suite 304, Wing B',
    days: 'Mon, Tue, Wed, Thu, Fri',
    fee: '$85 / Covered by Insurance'
  },
  {
    name: 'Dr. Sarah Al-Mansoor, MD',
    specialty: 'Neurology & Stroke Protocol',
    department: 'Neuroscience Center',
    room: 'Room 412, Neuro Wing',
    days: 'Mon, Wed, Fri',
    fee: '$95 / Covered by Insurance'
  },
  {
    name: 'Dr. Michael Chang, MD',
    specialty: 'Pulmonology & Respiratory Care',
    department: 'Pulmonary Care Unit',
    room: 'Room 208, West Wing',
    days: 'Tue, Thu, Sat',
    fee: '$80 / Covered by Insurance'
  },
  {
    name: 'Dr. Anita Gupta, MD',
    specialty: 'Endocrinology & Metabolism',
    department: 'Metabolic & Diabetic Clinic',
    room: 'Suite 105, East Wing',
    days: 'Mon, Tue, Thu',
    fee: '$85 / Covered by Insurance'
  },
  {
    name: 'Dr. Vikram Patel, MD',
    specialty: 'General Medicine & Family Practice',
    department: 'Outpatient Clinic (OPD)',
    room: 'OPD Chamber 12, Ground Floor',
    days: 'Mon to Sat',
    fee: '$50 / Covered by Insurance'
  }
];

const TIME_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
];

export default function AppointmentBooking() {
  const { currentPatient, appointments, bookAppointment, hospitalDoctors = [] } = useMediSense();

  const allDoctors = React.useMemo(() => {
    if (hospitalDoctors && hospitalDoctors.length > 0) {
      return hospitalDoctors.map(d => ({
        name: d.name,
        specialty: d.title,
        department: d.department,
        room: d.cabin,
        days: d.dutyShift,
        fee: '$85 / Covered by Insurance',
        status: d.statusLabel || 'Available'
      }));
    }
    return DOCTORS_LIST;
  }, [hospitalDoctors]);

  const [selectedDoctor, setSelectedDoctor] = useState(allDoctors[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-08');
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [consultType, setConsultType] = useState('In-Person Urgent OPD');
  const [visitReason, setVisitReason] = useState('Review AI symptom analysis report and vital signs.');
  const [generatedReceipt, setGeneratedReceipt] = useState(null);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newApt = bookAppointment({
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      department: selectedDoctor.department,
      room: selectedDoctor.room,
      appointmentDate: selectedDate,
      timeSlot: selectedTime,
      consultationType: consultType,
      reason: visitReason
    });
    setGeneratedReceipt(newApt);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Doctor Consultation & OPD Receipts
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Schedule a verified physician visit for <span className="font-bold text-teal-700">{currentPatient.name}</span> and generate an official hospital appointment token receipt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Booking Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handleBookingSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>1. Select Consulting Physician & Department</span>
            </h3>

            {/* Doctor Picker Cards */}
            <div className="space-y-2.5">
              {allDoctors.map((doc, idx) => {
                const isSelected = selectedDoctor.name === doc.name;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.specialty} • <span className="text-teal-700 font-medium">{doc.room}</span></div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-teal-200/60 text-teal-800' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Date & Time Selection */}
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 pt-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>2. Choose Appointment Date & Time Slot</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Consultation Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Consultation Mode</label>
                <select
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                  className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white"
                >
                  <option value="In-Person Urgent OPD">In-Person Urgent OPD</option>
                  <option value="Specialist Scheduled Review">Specialist Scheduled Review</option>
                  <option value="Telehealth Video Consultation">Telehealth Video Consultation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Available Time Slots</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedTime === slot
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason for Visit / Symptoms</label>
              <textarea
                rows={2}
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                placeholder="Mention chief complaints or attach symptom summary..."
                className="w-full bg-slate-50 text-xs sm:text-sm text-slate-900 p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Appointment & Generate Official Token Receipt</span>
            </button>

          </form>

        </div>

        {/* Existing Bookings & Quick Receipts (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>My Active Bookings</span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {appointments.length} Scheduled
              </span>
            </h3>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                      Token: {apt.tokenNumber}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-900">{apt.doctorName}</div>
                    <div className="text-xs text-slate-500">{apt.doctorSpecialty}</div>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-3 pt-1 border-t border-slate-200">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {apt.appointmentDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {apt.timeSlot}
                    </span>
                  </div>

                  <button
                    onClick={() => setGeneratedReceipt(apt)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>View & Print Official Receipt</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Printable Official Medical Appointment Receipt Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-300 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900">
            
            {/* Modal Actions Bar (hidden when printing) */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hospital OPD Appointment Receipt
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt / Save PDF
                </button>
                <button
                  onClick={() => setGeneratedReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="space-y-6 text-slate-900 bg-white">
              
              {/* Receipt Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-1 rounded-xl bg-slate-900 shadow">
                    <img src={logoImg} alt="MediSense AI Logo" className="h-10 w-auto object-contain rounded-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">MEDISENSE AI HEALTHCARE</h2>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      Outpatient Department (OPD) Consultation Token
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-slate-900">{generatedReceipt.id}</div>
                  <div className="text-slate-500 text-[11px]">Issued: {generatedReceipt.bookedAt}</div>
                </div>
              </div>

              {/* Big Token Number Strip */}
              <div className="p-4 rounded-2xl bg-teal-50 border-2 border-dashed border-teal-400 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Your OPD Queue Token</span>
                  <div className="text-3xl font-black text-teal-900">{generatedReceipt.tokenNumber}</div>
                  <div className="text-xs text-teal-700 mt-0.5">{generatedReceipt.room}</div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Date & Scheduled Time</span>
                  <div className="text-base font-extrabold text-slate-900">{generatedReceipt.appointmentDate}</div>
                  <div className="text-sm font-bold text-teal-700">{generatedReceipt.timeSlot}</div>
                </div>
              </div>

              {/* Patient & Doctor Two Columns */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Patient Details</span>
                  <div className="font-bold text-sm text-slate-900">{generatedReceipt.patientName}</div>
                  <div className="text-slate-600">{generatedReceipt.patientAge} yrs • {generatedReceipt.patientGender}</div>
                  <div className="text-slate-600">Phone: {generatedReceipt.patientPhone}</div>
                  <div className="text-slate-500 text-[11px]">Patient ID: {generatedReceipt.patientId}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Consulting Physician</span>
                  <div className="font-bold text-sm text-slate-900">{generatedReceipt.doctorName}</div>
                  <div className="text-teal-700 font-semibold">{generatedReceipt.doctorSpecialty}</div>
                  <div className="text-slate-600">{generatedReceipt.department}</div>
                  <div className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{generatedReceipt.feeStatus}</span>
                  </div>
                </div>

              </div>

              {/* Reason for Consultation */}
              <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-600 block text-[10px] uppercase">Reason for Consultation / Triage Summary:</span>
                <p className="text-slate-800 mt-1 font-medium">{generatedReceipt.reason}</p>
              </div>

              {/* Instructions & Barcode Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>• Please report to {generatedReceipt.room} 15 minutes before your time slot.</div>
                  <div>• Keep this digital or printed token receipt ready at hospital reception.</div>
                  <div className="font-bold text-slate-800 pt-1">Core Principle: AI assists. Doctors decide.</div>
                </div>

                <div className="text-center font-mono text-[10px] text-slate-400">
                  <div className="tracking-widest font-black text-slate-700 text-xs">||| | | |||| || | ||||| |||</div>
                  <span>SCAN FOR CHECK-IN</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
