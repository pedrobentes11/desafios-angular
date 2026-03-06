import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreService } from '../../services/score.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  private scoreService = inject(ScoreService);

  readonly score = this.scoreService.score;
  readonly totalCorrect = this.scoreService.totalCorrect;
  readonly totalIncorrect = this.scoreService.totalIncorrect;
  readonly totalBugsFound = this.scoreService.totalBugsFound;
  readonly totalBugsMissed = this.scoreService.totalBugsMissed;
  readonly accuracy = this.scoreService.accuracy;
  readonly bugAccuracy = this.scoreService.bugAccuracy;
  readonly strongCategories = this.scoreService.strongCategories;
  readonly weakCategories = this.scoreService.weakCategories;
  readonly categoryScores = this.scoreService.categoryScores;

  readonly totalAttempts = computed(
    () => this.totalCorrect() + this.totalIncorrect()
  );

  readonly totalBugAttempts = computed(
    () => this.totalBugsFound() + this.totalBugsMissed()
  );

  readonly hasActivity = computed(
    () => this.totalAttempts() + this.totalBugAttempts() > 0
  );

  getCategoryPercent(correct: number, incorrect: number): number {
    const total = correct + incorrect;
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  resetar(): void {
    if (confirm('Tem certeza que deseja resetar todo o seu progresso?')) {
      this.scoreService.resetScore();
    }
  }
}
