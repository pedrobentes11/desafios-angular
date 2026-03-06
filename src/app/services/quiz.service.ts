import { Injectable } from '@angular/core';
import { QuizQuestion } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly questions: QuizQuestion[] = [
    // ─── PROMISES ──────────────────────────────────────────────
    {
      id: 1,
      category: 'promises',
      question: 'O que uma Promise representa em JavaScript?',
      options: [
        'Um valor já disponível imediatamente',
        'Um valor que pode estar disponível agora, no futuro ou nunca',
        'Uma função assíncrona que sempre resolve',
        'Um objeto imutável de configuração',
      ],
      correctIndex: 1,
      explanation:
        'Uma Promise representa um valor eventual. Ela pode estar pendente (pending), resolvida (fulfilled) ou rejeitada (rejected).',
    },
    {
      id: 2,
      category: 'promises',
      question: 'Qual é o estado inicial de uma Promise?',
      options: ['fulfilled', 'rejected', 'pending', 'settled'],
      correctIndex: 2,
      explanation:
        'Toda Promise começa no estado "pending" (pendente). Ela muda para "fulfilled" ao resolver ou "rejected" ao ser rejeitada.',
    },
    {
      id: 3,
      category: 'promises',
      question: 'O que acontece quando você chama `.catch()` em uma Promise?',
      options: [
        'Interrompe a execução da Promise',
        'Trata erros de rejeição e retorna uma nova Promise',
        'Cancela a Promise em andamento',
        'Converte a Promise em um Observable',
      ],
      correctIndex: 1,
      explanation:
        '`.catch(fn)` é equivalente a `.then(undefined, fn)`. Ele trata rejeições e retorna uma nova Promise.',
    },
    {
      id: 4,
      category: 'promises',
      question: 'Qual método executa múltiplas Promises em paralelo e falha imediatamente se qualquer uma rejeitar?',
      options: ['Promise.race()', 'Promise.allSettled()', 'Promise.any()', 'Promise.all()'],
      correctIndex: 3,
      explanation:
        '`Promise.all()` executa em paralelo e rejeita imediatamente (fail-fast) se qualquer Promise rejeitar.',
    },
    {
      id: 5,
      category: 'promises',
      question: 'O que `Promise.allSettled()` faz de diferente em relação ao `Promise.all()`?',
      options: [
        'Executa as Promises em sequência',
        'Aguarda todas terminarem, independente de sucesso ou falha',
        'Retorna apenas a primeira Promise que resolver',
        'Cancela as demais Promises quando uma rejeitar',
      ],
      correctIndex: 1,
      explanation:
        '`Promise.allSettled()` aguarda todas as Promises terminarem e retorna um array com o status de cada uma, sem rejeitar imediatamente.',
    },
    {
      id: 6,
      category: 'promises',
      question: 'Ao usar `async/await`, o que acontece se uma função `async` lança uma exceção?',
      options: [
        'A aplicação trava',
        'A exceção é ignorada silenciosamente',
        'A Promise retornada pela função é rejeitada com esse erro',
        'O valor retornado vira undefined',
      ],
      correctIndex: 2,
      explanation:
        'Uma função `async` sempre retorna uma Promise. Se ela lança uma exceção, a Promise é rejeitada com esse erro.',
    },
    {
      id: 7,
      category: 'promises',
      question: 'Qual é a diferença entre `.then(resolve, reject)` e `.then(resolve).catch(reject)`?',
      options: [
        'São completamente idênticos',
        'No primeiro, `reject` não captura erros lançados dentro de `resolve`; no segundo, sim',
        'O segundo não captura rejeições da Promise original',
        'O primeiro é mais performático',
      ],
      correctIndex: 1,
      explanation:
        'Com `.then(res, rej)`, se `res` lançar um erro, `rej` NÃO o captura. Com `.then(res).catch(rej)`, `catch` captura erros tanto da Promise original quanto de `res`.',
    },
    {
      id: 8,
      category: 'promises',
      question: 'O que `Promise.race()` retorna?',
      options: [
        'Um array com todas as Promises resolvidas',
        'A Promise que levou mais tempo para resolver',
        'Uma Promise que resolve/rejeita com o valor da primeira a terminar',
        'Sempre uma Promise resolvida',
      ],
      correctIndex: 2,
      explanation:
        '`Promise.race()` retorna uma Promise que adota o estado (resolvida ou rejeitada) da primeira Promise que terminar.',
    },

    // ─── DATA BINDING ──────────────────────────────────────────
    {
      id: 9,
      category: 'data-binding',
      question: 'Qual sintaxe é usada para Property Binding em Angular?',
      options: ['{{ property }}', '(property)', '[property]', '#property'],
      correctIndex: 2,
      explanation:
        'Property Binding usa colchetes `[property]="value"` para vincular uma propriedade do DOM/componente a uma expressão do componente.',
    },
    {
      id: 10,
      category: 'data-binding',
      question: 'Qual sintaxe é usada para Event Binding em Angular?',
      options: ['[event]', '{{event}}', '(event)', '*event'],
      correctIndex: 2,
      explanation:
        'Event Binding usa parênteses `(event)="handler()"` para escutar eventos do DOM e chamar métodos do componente.',
    },
    {
      id: 11,
      category: 'data-binding',
      question: 'O que é Two-Way Data Binding e qual diretiva Angular o implementa?',
      options: [
        'Sincronização de dados entre serviços; implementado por `RouterLink`',
        'Sincronização bidirecional entre template e componente; implementado por `[(ngModel)]`',
        'Compartilhamento de estado entre componentes; implementado por `@Input`',
        'Vinculação de atributos HTML; implementado por `[attr.name]`',
      ],
      correctIndex: 1,
      explanation:
        '`[(ngModel)]` (banana-in-a-box) implementa two-way binding: lê o valor do componente e atualiza quando o usuário interage.',
    },
    {
      id: 12,
      category: 'data-binding',
      question: 'Qual é a diferença entre `[attr.disabled]` e `[disabled]` em Angular?',
      options: [
        'São equivalentes em todos os casos',
        '`[attr.disabled]` vincula o atributo HTML; `[disabled]` vincula a propriedade DOM',
        '`[disabled]` vincula o atributo HTML; `[attr.disabled]` vincula a propriedade DOM',
        'Apenas `[attr.disabled]` funciona com elementos nativos',
      ],
      correctIndex: 1,
      explanation:
        '`[attr.disabled]` manipula o atributo HTML (string ou null). `[disabled]` manipula a propriedade DOM (boolean). Para elementos nativos, `[disabled]` é preferível.',
    },
    {
      id: 13,
      category: 'data-binding',
      question: 'Como passar um objeto inteiro para um componente filho via Property Binding?',
      options: [
        'Não é possível; apenas primitivos podem ser passados',
        '`[dados]="meuObjeto"` — o objeto é passado por referência',
        '`dados="{{ meuObjeto }}"` — serializa automaticamente',
        '`(dados)="meuObjeto"` — via event binding',
      ],
      correctIndex: 1,
      explanation:
        'Property Binding `[dados]="meuObjeto"` passa o objeto por referência. Mutations no filho afetam o pai, por isso prefira imutabilidade.',
    },
    {
      id: 14,
      category: 'data-binding',
      question: 'No Angular moderno, como declarar um `@Input()` usando a função `input()`?',
      options: [
        '@Input() titulo: string = ""',
        "titulo = input<string>('')",
        'input titulo: string',
        'readonly titulo = @Input()',
      ],
      correctIndex: 1,
      explanation:
        "Com signals, usa-se `titulo = input<string>('')` ou `input.required<string>()`. Isso cria um InputSignal que pode ser lido como signal.",
    },
    {
      id: 15,
      category: 'data-binding',
      question: 'Como emitir um evento de um componente filho para o pai com a função `output()`?',
      options: [
        '@Output() clicou = new EventEmitter<void>()',
        'clicou = output<void>()',
        'output clicou: EventEmitter<void>',
        'emit clicou = output()',
      ],
      correctIndex: 1,
      explanation:
        '`clicou = output<void>()` cria um OutputEmitterRef. Para emitir, chama-se `this.clicou.emit()`. É a forma moderna sem decorators.',
    },
    {
      id: 16,
      category: 'data-binding',
      question: 'O que `{{ usuario?.nome }}` faz no template Angular?',
      options: [
        'Lança um erro se `usuario` for null',
        'Usa optional chaining para evitar erro se `usuario` for null/undefined',
        'É uma sintaxe inválida em templates Angular',
        'Converte `nome` para string automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'O operador `?.` (optional chaining) no template evita erros caso `usuario` seja null ou undefined, exibindo string vazia.',
    },

    // ─── HTTP ──────────────────────────────────────────────────
    {
      id: 17,
      category: 'http',
      question: 'Qual método HTTP deve ser usado para criar um novo recurso no servidor?',
      options: ['GET', 'PUT', 'POST', 'PATCH'],
      correctIndex: 2,
      explanation:
        'POST é usado para criar recursos. GET lê, PUT substitui completamente, PATCH atualiza parcialmente, DELETE remove.',
    },
    {
      id: 18,
      category: 'http',
      question: 'Qual é a diferença entre PUT e PATCH?',
      options: [
        'PUT é mais rápido que PATCH',
        'PUT substitui o recurso inteiro; PATCH atualiza apenas os campos enviados',
        'PATCH cria um recurso; PUT atualiza',
        'São sinônimos no protocolo HTTP',
      ],
      correctIndex: 1,
      explanation:
        'PUT é idempotente e substitui o recurso inteiro. PATCH é uma atualização parcial, enviando apenas os campos que mudaram.',
    },
    {
      id: 19,
      category: 'http',
      question: 'O que significa um status code HTTP 401?',
      options: ['Não encontrado', 'Servidor indisponível', 'Não autorizado (falta autenticação)', 'Proibido (sem permissão)'],
      correctIndex: 2,
      explanation:
        '401 (Unauthorized) indica que a requisição requer autenticação. 403 (Forbidden) significa autenticado mas sem permissão.',
    },
    {
      id: 20,
      category: 'http',
      question: 'O que é CORS e quando ele é necessário?',
      options: [
        'Um método de compressão HTTP; sempre necessário',
        'Um mecanismo de segurança do browser para requisições entre origens diferentes',
        'Um header de cache do servidor',
        'Um protocolo alternativo ao HTTP',
      ],
      correctIndex: 1,
      explanation:
        'CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança. O browser bloqueia requisições para domínios/portas diferentes sem os headers CORS adequados no servidor.',
    },
    {
      id: 21,
      category: 'http',
      question: 'O que é uma requisição HTTP idempotente?',
      options: [
        'Uma requisição que nunca falha',
        'Uma requisição que pode ser repetida múltiplas vezes com o mesmo efeito',
        'Uma requisição criptografada',
        'Uma requisição sem body',
      ],
      correctIndex: 1,
      explanation:
        'Idempotente significa que múltiplas requisições idênticas têm o mesmo efeito que uma única. GET, PUT, DELETE são idempotentes. POST não é.',
    },
    {
      id: 22,
      category: 'http',
      question: 'Qual header HTTP é usado para enviar um token JWT na requisição?',
      options: [
        'Content-Type: Bearer <token>',
        'X-Auth-Token: <token>',
        'Authorization: Bearer <token>',
        'Token: JWT <token>',
      ],
      correctIndex: 2,
      explanation:
        'O padrão é usar o header `Authorization: Bearer <token>`. O prefixo "Bearer" indica o esquema de autenticação.',
    },

    // ─── HTTPCLIENT ────────────────────────────────────────────
    {
      id: 23,
      category: 'httpclient',
      question: 'Como configurar o `HttpClient` em um app Angular standalone?',
      options: [
        'Importar `HttpClientModule` no `imports` do componente',
        'Adicionar `provideHttpClient()` no array `providers` do `appConfig`',
        'Injetar `HttpClient` diretamente sem configuração',
        'Usar `forRoot()` no `AppModule`',
      ],
      correctIndex: 1,
      explanation:
        'Em apps standalone, usa-se `provideHttpClient()` no `app.config.ts`. O `HttpClientModule` é legacy (baseado em NgModules).',
    },
    {
      id: 24,
      category: 'httpclient',
      question: 'O que `HttpClient.get<T>()` retorna?',
      options: ['Uma Promise<T>', 'Um Observable<T>', 'Um Signal<T>', 'Um array T[]'],
      correctIndex: 1,
      explanation:
        '`HttpClient` é baseado em RxJS e retorna Observables. Para usar como Promise, pode-se usar `firstValueFrom()` do RxJS.',
    },
    {
      id: 25,
      category: 'httpclient',
      question: 'O que acontece se você não fizer subscribe em um Observable do HttpClient?',
      options: [
        'A requisição HTTP é enviada mesmo assim',
        'A requisição HTTP não é enviada; Observables são lazy',
        'Gera um erro de compilação TypeScript',
        'O Angular faz o subscribe automaticamente',
      ],
      correctIndex: 1,
      explanation:
        'Observables são lazy: a requisição HTTP só é enviada quando alguém faz subscribe. Sem subscribe, nada acontece.',
    },
    {
      id: 26,
      category: 'httpclient',
      question: 'Como adicionar headers customizados em uma requisição com HttpClient?',
      options: [
        "http.get(url, { header: { Authorization: 'Bearer token' } })",
        "http.get(url, { headers: new HttpHeaders({ Authorization: 'Bearer token' }) })",
        "http.get(url).setHeader('Authorization', 'Bearer token')",
        "http.get(url, { auth: 'Bearer token' })",
      ],
      correctIndex: 1,
      explanation:
        'O segundo argumento do método aceita um objeto de opções com `headers: new HttpHeaders({...})` ou `headers: { key: value }`.',
    },
    {
      id: 27,
      category: 'httpclient',
      question: 'Para que serve um `HttpInterceptor`?',
      options: [
        'Para cancelar requisições HTTP em andamento',
        'Para interceptar e modificar requisições/respostas HTTP globalmente',
        'Para comprimir o body das requisições',
        'Para transformar Observables em Promises',
      ],
      correctIndex: 1,
      explanation:
        'Interceptors permitem adicionar lógica global: adicionar tokens de autenticação, logar erros, mostrar loading spinner, transformar respostas, etc.',
    },
    {
      id: 28,
      category: 'httpclient',
      question: 'Como passar query params em uma requisição com HttpClient?',
      options: [
        'Concatenando strings na URL manualmente',
        "http.get(url, { params: new HttpParams().set('key', 'value') })",
        "http.get(url, { query: { key: 'value' } })",
        "http.get(url + '?key=value', { encodeParams: true })",
      ],
      correctIndex: 1,
      explanation:
        'Usa-se a opção `params` com `HttpParams` ou um objeto literal `{ params: { key: value } }`. Isso evita bugs de encoding manual.',
    },
    {
      id: 29,
      category: 'httpclient',
      question: 'Como tratar erros de requisição HTTP com HttpClient e RxJS?',
      options: [
        'Usando try/catch dentro do subscribe',
        'Usando o operador `catchError` do RxJS no pipe do Observable',
        'Passando um segundo argumento de callback para `.get()`',
        'Usando `Promise.catch()` após converter',
      ],
      correctIndex: 1,
      explanation:
        '`catchError` do RxJS é usado no pipe: `http.get(url).pipe(catchError(err => { ... }))`. Permite retornar valor padrão ou relançar o erro.',
    },
    {
      id: 30,
      category: 'httpclient',
      question: 'O que `withInterceptorsFromDi()` faz ao configurar `provideHttpClient()`?',
      options: [
        'Desabilita todos os interceptors',
        'Habilita interceptors fornecidos via injeção de dependência (provide/useClass)',
        'Configura o timeout das requisições',
        'Ativa a compressão automática de responses',
      ],
      correctIndex: 1,
      explanation:
        '`withInterceptorsFromDi()` permite usar interceptors registrados via `{ provide: HTTP_INTERCEPTORS, useClass: ... }` no provideHttpClient().',
    },
  ];

  getAll(): QuizQuestion[] {
    return this.questions;
  }

  getByCategory(category: string): QuizQuestion[] {
    return this.questions.filter((q) => q.category === category);
  }

  getRandom(count = 10): QuizQuestion[] {
    const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
