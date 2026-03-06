$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# ── home.html ──────────────────────────────────────────────────────────────────
$home = @"
<section class="home">
  <header class="home__header">
    <div class="home__header-content">
      <h1 class="home__title">
        <lucide-icon [img]="icons.Zap" class="home__title-icon" aria-hidden="true" [size]="32"></lucide-icon>
        Desafios Angular
      </h1>
      <p class="home__subtitle">Aprenda Promises, Data Binding, HTTP, HttpClient, RxJS e Signals na pratica</p>
    </div>
  </header>

  <div class="home__actions" role="navigation" aria-label="Secoes de desafios">
    <a routerLink="/quest" class="action-card action-card--quiz" aria-label="Ir para o Quiz">
      <div class="action-card__icon" aria-hidden="true">
        <lucide-icon [img]="icons.Target" [size]="36"></lucide-icon>
      </div>
      <div class="action-card__body">
        <h2 class="action-card__title">Quiz</h2>
        <p class="action-card__desc">Responda perguntas de multipla escolha sobre Promises, Data Binding, HTTP, HttpClient, RxJS e Signals</p>
        <span class="action-card__count">48 perguntas disponiveis</span>
      </div>
      <lucide-icon [img]="icons.ChevronRight" class="action-card__arrow" aria-hidden="true" [size]="22"></lucide-icon>
    </a>

    <a routerLink="/bugs" class="action-card action-card--bugs" aria-label="Ir para desafios de bugs">
      <div class="action-card__icon" aria-hidden="true">
        <lucide-icon [img]="icons.Bug" [size]="36"></lucide-icon>
      </div>
      <div class="action-card__body">
        <h2 class="action-card__title">Bug Hunt</h2>
        <p class="action-card__desc">Identifique e corrija bugs em trechos de codigo reais</p>
        <span class="action-card__count">22 desafios disponiveis</span>
      </div>
      <lucide-icon [img]="icons.ChevronRight" class="action-card__arrow" aria-hidden="true" [size]="22"></lucide-icon>
    </a>
  </div>

  @if (hasActivity()) {
    <section class="dashboard" aria-label="Dashboard de progresso">
      <h2 class="dashboard__title">
        <lucide-icon [img]="icons.BarChart2" [size]="20" aria-hidden="true"></lucide-icon>
        Seu Progresso
      </h2>

      <div class="dashboard__metrics" role="list">
        <div class="metric-card metric-card--correct" role="listitem">
          <lucide-icon [img]="icons.CheckCircle" class="metric-card__icon" [size]="20" aria-hidden="true"></lucide-icon>
          <span class="metric-card__value">{{ totalCorrect() }}</span>
          <span class="metric-card__label">Acertos no Quiz</span>
        </div>
        <div class="metric-card metric-card--incorrect" role="listitem">
          <lucide-icon [img]="icons.XCircle" class="metric-card__icon" [size]="20" aria-hidden="true"></lucide-icon>
          <span class="metric-card__value">{{ totalIncorrect() }}</span>
          <span class="metric-card__label">Erros no Quiz</span>
        </div>
        <div class="metric-card metric-card--bugs" role="listitem">
          <lucide-icon [img]="icons.ShieldAlert" class="metric-card__icon" [size]="20" aria-hidden="true"></lucide-icon>
          <span class="metric-card__value">{{ totalBugsFound() }}</span>
          <span class="metric-card__label">Bugs Encontrados</span>
        </div>
        <div class="metric-card metric-card--missed" role="listitem">
          <lucide-icon [img]="icons.AlertTriangle" class="metric-card__icon" [size]="20" aria-hidden="true"></lucide-icon>
          <span class="metric-card__value">{{ totalBugsMissed() }}</span>
          <span class="metric-card__label">Bugs Perdidos</span>
        </div>
      </div>

      <div class="accuracy-section">
        <div class="accuracy-bar-group">
          <div class="accuracy-bar-group__header">
            <span class="accuracy-bar-group__label">
              <lucide-icon [img]="icons.Target" [size]="14" aria-hidden="true"></lucide-icon>
              Precisao no Quiz
            </span>
            <span class="accuracy-bar-group__percent">{{ accuracy() }}%</span>
          </div>
          <div class="accuracy-bar" role="progressbar" [attr.aria-valuenow]="accuracy()" aria-valuemin="0" aria-valuemax="100">
            <div class="accuracy-bar__fill" [style.width.%]="accuracy()"></div>
          </div>
          <span class="accuracy-bar-group__detail">{{ totalAttempts() }} perguntas respondidas</span>
        </div>
        <div class="accuracy-bar-group">
          <div class="accuracy-bar-group__header">
            <span class="accuracy-bar-group__label">
              <lucide-icon [img]="icons.Bug" [size]="14" aria-hidden="true"></lucide-icon>
              Precisao nos Bugs
            </span>
            <span class="accuracy-bar-group__percent">{{ bugAccuracy() }}%</span>
          </div>
          <div class="accuracy-bar" role="progressbar" [attr.aria-valuenow]="bugAccuracy()" aria-valuemin="0" aria-valuemax="100">
            <div class="accuracy-bar__fill accuracy-bar__fill--bugs" [style.width.%]="bugAccuracy()"></div>
          </div>
          <span class="accuracy-bar-group__detail">{{ totalBugAttempts() }} desafios tentados</span>
        </div>
      </div>

      <div class="categories-section">
        <h3 class="categories-section__title">
          <lucide-icon [img]="icons.Layers" [size]="16" aria-hidden="true"></lucide-icon>
          Por Categoria
        </h3>
        <div class="categories-grid" role="list">
          @for (cat of categoryScores(); track cat.category) {
            <div class="category-card" role="listitem">
              <div class="category-card__header">
                <span class="category-card__label">{{ cat.label }}</span>
                <span class="category-card__percent"
                  [class.category-card__percent--good]="getCategoryPercent(cat.correct, cat.incorrect) >= 60"
                  [class.category-card__percent--bad]="getCategoryPercent(cat.correct, cat.incorrect) < 60 && (cat.correct + cat.incorrect) > 0">
                  @if (cat.correct + cat.incorrect > 0) {
                    {{ getCategoryPercent(cat.correct, cat.incorrect) }}%
                  } @else {
                    --
                  }
                </span>
              </div>
              <div class="category-card__bar" role="progressbar"
                [attr.aria-valuenow]="getCategoryPercent(cat.correct, cat.incorrect)"
                aria-valuemin="0" aria-valuemax="100">
                <div class="category-card__fill"
                  [style.width.%]="getCategoryPercent(cat.correct, cat.incorrect)"
                  [class.category-card__fill--good]="getCategoryPercent(cat.correct, cat.incorrect) >= 60"
                  [class.category-card__fill--bad]="getCategoryPercent(cat.correct, cat.incorrect) < 60 && (cat.correct + cat.incorrect) > 0">
                </div>
              </div>
              <div class="category-card__stats">
                <span class="category-card__correct">
                  <lucide-icon [img]="icons.Check" [size]="12" aria-hidden="true"></lucide-icon>
                  {{ cat.correct }}
                </span>
                <span class="category-card__incorrect">
                  <lucide-icon [img]="icons.X" [size]="12" aria-hidden="true"></lucide-icon>
                  {{ cat.incorrect }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="insights">
        @if (strongCategories().length > 0) {
          <div class="insight-box insight-box--strong" role="region" aria-label="Pontos fortes">
            <h3 class="insight-box__title">
              <lucide-icon [img]="icons.TrendingUp" [size]="18" aria-hidden="true"></lucide-icon>
              Pontos Fortes
            </h3>
            <ul class="insight-box__list">
              @for (cat of strongCategories(); track cat.category) {
                <li>
                  <lucide-icon [img]="icons.Star" [size]="13" aria-hidden="true"></lucide-icon>
                  {{ cat.label }} ({{ getCategoryPercent(cat.correct, cat.incorrect) }}%)
                </li>
              }
            </ul>
          </div>
        }
        @if (weakCategories().length > 0) {
          <div class="insight-box insight-box--weak" role="region" aria-label="Pontos fracos">
            <h3 class="insight-box__title">
              <lucide-icon [img]="icons.BookOpen" [size]="18" aria-hidden="true"></lucide-icon>
              Precisa Praticar
            </h3>
            <ul class="insight-box__list">
              @for (cat of weakCategories(); track cat.category) {
                <li>
                  <lucide-icon [img]="icons.TrendingDown" [size]="13" aria-hidden="true"></lucide-icon>
                  {{ cat.label }} ({{ getCategoryPercent(cat.correct, cat.incorrect) }}%)
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="dashboard__reset">
        <button class="btn-reset" (click)="resetar()" type="button">
          <lucide-icon [img]="icons.RotateCcw" [size]="15" aria-hidden="true"></lucide-icon>
          Resetar Progresso
        </button>
      </div>
    </section>
  } @else {
    <section class="empty-state" aria-label="Nenhuma atividade ainda">
      <lucide-icon [img]="icons.BarChart2" class="empty-state__icon" [size]="56" aria-hidden="true"></lucide-icon>
      <h2 class="empty-state__title">Comece agora!</h2>
      <p class="empty-state__desc">
        Seu dashboard aparecera aqui depois de responder perguntas ou resolver bugs.
      </p>
    </section>
  }
</section>
"@
[System.IO.File]::WriteAllText("$PSScriptRoot\src\app\pages\home\home.html", $home, $utf8NoBom)
Write-Host "home.html reescrito"

# ── quest.html ─────────────────────────────────────────────────────────────────
$quest = @"
<div class="quest">

  @if (state() === 'config') {
    <section class="quest__config" aria-labelledby="quest-title">
      <header class="quest__header">
        <a routerLink="/home" class="back-link" aria-label="Voltar para o inicio">
          <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
          Inicio
        </a>
        <h1 id="quest-title" class="quest__title">
          <lucide-icon [img]="icons.Target" [size]="28" aria-hidden="true"></lucide-icon>
          Quiz
        </h1>
        <p class="quest__subtitle">Responda perguntas sobre Angular e JavaScript</p>
      </header>

      <div class="config-card">
        <label for="categoria" class="config-card__label">
          <lucide-icon [img]="icons.Layers" [size]="16" aria-hidden="true"></lucide-icon>
          Escolha a categoria
        </label>
        <select
          id="categoria"
          class="config-card__select"
          (change)="setCategory(`$any(`$event.target).value)"
          aria-label="Selecionar categoria do quiz">
          @for (opt of categoryOptions; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>

        <p class="config-card__info">
          <lucide-icon [img]="icons.Info" [size]="14" aria-hidden="true"></lucide-icon>
          Serao selecionadas ate <strong>10 perguntas</strong> aleatorias da categoria escolhida.
        </p>

        <button class="btn-primary" (click)="startQuiz()" type="button">
          <lucide-icon [img]="icons.Play" [size]="16" aria-hidden="true"></lucide-icon>
          Iniciar Quiz
        </button>
      </div>
    </section>
  }

  @if (state() === 'playing') {
    @if (currentQuestion(); as q) {
      <section class="quest__playing" aria-labelledby="question-heading">
        <header class="quest__playing-header">
          <a routerLink="/home" class="back-link" aria-label="Voltar para o inicio">
            <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
            Inicio
          </a>
          <div class="quest__progress-info" aria-live="polite">
            <span class="quest__counter">{{ currentIndex() + 1 }} / {{ questions().length }}</span>
            <span class="quest__category-tag">{{ q.category }}</span>
          </div>
        </header>

        <div class="progress-bar" role="progressbar"
          [attr.aria-valuenow]="progress()"
          aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar__fill" [style.width.%]="progress()"></div>
        </div>

        <div class="question-card">
          <h2 id="question-heading" class="question-card__text">
            <lucide-icon [img]="icons.HelpCircle" [size]="20" class="question-card__icon" aria-hidden="true"></lucide-icon>
            {{ q.question }}
          </h2>

          <div class="options" role="radiogroup">
            @for (opt of q.options; track `$index) {
              <button
                class="option"
                [class]="getOptionClass(`$index)"
                (click)="selectOption(`$index)"
                [disabled]="showFeedback()"
                type="button"
                role="radio"
                [attr.aria-checked]="selectedOption() === `$index">
                <span class="option__letter" aria-hidden="true">{{ ['A', 'B', 'C', 'D'][`$index] }}</span>
                <span class="option__text">{{ opt }}</span>
                @if (showFeedback() && `$index === q.correctIndex) {
                  <lucide-icon [img]="icons.CheckCircle" class="option__icon" [size]="18" aria-hidden="true"></lucide-icon>
                }
                @if (showFeedback() && `$index === selectedOption() && `$index !== q.correctIndex) {
                  <lucide-icon [img]="icons.XCircle" class="option__icon" [size]="18" aria-hidden="true"></lucide-icon>
                }
              </button>
            }
          </div>

          @if (!showFeedback()) {
            <button
              class="btn-primary"
              (click)="confirmAnswer()"
              [disabled]="selectedOption() === null"
              type="button">
              <lucide-icon [img]="icons.Check" [size]="16" aria-hidden="true"></lucide-icon>
              Confirmar Resposta
            </button>
          }

          @if (showFeedback()) {
            <div class="feedback"
              [class.feedback--correct]="selectedOption() === q.correctIndex"
              [class.feedback--wrong]="selectedOption() !== q.correctIndex"
              role="alert">
              <p class="feedback__status">
                @if (selectedOption() === q.correctIndex) {
                  <lucide-icon [img]="icons.CheckCircle" [size]="18" aria-hidden="true"></lucide-icon>
                  Correto!
                } @else {
                  <lucide-icon [img]="icons.XCircle" [size]="18" aria-hidden="true"></lucide-icon>
                  Incorreto
                }
              </p>
              <p class="feedback__explanation">
                <lucide-icon [img]="icons.Info" [size]="14" aria-hidden="true"></lucide-icon>
                {{ q.explanation }}
              </p>
              <button class="btn-secondary" (click)="nextQuestion()" type="button">
                {{ isLast() ? 'Ver Resultado' : 'Proxima' }}
                <lucide-icon [img]="icons.ChevronRight" [size]="16" aria-hidden="true"></lucide-icon>
              </button>
            </div>
          }
        </div>
      </section>
    }
  }

  @if (state() === 'finished') {
    <section class="quest__result" aria-labelledby="result-heading">
      <header class="quest__header">
        <a routerLink="/home" class="back-link" aria-label="Voltar para o inicio">
          <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
          Inicio
        </a>
        <h1 id="result-heading" class="quest__title">
          <lucide-icon [img]="icons.Trophy" [size]="28" aria-hidden="true"></lucide-icon>
          Resultado
        </h1>
      </header>

      <div class="result-summary">
        <div class="result-summary__score">
          <span class="result-summary__percent">{{ finalAccuracy() }}%</span>
          <span class="result-summary__label">de acerto</span>
        </div>
        <p class="result-summary__message">{{ feedbackMessage() }}</p>
        <div class="result-summary__stats">
          <span class="result-summary__stat result-summary__stat--correct">
            <lucide-icon [img]="icons.CheckCircle" [size]="16" aria-hidden="true"></lucide-icon>
            {{ correctCount() }} corretas
          </span>
          <span class="result-summary__stat result-summary__stat--wrong">
            <lucide-icon [img]="icons.XCircle" [size]="16" aria-hidden="true"></lucide-icon>
            {{ incorrectCount() }} erradas
          </span>
        </div>
      </div>

      <div class="result-review">
        <h2 class="result-review__title">
          <lucide-icon [img]="icons.BookOpen" [size]="18" aria-hidden="true"></lucide-icon>
          Revisao das Perguntas
        </h2>
        @for (r of results(); track r.question.id) {
          <div class="review-item" [class.review-item--correct]="r.correct" [class.review-item--wrong]="!r.correct">
            <div class="review-item__header">
              @if (r.correct) {
                <lucide-icon [img]="icons.CheckCircle" [size]="16" aria-hidden="true"></lucide-icon>
              } @else {
                <lucide-icon [img]="icons.XCircle" [size]="16" aria-hidden="true"></lucide-icon>
              }
              <span class="review-item__category">{{ r.question.category }}</span>
            </div>
            <p class="review-item__question">{{ r.question.question }}</p>
            @if (!r.correct) {
              <p class="review-item__wrong-answer">
                <lucide-icon [img]="icons.X" [size]="13" aria-hidden="true"></lucide-icon>
                <strong>Sua resposta:</strong> {{ r.question.options[r.selected] }}
              </p>
              <p class="review-item__correct-answer">
                <lucide-icon [img]="icons.Check" [size]="13" aria-hidden="true"></lucide-icon>
                <strong>Correto:</strong> {{ r.question.options[r.question.correctIndex] }}
              </p>
            }
            <p class="review-item__explanation">
              <lucide-icon [img]="icons.Info" [size]="13" aria-hidden="true"></lucide-icon>
              {{ r.question.explanation }}
            </p>
          </div>
        }
      </div>

      <div class="result-actions">
        <button class="btn-primary" (click)="restart()" type="button">
          <lucide-icon [img]="icons.RefreshCw" [size]="16" aria-hidden="true"></lucide-icon>
          Jogar Novamente
        </button>
        <a routerLink="/home" class="btn-secondary">
          <lucide-icon [img]="icons.BarChart2" [size]="16" aria-hidden="true"></lucide-icon>
          Ver Dashboard
        </a>
      </div>
    </section>
  }

</div>
"@
[System.IO.File]::WriteAllText("$PSScriptRoot\src\app\pages\quest\quest.html", $quest, $utf8NoBom)
Write-Host "quest.html reescrito"

# ── bugs.html ──────────────────────────────────────────────────────────────────
$bugs = @"
<div class="bugs">

  @if (state() === 'list') {
    <section aria-labelledby="bugs-title">
      <header class="bugs__header">
        <a routerLink="/home" class="back-link" aria-label="Voltar para o inicio">
          <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
          Inicio
        </a>
        <h1 id="bugs-title" class="bugs__title">
          <lucide-icon [img]="icons.Bug" [size]="28" aria-hidden="true"></lucide-icon>
          Bug Hunt
        </h1>
        <p class="bugs__subtitle">Identifique e corrija os bugs nos trechos de codigo</p>
        <p class="bugs__progress" aria-live="polite">
          {{ totalCompleted() }} / {{ allChallenges.length }} concluidos nesta sessao
        </p>
      </header>

      @for (group of challengesByCategory(); track group.category) {
        <div class="category-group">
          <h2 class="category-group__title">{{ group.label }}</h2>
          <div class="challenge-list">
            @for (ch of group.challenges; track ch.id) {
              <button
                class="challenge-item"
                [class.challenge-item--done]="isCompleted(ch.id)"
                (click)="openChallenge(ch)"
                type="button"
                [attr.aria-label]="ch.title + (isCompleted(ch.id) ? ' - concluido' : '')">
                <div class="challenge-item__left">
                  <span class="challenge-item__icon" aria-hidden="true">
                    @if (isCompleted(ch.id)) {
                      <lucide-icon [img]="icons.CheckCircle" [size]="18"></lucide-icon>
                    } @else {
                      <lucide-icon [img]="icons.HelpCircle" [size]="18"></lucide-icon>
                    }
                  </span>
                  <div>
                    <p class="challenge-item__title">{{ ch.title }}</p>
                    <p class="challenge-item__desc">{{ ch.description }}</p>
                  </div>
                </div>
                <lucide-icon [img]="icons.ChevronRight" [size]="18" class="challenge-item__arrow" aria-hidden="true"></lucide-icon>
              </button>
            }
          </div>
        </div>
      }
    </section>
  }

  @if (state() === 'playing' || state() === 'revealed') {
    @if (currentChallenge(); as ch) {
      <section aria-labelledby="challenge-heading">
        <header class="bugs__playing-header">
          <button class="back-link" (click)="backToList()" type="button" aria-label="Voltar para a lista">
            <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
            Lista
          </button>
          <span class="quest__category-tag">{{ categoryLabels[ch.category] }}</span>
        </header>

        <div class="challenge-card">
          <h2 id="challenge-heading" class="challenge-card__title">{{ ch.title }}</h2>
          <p class="challenge-card__desc">{{ ch.description }}</p>

          <div class="code-section">
            <div class="code-section__header">
              <span class="code-section__label">
                <lucide-icon [img]="icons.Bug" [size]="14" aria-hidden="true"></lucide-icon>
                Codigo com Bug
              </span>
            </div>
            <pre class="code-block code-block--buggy" role="region" aria-label="Codigo com bug"><code>{{ ch.buggyCode }}</code></pre>
          </div>

          @if (state() === 'playing') {
            <details class="hint-box">
              <summary class="hint-box__summary">
                <lucide-icon [img]="icons.Lightbulb" [size]="14" aria-hidden="true"></lucide-icon>
                Ver dica
              </summary>
              <p class="hint-box__text">{{ ch.hint }}</p>
            </details>

            <div class="answer-section">
              <label for="user-answer" class="answer-section__label">
                Descreva o bug que voce encontrou (ou escreva o codigo corrigido):
              </label>
              <textarea
                id="user-answer"
                class="answer-section__textarea"
                [value]="userAnswer()"
                (input)="updateAnswer(`$any(`$event.target).value)"
                rows="6"
                placeholder="Digite aqui sua analise do bug e/ou o codigo correto..."
                aria-required="true"></textarea>
            </div>

            <button
              class="btn-primary"
              (click)="revealSolution()"
              type="button"
              [disabled]="userAnswer().trim().length === 0">
              <lucide-icon [img]="icons.Eye" [size]="16" aria-hidden="true"></lucide-icon>
              Revelar Solucao
            </button>
          }

          @if (state() === 'revealed') {
            <div class="code-section">
              <div class="code-section__header">
                <span class="code-section__label code-section__label--fixed">
                  <lucide-icon [img]="icons.CheckCircle" [size]="14" aria-hidden="true"></lucide-icon>
                  Codigo Correto
                </span>
              </div>
              <pre class="code-block code-block--fixed" role="region" aria-label="Codigo correto"><code>{{ ch.fixedCode }}</code></pre>
            </div>

            <div class="bug-explanation" role="region" aria-label="Explicacao do bug">
              <h3 class="bug-explanation__title">
                <lucide-icon [img]="icons.Eye" [size]="16" aria-hidden="true"></lucide-icon>
                Qual era o Bug?
              </h3>
              <p class="bug-explanation__text">{{ ch.bugDescription }}</p>
            </div>

            @if (userAnswer().trim().length > 0) {
              <div class="your-answer" role="region" aria-label="Sua resposta">
                <h3 class="your-answer__title">Sua Resposta</h3>
                <pre class="your-answer__text">{{ userAnswer() }}</pre>
              </div>
            }

            @if (selfEvalResult() === null) {
              <div class="self-eval" role="region" aria-label="Autoavaliacao">
                <p class="self-eval__question">Voce conseguiu identificar o bug corretamente?</p>
                <div class="self-eval__buttons">
                  <button class="btn-correct" (click)="markResult(true)" type="button">
                    <lucide-icon [img]="icons.ThumbsUp" [size]="16" aria-hidden="true"></lucide-icon>
                    Acertei
                  </button>
                  <button class="btn-wrong" (click)="markResult(false)" type="button">
                    <lucide-icon [img]="icons.ThumbsDown" [size]="16" aria-hidden="true"></lucide-icon>
                    Errei
                  </button>
                </div>
              </div>
            } @else {
              <div class="self-eval-result"
                [class.self-eval-result--correct]="selfEvalResult()"
                [class.self-eval-result--wrong]="!selfEvalResult()"
                role="alert">
                @if (selfEvalResult()) {
                  <lucide-icon [img]="icons.Star" [size]="18" aria-hidden="true"></lucide-icon>
                  <p>Otimo trabalho! Bug identificado com sucesso!</p>
                } @else {
                  <lucide-icon [img]="icons.BookOpen" [size]="18" aria-hidden="true"></lucide-icon>
                  <p>Nao tem problema! Revise a explicacao e tente mais.</p>
                }
              </div>

              <div class="challenge-actions">
                <button class="btn-secondary" (click)="backToList()" type="button">
                  <lucide-icon [img]="icons.ArrowLeft" [size]="16" aria-hidden="true"></lucide-icon>
                  Voltar para a Lista
                </button>
              </div>
            }
          }
        </div>
      </section>
    }
  }

</div>
"@
[System.IO.File]::WriteAllText("$PSScriptRoot\src\app\pages\bugs\bugs.html", $bugs, $utf8NoBom)
Write-Host "bugs.html reescrito"

# ── app.html ───────────────────────────────────────────────────────────────────
$app = @"
<nav class="navbar" aria-label="Navegacao principal">
  <div class="navbar__inner">
    <a routerLink="/home" class="navbar__brand" aria-label="Desafios Angular - Pagina inicial">
      <lucide-icon [img]="icons.Zap" [size]="20" class="navbar__brand-icon" aria-hidden="true"></lucide-icon>
      <span class="navbar__brand-text">Desafios Angular</span>
    </a>

    <ul class="navbar__links" role="list">
      <li>
        <a routerLink="/home" routerLinkActive="navbar__link--active" class="navbar__link" aria-label="Dashboard">
          <lucide-icon [img]="icons.LayoutDashboard" [size]="16" aria-hidden="true"></lucide-icon>
          Dashboard
        </a>
      </li>
      <li>
        <a routerLink="/quest" routerLinkActive="navbar__link--active" class="navbar__link navbar__link--quiz" aria-label="Quiz de perguntas">
          <lucide-icon [img]="icons.Target" [size]="16" aria-hidden="true"></lucide-icon>
          Quiz
        </a>
      </li>
      <li>
        <a routerLink="/bugs" routerLinkActive="navbar__link--active" class="navbar__link navbar__link--bugs" aria-label="Desafios de bugs">
          <lucide-icon [img]="icons.Bug" [size]="16" aria-hidden="true"></lucide-icon>
          Bug Hunt
        </a>
      </li>
    </ul>
  </div>
</nav>

<main class="main-content" id="main-content">
  <router-outlet />
</main>
"@
[System.IO.File]::WriteAllText("$PSScriptRoot\src\app\app.html", $app, $utf8NoBom)
Write-Host "app.html reescrito"

Write-Host "Todos os arquivos corrigidos com sucesso!"
