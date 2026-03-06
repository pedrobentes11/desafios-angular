import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BugsService } from '../../services/bugs.service';
import { ScoreService } from '../../services/score.service';
import { BugChallenge, Category } from '../../models/interfaces';

type BugState = 'list' | 'playing' | 'revealed';

const CATEGORY_LABELS: Record<Category, string> = {
  promises: 'Promises',
  'data-binding': 'Data Binding',
  http: 'HTTP',
  httpclient: 'HttpClient',
};

@Component({
  selector: 'app-bugs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './bugs.html',
  styleUrl: './bugs.scss',
})
export class BugsComponent {
  private bugsService = inject(BugsService);
  private scoreService = inject(ScoreService);

  readonly categoryLabels = CATEGORY_LABELS;
  readonly allChallenges = this.bugsService.getAll();

  readonly state = signal<BugState>('list');
  readonly currentChallenge = signal<BugChallenge | null>(null);
  readonly userAnswer = signal('');
  readonly showSolution = signal(false);
  readonly selfEvalResult = signal<boolean | null>(null);

  readonly completedIds = signal<Set<number>>(new Set());

  readonly challengesByCategory = computed(() => {
    const categories: Category[] = ['promises', 'data-binding', 'http', 'httpclient'];
    return categories.map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      challenges: this.allChallenges.filter((c) => c.category === cat),
    }));
  });

  readonly totalCompleted = computed(() => this.completedIds().size);

  openChallenge(challenge: BugChallenge): void {
    this.currentChallenge.set(challenge);
    this.userAnswer.set('');
    this.showSolution.set(false);
    this.selfEvalResult.set(null);
    this.state.set('playing');
  }

  revealSolution(): void {
    this.showSolution.set(true);
    this.state.set('revealed');
  }

  markResult(correct: boolean): void {
    const ch = this.currentChallenge();
    if (!ch) return;
    this.selfEvalResult.set(correct);
    this.scoreService.recordBugAttempt(ch.id, ch.category, correct);
    this.completedIds.update((s) => {
      const next = new Set(s);
      next.add(ch.id);
      return next;
    });
  }

  backToList(): void {
    this.state.set('list');
    this.currentChallenge.set(null);
  }

  isCompleted(id: number): boolean {
    return this.completedIds().has(id);
  }

  updateAnswer(value: string): void {
    this.userAnswer.set(value);
  }
}
