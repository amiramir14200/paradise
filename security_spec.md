# Security Specification: Paradise Academy (آکادمی پارادایس)

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created by an authenticated user matching `request.auth.uid == userId`. The initial role for self-registration must be `student` or `guardian`. The `role` cannot be elevated to `admin` without existing admin privileges.
2. **Admin Privilege Invariant**: Admin actions require existence in `/admins/$(request.auth.uid)` or bootstrapped admin verification (`amiramir14200@gmail.com`).
3. **Course Modification Invariant**: Courses can only be created, updated, or deleted by Administrators. Published courses can be read by any visitor (public catalog).
4. **Enrollment Invariant**: An enrollment document can be created by a student for themselves (`incoming().studentId == request.auth.uid`), or by their linked guardian, or an admin. An enrollment cannot mark its own status as `active` upon initial creation unless handled by payment verification or admin.
5. **Assessment Invariant**: Quiz attempts at `/quizAttempts/{attemptId}` can only be submitted by the student who took the quiz (`studentId == request.auth.uid`). Score cannot be modified once set, preventing post-submission tampering.
6. **Attendance Invariant**: Attendance records can only be recorded or modified by the assigned teacher of that class or an admin.
7. **PII Isolation Invariant**: Student contact info, telephone numbers, and guardian details can only be viewed by the user themselves, their linked guardian, teachers of classes they belong to, or admins.
8. **Live Class Invariant**: Live class documents can be read by enrolled students, assigned teachers, and admins. Meeting URLs are only accessible to enrolled members and teachers.

## 2. The Dirty Dozen Malicious Payloads
1. **Role Escalation Attempt**: Attacker tries to set `role: "admin"` during user signup at `/users/{attackerUid}`.
2. **Ghost Field Injection (Shadow Update)**: Attacker attempts to inject an extra unvalidated privilege field `isSuperAdmin: true` into their user document.
3. **Impersonation in Enrollment**: Attacker submits an enrollment with `studentId: "victimUid"` to force a charge or enrollment.
4. **Self-Activation of Order**: Unpaid student tries to update `/enrollments/{enrollmentId}` with `status: "active"` without payment verification.
5. **Course Price Tampering**: Non-admin user tries to update `/courses/{courseId}` setting `price: 0`.
6. **Fake Attendance Injection**: Student attempts to mark themselves as `status: "present"` in `/attendances/{attendanceId}`.
7. **Quiz Score Forgery**: Student submits a modified `/quizAttempts/{attemptId}` with `score: 100` after failing.
8. **Cross-Tenant Teacher Schedule Hijack**: Teacher A attempts to modify class details or meeting URL of Teacher B's live class.
9. **Junk ID Resource Exhaustion**: Attacker sends document ID with 50KB junk characters to `/courses/{courseId}`.
10. **Unauthenticated CMS Alteration**: Anonymous client attempts to overwrite `/cmsPages/home` with spam HTML.
11. **Site Currency Hijack**: Non-admin updates `/siteSettings/global` changing currency from toman to invalid value.
12. **PII Scraping via Blanket List**: Unauthenticated attacker tries to query all `/users` without filtering by own ID.

## 3. Test Runner Specification
The test suite in `firestore.rules.test.ts` validates that each of these 12 malicious payloads fails with `PERMISSION_DENIED`, confirming zero-trust ABAC boundaries.
