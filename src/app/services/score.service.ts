import { Injectable, signal, computed } from '@angular/core';
import {
  UserScore,
  CategoryScore,
  QuizAnswer,
  BugAttempt,
  Category,
} from '../models/interfaces';

const STORAGE_KEY = 'desafios_angular_score';

const CATEGORY_LABELS: Record<Category, string> = {
  promises: 'Promises',
  'data-binding': 'Data Binding',
  http: 'HTTP',
  httpclient: 'HttpClient',
  rxjs: 'RxJS',
  signals: 'Signals',
  'angular-core': 'Angular Core',
};

function buildInitialScore(): UserScore {
  const categories: Category[] = ['promises', 'data-binding', 'http', 'httpclient', 'rxjs', 'signals', 'angular-core'];
  return {
    totalCorrect: 0,
    totalIncorrect: 0,
    totalBugsFound: 0,
    totalBugsMissed: 0,
    categoryScores: categories.map((c) => ({
      category: c,
      label: CATEGORY_LABELS[c],
      correct: 0,
      incorrect: 0,
    })),
    quizAnswers: [],
    bugAttempts: [],
  };
}

function loadFromStorage(): UserScore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserScore;
  } catch {
    // ignore
  }
  return buildInitialScore();
}

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly _score = signal<UserScore>(loadFromStorage());

  readonly score = this._score.asReadonly();

  readonly totalCorrect = computed(() => this._score().totalCorrect);
  readonly totalIncorrect = computed(() => this._score().totalIncorrect);
  readonly totalBugsFound = computed(() => this._score().totalBugsFound);
  readonly totalBugsMissed = computed(() => this._score().totalBugsMissed);

  readonly accuracy = computed(() => {
    const total = this.totalCorrect() + this.totalIncorrect();
    if (total === 0) return 0;
    return Math.round((this.totalCorrect() / total) * 100);
  });

  readonly bugAccuracy = computed(() => {
    const total = this.totalBugsFound() + this.totalBugsMissed();
    if (total === 0) return 0;
    return Math.round((this.totalBugsFound() / total) * 100);
  });

  readonly strongCategories = computed(() =>
    this._score()
      .categoryScores.filter((c) => c.correct + c.incorrect > 0)
      .filter((c) => {
        const total = c.correct + c.incorrect;
        return total > 0 && c.correct / total >= 0.6;
      })
      .sort((a, b) => b.correct / (b.correct + b.incorrect) - a.correct / (a.correct + a.incorrect))
      .slice(0, 2)
  );

  readonly weakCategories = computed(() =>
    this._score()
      .categoryScores.filter((c) => c.correct + c.incorrect > 0)
      .filter((c) => {
        const total = c.correct + c.incorrect;
        return total > 0 && c.correct / total < 0.6;
      })
      .sort((a, b) => a.correct / (a.correct + a.incorrect) - b.correct / (b.correct + b.incorrect))
      .slice(0, 2)
  );

  readonly categoryScores = computed(() => this._score().categoryScores);

  recordQuizAnswer(questionId: number, category: Category, isCorrect: boolean): void {
    this._score.update((s) => {
      const newAnswer: QuizAnswer = { questionId, category, isCorrect, answeredAt: new Date() };
      const catScores = s.categoryScores.map((cs) =>
        cs.category === category
          ? { ...cs, correct: cs.correct + (isCorrect ? 1 : 0), incorrect: cs.incorrect + (isCorrect ? 0 : 1) }
          : cs
      );
      const updated: UserScore = {
        ...s,
        totalCorrect: s.totalCorrect + (isCorrect ? 1 : 0),
        totalIncorrect: s.totalIncorrect + (isCorrect ? 0 : 1),
        categoryScores: catScores,
        quizAnswers: [...s.quizAnswers, newAnswer],
      };
      this.persist(updated);
      return updated;
    });
  }

  recordBugAttempt(challengeId: number, category: Category, isCorrect: boolean): void {
    this._score.update((s) => {
      const newAttempt: BugAttempt = { challengeId, category, isCorrect, answeredAt: new Date() };
      const catScores = s.categoryScores.map((cs) =>
        cs.category === category
          ? { ...cs, correct: cs.correct + (isCorrect ? 1 : 0), incorrect: cs.incorrect + (isCorrect ? 0 : 1) }
          : cs
      );
      const updated: UserScore = {
        ...s,
        totalBugsFound: s.totalBugsFound + (isCorrect ? 1 : 0),
        totalBugsMissed: s.totalBugsMissed + (isCorrect ? 0 : 1),
        categoryScores: catScores,
        bugAttempts: [...s.bugAttempts, newAttempt],
      };
      this.persist(updated);
      return updated;
    });
  }

  resetScore(): void {
    const fresh = buildInitialScore();
    this._score.set(fresh);
    this.persist(fresh);
  }

  private persist(score: UserScore): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    } catch {
      // ignore
    }
  }
}
