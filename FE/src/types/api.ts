export interface Subject {
  id?: number;
  code: string;
  name: string;
}

export interface Lesson {
  id: number;
  subject: Subject;
  grade: number;
  name: string;
  learningObjectivesJson: string;
}

export type QuestionType = "TracNghiem" | "TuLuan";

export type Difficulty = "NhanBiet" | "ThongHieu" | "VanDung" | "VanDungCao";

export interface QuestionOption {
  [key: string]: string;
}

export interface Question {
  id: number;
  lesson: Lesson;
  questionText: string;
  optionsJson: string | null;
  answerKey: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  defaultPoint: number;
}

export interface Matrix {
  id: number;
  subject: Subject | null;
  subjectId?: number;
  grade: number;
  matrixName: string;
  description: string;
  totalQuestions: number;
  createdAt: string;
  updatedAt?: string;
  matrixConfigs?: MatrixConfig[];
}

export interface MatrixConfig {
  id: number;
  matrix: Matrix;
  difficulty: Difficulty;
  require_count: number;
}

export interface StructureItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  grade: string;
  lessonId: number;
  lessonName: string;
  questionCount: number;
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface Exam {
  id: number;
  examName: string;
  description?: string | null;
  subjectId?: number | null;
  grade?: number | null;
  matrix?: Matrix | null;
  matrixConfigs?: MatrixConfig[];
  durationMinutes?: number | null;
  totalMarks?: number | null;
  createdAt?: string;
  questions: Question[];
}
