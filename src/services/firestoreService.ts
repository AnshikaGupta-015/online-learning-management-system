import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Course, Enrollment, Certificate, TimestampedNote, Order, User } from '../types';

export interface DiscussionRecord {
  id: string;
  courseId: string;
  lectureId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  reply?: string;
  instructorName?: string;
  createdAt: string;
}

// ================= USER PROFILES =================
export async function saveUserProfile(user: User): Promise<void> {
  const path = 'users';
  try {
    await setDoc(doc(db, path, user.id), {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || '',
      headline: user.headline || '',
      bio: user.bio || '',
      points: user.totalPoints || 0,
      streakDays: user.learningStreakDays || 1,
      createdAt: user.joinedDate || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${user.id}`);
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role,
      avatar: d.avatar,
      headline: d.headline,
      bio: d.bio,
      totalPoints: d.points,
      learningStreakDays: d.streakDays,
      joinedDate: d.createdAt,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// ================= ENROLLMENTS =================
export async function saveEnrollment(enrollment: Enrollment): Promise<void> {
  const path = 'enrollments';
  try {
    await setDoc(doc(db, path, enrollment.id), {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      progressPercentage: enrollment.progressPercentage,
      completedLectureIds: enrollment.completedLectureIds,
      currentLectureId: enrollment.currentLectureId,
      enrolledAt: enrollment.enrolledAt,
      lastAccessedAt: enrollment.lastAccessedAt,
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${enrollment.id}`);
  }
}

export async function fetchUserEnrollments(userId: string): Promise<Enrollment[]> {
  const path = 'enrollments';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    const results: Enrollment[] = [];
    snap.forEach((d) => {
      const data = d.data();
      results.push(data as Enrollment);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= NOTES =================
export async function saveNote(note: TimestampedNote): Promise<void> {
  const path = 'notes';
  try {
    await setDoc(doc(db, path, note.id), {
      id: note.id,
      courseId: note.courseId,
      lectureId: note.lectureId,
      lectureTitle: note.lectureTitle,
      timestampSeconds: note.timestampSeconds,
      text: note.text,
      userId: auth.currentUser?.uid || 'user_std_01',
      createdAt: note.createdAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${note.id}`);
  }
}

export async function deleteNoteFromDb(noteId: string): Promise<void> {
  const path = `notes/${noteId}`;
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= CERTIFICATES =================
export async function saveCertificate(cert: Certificate): Promise<void> {
  const path = 'certificates';
  try {
    await setDoc(doc(db, path, cert.id), {
      id: cert.id,
      code: cert.code,
      userId: cert.userId,
      userName: cert.userName,
      courseId: cert.courseId,
      courseTitle: cert.courseTitle,
      instructorName: cert.instructorName,
      issueDate: cert.issueDate,
      gradePercentage: cert.gradePercentage,
      credentialHash: cert.credentialHash,
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${cert.id}`);
  }
}

export async function verifyCertificateInDb(code: string): Promise<Certificate | null> {
  const path = 'certificates';
  try {
    const q = query(collection(db, path), where('code', '==', code.trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Certificate;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= ORDERS =================
export async function saveOrder(order: Order): Promise<void> {
  const path = 'orders';
  try {
    await setDoc(doc(db, path, order.id), {
      id: order.id,
      userId: order.userId,
      orderNumber: order.orderNumber,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.paymentMethod,
      couponApplied: order.couponApplied || null,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${order.id}`);
  }
}

// ================= DISCUSSIONS =================
export async function saveDiscussion(discussion: DiscussionRecord): Promise<void> {
  const path = 'discussions';
  try {
    await setDoc(doc(db, path, discussion.id), discussion, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${discussion.id}`);
  }
}

// ================= COURSES =================
export async function saveCourseToDb(course: Course): Promise<void> {
  const path = 'courses';
  try {
    await setDoc(doc(db, path, course.id), course, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${course.id}`);
  }
}
