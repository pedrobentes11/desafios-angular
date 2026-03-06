import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { QuizService } from '../../services/quiz.service';
import { ScoreService } from '../../services/score.service';
import { QuizQuestion, Category } from '../../models/interfaces';
import { APP_ICONS } from '../../icons';

type QuizState = 'config' | 'playing' | 'finished';

const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas as categorias' },
  { value: 'promises', label: 'Promises' },
  { value: 'data-binding', label: 'Data Binding' },
  { value: 'http', label: 'HTTP' },
  { value: 'httpclient', label: 'HttpClient' },
  { value: 'rxjs', label: 'RxJS' },
  { value: 'signals', label: 'Signals' },
  { value: 'angular-core', label: 'Angular Core' },
];

@Component({
  selector: 'app-quest',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './quest.html',
  styleUrl: './quest.scss',
})
export class QuestComponent {
  private quizService = inject(QuizService);
  private scoreService = inject(ScoreService);

  readonly icons = APP_ICONS;
  readonly categoryOptions = CATEGORY_OPTIONS;

  readonly state = signal<QuizState>('config');
  readonly selectedCategory = signal<Category | 'all'>('all');
  readonly questions = signal<QuizQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly selectedOption = signal<number | null>(null);
  readonly showFeedback = signal(false);
  readonly results = signal<{ question: QuizQuestion; selected: number; correct: boolean }[]>([]);

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  readonly isLast = computed(() => this.currentIndex() === this.questions().length - 1);
  readonly progress = computed(() => {
    if (this.questions().length === 0) return 0;
    return Math.round(((this.currentIndex() + 1) / this.questions().length) * 100);
  });

  readonly correctCount = computed(() => this.results().filter((r) => r.correct).length);
  readonly incorrectCount = computed(() => this.results().filter((r) => !r.correct).length);
  readonly finalAccuracy = computed(() => {
    const total = this.results().length;
    if (total === 0) return 0;
    return Math.round((this.correctCount() / total) * 100);
  });

  readonly feedbackMessage = computed(() => {
    const acc = this.finalAccuracy();
    if (acc >= 80) return '🎉 Excelente! Você mandou muito bem!';
    if (acc >= 60) return '👍 Bom resultado! Continue praticando!';
    if (acc >= 40) return '📚 Quase lá! Revise os tópicos em que errou.';
    return '💪 Não desanime! Pratique mais para melhorar.';
  });

  startQuiz(): void {
    const cat = this.selectedCategory();
    const pool =
      cat === 'all'
        ? this.quizService.getAll()
        : this.quizService.getByCategory(cat);

    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    this.questions.set(shuffled);
    this.currentIndex.set(0);
    this.selectedOption.set(null);
    this.showFeedback.set(false);
    this.results.set([]);
    this.state.set('playing');
  }

  selectOption(index: number): void {
    if (this.showFeedback()) return;
    this.selectedOption.set(index);
  }

  confirmAnswer(): void {
    const selected = this.selectedOption();
    if (selected === null) return;

    const q = this.currentQuestion();
    const correct = selected === q.correctIndex;

    this.showFeedback.set(true);
    this.results.update((r) => [...r, { question: q, selected, correct }]);
    this.scoreService.recordQuizAnswer(q.id, q.category, correct);
  }

  nextQuestion(): void {
    if (this.isLast()) {
      this.state.set('finished');
      return;
    }
    this.currentIndex.update((i) => i + 1);
    this.selectedOption.set(null);
    this.showFeedback.set(false);
  }

  restart(): void {
    this.state.set('config');
  }

  setCategory(value: string): void {
    this.selectedCategory.set(value as Category | 'all');
  }

  getOptionClass(index: number): string {
    if (!this.showFeedback()) {
      return this.selectedOption() === index ? 'option--selected' : '';
    }
    const q = this.currentQuestion();
    if (index === q.correctIndex) return 'option--correct';
    if (index === this.selectedOption() && index !== q.correctIndex) return 'option--wrong';
    return 'option--disabled';
  }
}
