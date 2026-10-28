import React, { useState } from 'react';
import { useEnrollment } from '../../context/EnrollmentContext';
import { Certificate } from '../../types';
import { Award, ExternalLink, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';

interface StudentCertificatesPageProps {
  navigate: (path: string) => void;
}

export const StudentCertificatesPage: React.FC<StudentCertificatesPageProps> = ({ navigate }) => {
  const { certificates } = useEnrollment();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(certificates[0] || null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 text-left">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verified Certificates & Credentials
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Cryptographically signed digital certificates for completed specializations and assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Certificate List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Earned Specializations ({certificates.length})
          </div>

          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCert?.id === cert.id
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 shadow-sm ring-1 ring-indigo-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {cert.courseTitle}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {cert.gradePercentage}% Grade
                </span>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums mb-3">
                ID: {cert.code}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Issued {cert.issueDate}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {certificates.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No certificates earned yet. Complete all lectures in an enrolled course to unlock your credentials!
            </div>
          )}
        </div>

        {/* Certificate Diploma Visual Preview */}
        {selectedCert && (
          <div className="lg:col-span-7 space-y-4">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Official Credential Document
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/certificate/verify/${selectedCert.code}`)}
                  className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Public Registry Link</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>

            {/* Diploma Canvas */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-900/20 dark:border-indigo-500/30 p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
              
              {/* Corner Watermarks */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                LEARNOVA ACADEMIC COUNCIL
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                ID: {selectedCert.code}
              </div>

              {/* Seal Mark */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white mx-auto flex items-center justify-center shadow-md">
                <Award className="w-9 h-9" />
              </div>

              {/* Institution Title */}
              <div>
                <span className="text-xs font-bold tracking-[0.25em] text-indigo-700 dark:text-indigo-400 uppercase block mb-1">
                  Certificate of Technical Mastery
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This rigorous credential is hereby conferred upon
                </p>
              </div>

              {/* Recipient */}
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight border-b-2 border-slate-200 dark:border-slate-800 pb-2 max-w-md mx-auto">
                {selectedCert.userName}
              </div>

              {/* Description */}
              <div className="max-w-lg mx-auto text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                for demonstrating exceptional architectural rigor, problem solving, and hands-on laboratory mastery in the specialized program
              </div>

              {/* Program Name */}
              <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white max-w-md mx-auto">
                {selectedCert.courseTitle}
              </div>

              {/* Signatures & Seal Grid */}
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-8 max-w-md mx-auto text-center text-xs">
                <div>
                  <div className="font-serif italic text-base text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-300 dark:border-slate-700">
                    {selectedCert.instructorName}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    Lead Faculty Chair
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-300 dark:border-slate-700 tabular-nums">
                    {selectedCert.issueDate}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                    Conferral Date
                  </div>
                </div>
              </div>

              {/* Cryptographic Proof Footer */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                <div className="truncate">
                  SHA-256: {selectedCert.credentialHash.slice(0, 32)}...
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified by Learnova Trust Network</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
