// store/useExamStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateStudentData, validateTimetableData } from '../components/Atomic Dashboard/engines/validatorEngine';
import { normalizeDataset } from '../components/Atomic Dashboard/engines/datasetNormalizer';
import { findSubjectConflicts, resolveSubjectGroup } from '../components/Atomic Dashboard/engines/smartSubjectEngine';

export const useExamStore = create(
  persist(
    (set, get) => ({

      // ------- PERSISTED STRUCTURES -------
      rawStudentDataByExam: {},
      rawTimetableDataByExam: {},
      studentDataByExam: {},
      timetableDataByExam: {},
      errorBinByExam: {},
      subjectMappingsByExam: {},
      studentHeadersByExam: {},
      timetableHeadersByExam: {},

      processingStatus: "idle",

      // =============================
      // SAFE INITIALIZER
      // =============================
      _ensureExamKeys: (examId) => {
        if (!examId) return;

        set(state => ({
          rawStudentDataByExam: {
            ...state.rawStudentDataByExam,
            [examId]: state.rawStudentDataByExam?.[examId] ?? null
          },
          rawTimetableDataByExam: {
            ...state.rawTimetableDataByExam,
            [examId]: state.rawTimetableDataByExam?.[examId] ?? null
          },
          studentDataByExam: {
            ...state.studentDataByExam,
            [examId]: state.studentDataByExam?.[examId] ?? []
          },
          timetableDataByExam: {
            ...state.timetableDataByExam,
            [examId]: state.timetableDataByExam?.[examId] ?? []
          },
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: state.errorBinByExam?.[examId] ?? []
          },
          subjectMappingsByExam: {
            ...state.subjectMappingsByExam,
            [examId]: state.subjectMappingsByExam?.[examId] ?? {}
          },
          studentHeadersByExam: {
            ...state.studentHeadersByExam,
            [examId]: state.studentHeadersByExam?.[examId] ?? null
          },
          timetableHeadersByExam: {
            ...state.timetableHeadersByExam,
            [examId]: state.timetableHeadersByExam?.[examId] ?? null
          }
        }));
      },

      // =============================
      // ACCESSORS
      // =============================
      getStudentData: (examId) => get().studentDataByExam?.[examId] ?? [],
      getTimetableData: (examId) => get().timetableDataByExam?.[examId] ?? [],
      getErrorBin: (examId) => get().errorBinByExam?.[examId] ?? [],

      // =============================
      // STUDENT PROCESSING
      // =============================
      setRawStudentData: (examId, rows, headerMap) => {
        if (!examId) return console.warn("No examId in setRawStudentData");
        get()._ensureExamKeys(examId);

        const validation = validateStudentData(rows || []);

        set(state => ({
          rawStudentDataByExam: { ...state.rawStudentDataByExam, [examId]: rows },
          studentHeadersByExam: { ...state.studentHeadersByExam, [examId]: headerMap },
          studentDataByExam: { ...state.studentDataByExam, [examId]: validation.cleanData ?? [] },
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: [
              ...(state.errorBinByExam?.[examId] ?? []),
              ...(validation.errors ?? [])
            ]
          }
        }));
      },

      // =============================
      // TIMETABLE PROCESSING
      // =============================
      setRawTimetableData: (examId, rows, headerMap) => {
        if (!examId) return console.warn("No examId in setRawTimetableData");
        get()._ensureExamKeys(examId);

        const validation = validateTimetableData(rows || [], headerMap || {});

        set(state => ({
          rawTimetableDataByExam: { ...state.rawTimetableDataByExam, [examId]: rows },
          timetableHeadersByExam: { ...state.timetableHeadersByExam, [examId]: headerMap },
          timetableDataByExam: { ...state.timetableDataByExam, [examId]: validation.cleanData ?? [] },
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: [
              ...(state.errorBinByExam?.[examId] ?? []),
              ...(validation.errors ?? [])
            ]
          }
        }));
      },

      // =============================
      // ERROR BIN MODIFIERS
      // =============================
      addToErrorBinForExam: (examId, errors) => {
        set(state => ({
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: [...(state.errorBinByExam?.[examId] ?? []), ...errors]
          }
        }));
      },

      removeFromErrorBinForExam: (examId, errorId) => {
        set(state => ({
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: (state.errorBinByExam?.[examId] ?? []).filter(e => e.id !== errorId)
          }
        }));
      },

      updateErrorInBinForExam: (examId, errorId, updates) => {
        set(state => ({
          errorBinByExam: {
            ...state.errorBinByExam,
            [examId]: (state.errorBinByExam?.[examId] ?? []).map(e =>
              e.id === errorId ? { ...e, ...updates } : e
            )
          }
        }));
      },

      // =============================
      // SUBJECT CONFLICT ENGINE
      // =============================
      processSubjectConflictsForExam: async (examId) => {
        const s = get();
        return findSubjectConflicts(
          s.studentDataByExam?.[examId] ?? [],
          s.timetableDataByExam?.[examId] ?? []
        );
      },

      resolveSubjectConflictForExam: (examId, groupId, canonical, aliases) => {
        const mappings = get().subjectMappingsByExam?.[examId] ?? {};
        const updated = resolveSubjectGroup(groupId, canonical, aliases, mappings);

        set(state => ({
          subjectMappingsByExam: { ...state.subjectMappingsByExam, [examId]: updated }
        }));
      },

      // =============================
      // NORMALIZED DATA
      // =============================
      prepareAtomicDatasetForExam: (examId) => {
        const s = get();
        return normalizeDataset(
          s.studentDataByExam?.[examId] ?? [],
          s.timetableDataByExam?.[examId] ?? [],
          s.subjectMappingsByExam?.[examId] ?? {}
        );
      },

      // =============================
      // VALIDATION / READINESS
      // =============================
      getValidationStatusForExam: (examId) => {
        const s = get();
        const students = s.studentDataByExam?.[examId] ?? [];
        const timetable = s.timetableDataByExam?.[examId] ?? [];
        const errors = s.errorBinByExam?.[examId] ?? [];
        const mappings = s.subjectMappingsByExam?.[examId] ?? [];

        const normalized = normalizeDataset(students, timetable, mappings);

        return {
          studentDataReady: students.length > 0,
          timetableDataReady: timetable.length > 0,
          noDuplicateReg: !students.some(i => i._duplicate),
          subjectMatch: Object.keys(mappings).length > 0,
          timetableConsistency: timetable.length > 0,
          studentDaySlicing: normalized.days.length > 0,
          seatRequirementCount: normalized.days.every(d => d.students.length > 0),
          conflictFreeSubjectMap: Object.keys(mappings).length > 0,

          issues: [
            ...errors.filter(e => e.severity === "error"),
            ...(students.length === 0 ? [{ id: "no-students", message: "No student data uploaded" }] : []),
            ...(timetable.length === 0 ? [{ id: "no-timetable", message: "No timetable data uploaded" }] : [])
          ]
        };
      },

      // =============================
      // CLEAR DATA
      // =============================
      clearExamData: (examId) => {
        set(state => ({
          rawStudentDataByExam: { ...state.rawStudentDataByExam, [examId]: null },
          rawTimetableDataByExam: { ...state.rawTimetableDataByExam, [examId]: null },
          studentDataByExam: { ...state.studentDataByExam, [examId]: [] },
          timetableDataByExam: { ...state.timetableDataByExam, [examId]: [] },
          subjectMappingsByExam: { ...state.subjectMappingsByExam, [examId]: {} },
          errorBinByExam: { ...state.errorBinByExam, [examId]: [] },
          studentHeadersByExam: { ...state.studentHeadersByExam, [examId]: null },
          timetableHeadersByExam: { ...state.timetableHeadersByExam, [examId]: null }
        }));
      }
    }),
    {
      name: "exam-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        studentDataByExam: state.studentDataByExam,
        timetableDataByExam: state.timetableDataByExam
      })
    }
  )
);
