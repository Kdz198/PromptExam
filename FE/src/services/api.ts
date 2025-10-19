import type { Difficulty, Exam, Lesson, Matrix, MatrixConfig, Question, QuestionType, Subject } from "../types/api";

const DEFAULT_API_BASE_URL = "http://localhost:8080/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  return (await response.json()) as T;
}

export async function fetchSubjects(): Promise<Subject[]> {
  return request<Subject[]>(`${API_BASE_URL}/subject`, { method: "GET" });
}

export async function createSubject(payload: { code: string; name: string }): Promise<Subject> {
  return request<Subject>(`${API_BASE_URL}/subject`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchLessons(): Promise<Lesson[]> {
  return request<Lesson[]>(`${API_BASE_URL}/lesson`, { method: "GET" });
}

export async function createLesson(payload: { subjectCode: string; grade: number; name: string; learningObjectivesJson: string }): Promise<Lesson> {
  return request<Lesson>(`${API_BASE_URL}/lesson`, {
    method: "POST",
    body: JSON.stringify({
      subject: { code: payload.subjectCode },
      grade: payload.grade,
      name: payload.name,
      learningObjectivesJson: payload.learningObjectivesJson,
    }),
  });
}

export async function updateLesson(payload: {
  id: number;
  subjectCode: string;
  grade: number;
  name: string;
  learningObjectivesJson: string;
}): Promise<Lesson> {
  return request<Lesson>(`${API_BASE_URL}/lesson`, {
    method: "PUT",
    body: JSON.stringify({
      id: payload.id,
      subject: { code: payload.subjectCode },
      grade: payload.grade,
      name: payload.name,
      learningObjectivesJson: payload.learningObjectivesJson,
    }),
  });
}

export async function fetchQuestions(params: { gradeId: string; lessonId: string }): Promise<Question[]> {
  const url = new URL(`${API_BASE_URL}/questions`);
  url.searchParams.set("gradeId", params.gradeId);
  url.searchParams.set("lessonId", params.lessonId);
  return request<Question[]>(url.toString(), { method: "GET" });
}

export async function createQuestion(payload: {
  lessonId: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  defaultPoint: number;
  optionsJson: string | null;
  answerKey: string;
}): Promise<Question> {
  return request<Question>(`${API_BASE_URL}/questions`, {
    method: "POST",
    body: JSON.stringify({
      lesson: { id: payload.lessonId },
      questionText: payload.questionText,
      optionsJson: payload.optionsJson,
      answerKey: payload.answerKey,
      questionType: payload.questionType,
      difficulty: payload.difficulty,
      defaultPoint: payload.defaultPoint,
    }),
  });
}

export async function updateQuestion(payload: {
  id: number;
  lessonId: number;
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  defaultPoint: number;
  optionsJson: string | null;
  answerKey: string;
}): Promise<Question> {
  return request<Question>(`${API_BASE_URL}/questions`, {
    method: "PUT",
    body: JSON.stringify({
      id: payload.id,
      lesson: { id: payload.lessonId },
      questionText: payload.questionText,
      optionsJson: payload.optionsJson,
      answerKey: payload.answerKey,
      questionType: payload.questionType,
      difficulty: payload.difficulty,
      defaultPoint: payload.defaultPoint,
    }),
  });
}

export async function fetchMatrices(params: { subjectId: number; grade: number | string }): Promise<Matrix[]> {
  const url = new URL(`${API_BASE_URL}/matrix`);
  url.searchParams.set("subjectId", String(params.subjectId));
  url.searchParams.set("grade", typeof params.grade === "number" ? String(params.grade) : params.grade);
  return request<Matrix[]>(url.toString(), { method: "GET" });
}

export async function createMatrix(payload: {
  subjectId: number;
  grade: number;
  matrixName: string;
  description: string;
  difficultyQuestionCountMap: Partial<Record<Difficulty, number>>;
}): Promise<Matrix> {
  const sanitizedCounts = Object.fromEntries(
    Object.entries(payload.difficultyQuestionCountMap ?? {}).map(([key, value]) => {
      const numeric = typeof value === "number" ? value : Number.parseInt(String(value), 10);
      return [key, Number.isFinite(numeric) && numeric > 0 ? numeric : 0];
    })
  ) as Partial<Record<Difficulty, number>>;

  const difficultyQuestionCountMap = Object.fromEntries(
    Object.entries(sanitizedCounts).filter(([, count]) => typeof count === "number" && count > 0)
  ) as Partial<Record<Difficulty, number>>;

  const totalQuestions = Object.values(difficultyQuestionCountMap).reduce((total, count) => total + count, 0);

  return request<Matrix>(`${API_BASE_URL}/matrix`, {
    method: "POST",
    body: JSON.stringify({
      subjectId: payload.subjectId,
      grade: payload.grade,
      matrixName: payload.matrixName,
      description: payload.description,
      difficultyQuestionCountMap,
      totalQuestions,
    }),
  });
}

export async function updateMatrix(payload: {
  matrixId: number;
  subjectId: number;
  grade: number;
  matrixName: string;
  description: string;
  difficultyQuestionCountMap: Partial<Record<Difficulty, number>>;
  totalQuestions: number;
}): Promise<Matrix> {
  return request<Matrix>(`${API_BASE_URL}/matrix`, {
    method: "PUT",
    body: JSON.stringify({
      matrixId: payload.matrixId,
      matrixName: payload.matrixName,
      description: payload.description,
      totalQuestions: payload.totalQuestions,
      subjectId: payload.subjectId,
      grade: payload.grade,
      difficultyQuestionCountMap: payload.difficultyQuestionCountMap,
    }),
  });
}

export async function fetchMatrixDetails(matrixId: number): Promise<MatrixConfig[]> {
  return request<MatrixConfig[]>(`${API_BASE_URL}/matrix/${matrixId}`, {
    method: "GET",
  });
}

export async function fetchExams(): Promise<Exam[]> {
  return request<Exam[]>(`${API_BASE_URL}/exam`, { method: "GET" });
}

export async function createExam(payload: {
  examName: string;
  description?: string;
  subjectId: number;
  grade: number;
  matrixId: number;
  questionIds: number[];
  durationMinutes: number;
  totalMarks: number;
}): Promise<Exam> {
  return request<Exam>(`${API_BASE_URL}/exam`, {
    method: "POST",
    body: JSON.stringify({
      examName: payload.examName,
      description: payload.description,
      subjectId: payload.subjectId,
      grade: payload.grade,
      matrix: { id: payload.matrixId },
      questions: payload.questionIds.map((id) => ({ id })),
      durationMinutes: payload.durationMinutes,
      totalMarks: payload.totalMarks,
    }),
  });
}

export interface GenerateQuestionAIParams {
  lessonContent: string;
  subjectName: string;
  grade: number | string;
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface GeneratedQuestionAIResponse {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  defaultPoint: number;
  options?: string[];
  answerKey?: string;
}

export async function generateQuestionWithAI(params: GenerateQuestionAIParams): Promise<GeneratedQuestionAIResponse> {
  const messageLines = [
    "**Dữ liệu Bài học để tạo 1 câu hỏi:**",
    `* **Nội dung Bài học:** ${params.lessonContent}`,
    `* **Môn học:** ${params.subjectName}`,
    `* **Lớp:** ${params.grade}`,
    `* **Yêu cầu Loại Câu hỏi:** ${params.questionType}`,
    `* **Yêu cầu Độ khó:** ${params.difficulty}`,
  ];

  const url = new URL(`${API_BASE_URL}/gemini/chat`);
  url.searchParams.set("message", messageLines.join("\n"));

  return request<GeneratedQuestionAIResponse>(url.toString(), { method: "GET" });
}
