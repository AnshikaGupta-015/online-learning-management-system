import React, { createContext, useContext, useState, useEffect } from 'react';
import { Enrollment, TimestampedNote, Certificate, Course } from '../types';
import { SAMPLE_ENROLLMENTS, SAMPLE_CERTIFICATES, SAMPLE_NOTES, SAMPLE_COURSES } from '../data/mockData';
import {
  saveEnrollment,
  saveNote,
  deleteNoteFromDb,
  saveCertificate,
  verifyCertificateInDb,
} from '../services/firestoreService';

interface EnrollmentContextType {
  enrollments: Enrollment[];
  notes: TimestampedNote[];
  certificates: Certificate[];
  isEnrolled: (courseId: string) => boolean;
  enrollInCourse: (course: Course) => Enrollment;
  getEnrollment: (courseId: string) => Enrollment | undefined;
  markLectureCompleted: (courseId: string, lectureId: string) => void;
  setCurrentLecture: (courseId: string, lectureId: string) => void;
  addNote: (courseId: string, lectureId: string, lectureTitle: string, timestampSeconds: number, text: string) => void;
  deleteNote: (id: string) => void;
  claimCertificate: (courseId: string, userName: string) => Certificate;
  getCertificateByCode: (code: string) => Certificate | undefined;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(SAMPLE_ENROLLMENTS);
  const [notes, setNotes] = useState<TimestampedNote[]>(SAMPLE_NOTES);
  const [certificates, setCertificates] = useState<Certificate[]>(SAMPLE_CERTIFICATES);

  // Pre-seed sample certificates into Firestore so verification works immediately
  useEffect(() => {
    SAMPLE_CERTIFICATES.forEach((cert) => {
      saveCertificate(cert).catch(() => {});
    });
  }, []);

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const getEnrollment = (courseId: string) => {
    return enrollments.find((e) => e.courseId === courseId);
  };

  const enrollInCourse = (course: Course): Enrollment => {
    const existing = enrollments.find((e) => e.courseId === course.id);
    if (existing) return existing;

    const firstLectureId = course.sections[0]?.lectures[0]?.id || '';
    const newEnrollment: Enrollment = {
      id: `enr_${Date.now()}`,
      userId: 'user_std_01',
      courseId: course.id,
      course,
      enrolledAt: new Date().toISOString().split('T')[0],
      lastAccessedAt: new Date().toISOString().split('T')[0],
      completedLectureIds: [],
      currentLectureId: firstLectureId,
      progressPercentage: 0,
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);
    saveEnrollment(newEnrollment).catch(() => {});
    return newEnrollment;
  };

  const markLectureCompleted = (courseId: string, lectureId: string) => {
    setEnrollments((prev) =>
      prev.map((enr) => {
        if (enr.courseId !== courseId) return enr;
        const totalLectures = enr.course.sections.reduce((acc, s) => acc + s.lectures.length, 0) || 1;
        const completed = enr.completedLectureIds.includes(lectureId)
          ? enr.completedLectureIds
          : [...enr.completedLectureIds, lectureId];
        const progress = Math.min(100, Math.round((completed.length / totalLectures) * 100));

        const updated: Enrollment = {
          ...enr,
          completedLectureIds: completed,
          progressPercentage: progress,
          lastAccessedAt: new Date().toISOString().split('T')[0],
          completedAt: progress === 100 ? new Date().toISOString().split('T')[0] : enr.completedAt,
        };

        saveEnrollment(updated).catch(() => {});
        return updated;
      })
    );
  };

  const setCurrentLecture = (courseId: string, lectureId: string) => {
    setEnrollments((prev) =>
      prev.map((enr) => {
        if (enr.courseId !== courseId) return enr;
        const updated = { ...enr, currentLectureId: lectureId };
        saveEnrollment(updated).catch(() => {});
        return updated;
      })
    );
  };

  const addNote = (
    courseId: string,
    lectureId: string,
    lectureTitle: string,
    timestampSeconds: number,
    text: string
  ) => {
    const newNote: TimestampedNote = {
      id: `note_${Date.now()}`,
      courseId,
      lectureId,
      lectureTitle,
      timestampSeconds,
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNotes((prev) => [newNote, ...prev]);
    saveNote(newNote).catch(() => {});
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    deleteNoteFromDb(id).catch(() => {});
  };

  const claimCertificate = (courseId: string, userName: string): Certificate => {
    const course = SAMPLE_COURSES.find((c) => c.id === courseId);
    const existingCert = certificates.find((c) => c.courseId === courseId);
    if (existingCert) return existingCert;

    const certCode = `LNV-${new Date().getFullYear()}-${courseId.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      code: certCode,
      userId: 'user_std_01',
      userName: userName || 'Alex Rivera',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      courseId,
      courseTitle: course?.title || 'Advanced Engineering Specialization',
      instructorName: course?.instructor.name || 'Learnova Faculty Board',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      gradePercentage: 98,
      verificationUrl: `/certificate/verify/${certCode}`,
      credentialHash: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    setCertificates((prev) => [newCert, ...prev]);
    saveCertificate(newCert).catch(() => {});
    return newCert;
  };

  const getCertificateByCode = (code: string) => {
    const local = certificates.find((c) => c.code.toLowerCase() === code.toLowerCase().trim());
    if (local) return local;

    // Asynchronous background check
    verifyCertificateInDb(code).then((remote) => {
      if (remote) {
        setCertificates((prev) => (prev.some((c) => c.id === remote.id) ? prev : [...prev, remote]));
      }
    });
    return undefined;
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollments,
        notes,
        certificates,
        isEnrolled,
        enrollInCourse,
        getEnrollment,
        markLectureCompleted,
        setCurrentLecture,
        addNote,
        deleteNote,
        claimCertificate,
        getCertificateByCode,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};
