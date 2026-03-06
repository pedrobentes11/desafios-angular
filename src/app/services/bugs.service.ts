import { Injectable } from '@angular/core';
import { BugChallenge } from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class BugsService {
  private readonly challenges: BugChallenge[] = [
    // ─── PROMISES ──────────────────────────────────────────────
    {
      id: 1,
      category: 'promises',
      title: 'Promise não tratada',
      description: 'Este código tenta buscar dados de uma API mas tem um bug. Identifique o problema.',
      buggyCode: `function buscarUsuario(id: number) {
  fetch(\`/api/usuarios/\${id}\`)
    .then(response => response.json())
    .then(data => {
      console.log('Usuário:', data);
    });
}

buscarUsuario(1);`,
      fixedCode: `function buscarUsuario(id: number) {
  fetch(\`/api/usuarios/\${id}\`)
    .then(response => response.json())
    .then(data => {
      console.log('Usuário:', data);
    })
    .catch(error => {
      console.error('Erro ao buscar usuário:', error);
    });
}

buscarUsuario(1);`,
      hint: 'O que acontece se a requisição falhar?',
      bugDescription: 'Falta o `.catch()` para tratar erros de rede ou da API. Promises não tratadas podem causar crashes silenciosos.',
    },
    {
      id: 2,
      category: 'promises',
      title: 'async/await sem try/catch',
      description: 'Função assíncrona que salva dados no servidor. Encontre o bug.',
      buggyCode: `async function salvarPedido(pedido: Pedido): Promise<void> {
  const response = await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  const resultado = await response.json();
  console.log('Pedido salvo:', resultado);
}`,
      fixedCode: `async function salvarPedido(pedido: Pedido): Promise<void> {
  try {
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    });
    if (!response.ok) {
      throw new Error(\`Erro HTTP: \${response.status}\`);
    }
    const resultado = await response.json();
    console.log('Pedido salvo:', resultado);
  } catch (error) {
    console.error('Falha ao salvar pedido:', error);
  }
}`,
      hint: 'Async/await precisa de tratamento de erro explícito. E verifique o status HTTP.',
      bugDescription: 'Falta try/catch para capturar erros e verificação de `response.ok`. Um status 4xx/5xx não rejeita a Promise do fetch.',
    },
    {
      id: 3,
      category: 'promises',
      title: 'Promise.all mal utilizado',
      description: 'Código que carrega múltiplos dados em paralelo. O que está errado?',
      buggyCode: `async function carregarDashboard(userId: number) {
  const perfil = await fetch(\`/api/perfil/\${userId}\`).then(r => r.json());
  const pedidos = await fetch(\`/api/pedidos/\${userId}\`).then(r => r.json());
  const notificacoes = await fetch(\`/api/notificacoes/\${userId}\`).then(r => r.json());

  return { perfil, pedidos, notificacoes };
}`,
      fixedCode: `async function carregarDashboard(userId: number) {
  const [perfil, pedidos, notificacoes] = await Promise.all([
    fetch(\`/api/perfil/\${userId}\`).then(r => r.json()),
    fetch(\`/api/pedidos/\${userId}\`).then(r => r.json()),
    fetch(\`/api/notificacoes/\${userId}\`).then(r => r.json()),
  ]);

  return { perfil, pedidos, notificacoes };
}`,
      hint: 'As três requisições são independentes entre si. Estão sendo executadas da forma mais eficiente?',
      bugDescription: 'Usar await sequencial força as requisições a esperarem uma pela outra. `Promise.all()` executa em paralelo, reduzindo o tempo total.',
    },
    {
      id: 4,
      category: 'promises',
      title: 'Esqueceu o return na chain',
      description: 'Esta Promise chain deveria transformar dados, mas retorna undefined. Ache o bug.',
      buggyCode: `function processarDados(id: number): Promise<string> {
  return fetch(\`/api/dados/\${id}\`)
    .then(response => {
      response.json();
    })
    .then(data => {
      return data.nome.toUpperCase();
    });
}`,
      fixedCode: `function processarDados(id: number): Promise<string> {
  return fetch(\`/api/dados/\${id}\`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data.nome.toUpperCase();
    });
}`,
      hint: 'Cada `.then()` precisa retornar o valor para o próximo da cadeia.',
      bugDescription: 'Falta `return` em `response.json()`. Sem o return, o `.then()` seguinte recebe `undefined` como `data`.',
    },

    // ─── DATA BINDING ──────────────────────────────────────────
    {
      id: 5,
      category: 'data-binding',
      title: 'Property Binding com interpolação',
      description: 'Este template Angular deveria vincular a URL de uma imagem. O que está errado?',
      buggyCode: `@Component({
  template: \`
    <img src="{{ imagemUrl }}" alt="Avatar do usuário">
    <button disabled="{{ isDesabilitado }}">Enviar</button>
  \`
})
export class MeuComponent {
  imagemUrl = 'https://exemplo.com/foto.jpg';
  isDesabilitado = true;
}`,
      fixedCode: `@Component({
  template: \`
    <img [src]="imagemUrl" alt="Avatar do usuário">
    <button [disabled]="isDesabilitado">Enviar</button>
  \`
})
export class MeuComponent {
  imagemUrl = 'https://exemplo.com/foto.jpg';
  isDesabilitado = true;
}`,
      hint: 'Para atributos como `src` e `disabled`, qual é a forma correta de binding?',
      bugDescription: 'Usar `{{ }}` em `src` pode causar uma requisição com URL literal "{{ imagemUrl }}" antes do Angular processar. `disabled="{{ true }}"` define o atributo como string, não boolean. Use `[src]` e `[disabled]`.',
    },
    {
      id: 6,
      category: 'data-binding',
      title: 'Event Binding com parênteses errados',
      description: 'O botão deveria chamar o método ao ser clicado, mas não funciona. Ache o bug.',
      buggyCode: `@Component({
  template: \`
    <button [click]="salvar()">Salvar</button>
    <input [keyup.enter]="buscar($event)">
  \`
})
export class FormComponent {
  salvar() { console.log('Salvando...'); }
  buscar(event: Event) { console.log(event); }
}`,
      fixedCode: `@Component({
  template: \`
    <button (click)="salvar()">Salvar</button>
    <input (keyup.enter)="buscar($event)">
  \`
})
export class FormComponent {
  salvar() { console.log('Salvando...'); }
  buscar(event: Event) { console.log(event); }
}`,
      hint: 'Property Binding usa `[ ]`, Event Binding usa `( )`. Qual deve ser usado aqui?',
      bugDescription: '`[click]` tenta fazer Property Binding em uma propriedade chamada "click", que não existe. Event Binding exige parênteses `(click)`.',
    },
    {
      id: 7,
      category: 'data-binding',
      title: 'Output sem emit',
      description: 'O componente filho deveria emitir um evento ao clicar, mas o pai nunca recebe. Ache o bug.',
      buggyCode: `// Componente Filho
@Component({
  template: \`<button (click)="aoClicar()">Clique aqui</button>\`
})
export class FilhoComponent {
  clicou = output<string>();

  aoClicar() {
    const mensagem = 'Botão clicado!';
    this.clicou(mensagem); // emitindo o evento
  }
}`,
      fixedCode: `// Componente Filho
@Component({
  template: \`<button (click)="aoClicar()">Clique aqui</button>\`
})
export class FilhoComponent {
  clicou = output<string>();

  aoClicar() {
    const mensagem = 'Botão clicado!';
    this.clicou.emit(mensagem); // forma correta
  }
}`,
      hint: 'Como se emite um evento com a função `output()` do Angular?',
      bugDescription: '`output()` retorna um `OutputEmitterRef`. Para emitir, deve-se chamar `.emit()` nele, não invocar diretamente como função.',
    },
    {
      id: 8,
      category: 'data-binding',
      title: 'Input signal não lido corretamente',
      description: 'O componente recebe um input mas o template não exibe o valor. Ache o bug.',
      buggyCode: `@Component({
  template: \`<h1>Olá, {{ nome }}</h1>\`
})
export class SaudacaoComponent {
  nome = input<string>('Visitante');
}`,
      fixedCode: `@Component({
  template: \`<h1>Olá, {{ nome() }}</h1>\`
})
export class SaudacaoComponent {
  nome = input<string>('Visitante');
}`,
      hint: '`input()` retorna um Signal. Como se lê o valor de um Signal no template?',
      bugDescription: '`input()` cria um InputSignal. Para ler o valor, é necessário invocar o signal como função: `nome()`. Sem os parênteses, exibe o objeto Signal, não o valor.',
    },

    // ─── HTTP ──────────────────────────────────────────────────
    {
      id: 9,
      category: 'http',
      title: 'Método HTTP errado para atualização parcial',
      description: 'Esta função deveria atualizar apenas o email de um usuário. Encontre o problema.',
      buggyCode: `async function atualizarEmail(userId: number, novoEmail: string) {
  const response = await fetch(\`/api/usuarios/\${userId}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: novoEmail }),
  });
  return response.json();
}`,
      fixedCode: `async function atualizarEmail(userId: number, novoEmail: string) {
  const response = await fetch(\`/api/usuarios/\${userId}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: novoEmail }),
  });
  return response.json();
}`,
      hint: 'Qual método HTTP é semanticamente correto para atualizações parciais de um recurso existente?',
      bugDescription: 'POST cria novos recursos. Para atualizar parcialmente um recurso existente, use PATCH. PUT substituiria o recurso inteiro.',
    },
    {
      id: 10,
      category: 'http',
      title: 'Header Content-Type ausente',
      description: 'A API rejeita os dados enviados. O que está faltando na requisição?',
      buggyCode: `async function criarProduto(produto: Produto) {
  const response = await fetch('/api/produtos', {
    method: 'POST',
    body: JSON.stringify(produto),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar produto');
  }

  return response.json();
}`,
      fixedCode: `async function criarProduto(produto: Produto) {
  const response = await fetch('/api/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar produto');
  }

  return response.json();
}`,
      hint: 'O servidor precisa saber o formato dos dados enviados no body.',
      bugDescription: 'Falta o header `Content-Type: application/json`. Sem ele, o servidor não sabe interpretar o body como JSON.',
    },

    // ─── HTTPCLIENT ────────────────────────────────────────────
    {
      id: 11,
      category: 'httpclient',
      title: 'HttpClient sem subscribe',
      description: 'Este serviço Angular deveria buscar usuários, mas nenhuma requisição é enviada. Encontre o bug.',
      buggyCode: `@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  carregarUsuarios(): void {
    this.http.get<Usuario[]>('/api/usuarios');
    console.log('Requisição enviada!');
  }
}`,
      fixedCode: `@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);

  carregarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>('/api/usuarios');
  }
}

// No componente, fazer subscribe:
// this.usuarioService.carregarUsuarios().subscribe(usuarios => { ... });`,
      hint: 'Observables são lazy. O que precisa acontecer para que a requisição seja enviada?',
      bugDescription: 'Sem `.subscribe()`, o Observable do HttpClient nunca executa a requisição. Além disso, o console.log executa imediatamente, antes de qualquer resposta.',
    },
    {
      id: 12,
      category: 'httpclient',
      title: 'HttpClient não configurado',
      description: 'O app tenta usar HttpClient mas gera erro na inicialização. Ache o problema.',
      buggyCode: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // HttpClient pronto para uso
  ],
};`,
      fixedCode: `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};`,
      hint: 'Para usar `HttpClient` em apps standalone, o que precisa ser adicionado nos providers?',
      bugDescription: 'Falta `provideHttpClient()` no array de providers. Sem isso, injetar `HttpClient` resulta em erro de injeção de dependência.',
    },
    {
      id: 13,
      category: 'httpclient',
      title: 'Erro não tratado no HttpClient',
      description: 'Este componente busca dados mas não trata erros. Como deveria ser feito com RxJS?',
      buggyCode: `@Component({ /* ... */ })
export class ProdutosComponent {
  private http = inject(HttpClient);
  produtos = signal<Produto[]>([]);

  ngOnInit() {
    this.http.get<Produto[]>('/api/produtos')
      .subscribe(lista => {
        this.produtos.set(lista);
      });
  }
}`,
      fixedCode: `@Component({ /* ... */ })
export class ProdutosComponent {
  private http = inject(HttpClient);
  produtos = signal<Produto[]>([]);
  erro = signal<string | null>(null);

  ngOnInit() {
    this.http.get<Produto[]>('/api/produtos')
      .pipe(
        catchError(err => {
          this.erro.set('Falha ao carregar produtos.');
          console.error(err);
          return of([]);
        })
      )
      .subscribe(lista => {
        this.produtos.set(lista);
      });
  }
}`,
      hint: 'Como se tratam erros em Observables com RxJS no Angular?',
      bugDescription: 'Sem tratamento de erro, falhas na requisição causam erros não capturados. Use o operador `catchError` no pipe para interceptar e tratar erros graciosamente.',
    },
    {
      id: 14,
      category: 'httpclient',
      title: 'Query params na URL manualmente',
      description: 'Este código monta query params na mão. Qual é o problema e como melhorar?',
      buggyCode: `@Injectable({ providedIn: 'root' })
export class BuscaService {
  private http = inject(HttpClient);

  buscar(termo: string, pagina: number): Observable<Resultado[]> {
    const url = \`/api/busca?q=\${termo}&pagina=\${pagina}&ativo=true\`;
    return this.http.get<Resultado[]>(url);
  }
}`,
      fixedCode: `@Injectable({ providedIn: 'root' })
export class BuscaService {
  private http = inject(HttpClient);

  buscar(termo: string, pagina: number): Observable<Resultado[]> {
    return this.http.get<Resultado[]>('/api/busca', {
      params: {
        q: termo,
        pagina: pagina.toString(),
        ativo: 'true',
      },
    });
  }
}`,
      hint: 'Concatenar params manualmente pode gerar problemas com caracteres especiais. O HttpClient tem suporte nativo para isso.',
      bugDescription: 'Concatenar manualmente não faz encoding correto de caracteres especiais (ex: `&`, `=`, espaços). Use a opção `params` do HttpClient para encoding automático e seguro.',
    },

    // ─── RxJS ──────────────────────────────────────────────────
    {
      id: 15,
      category: 'rxjs',
      title: 'Memory leak: subscription não cancelada',
      description: 'Este componente Angular tem um bug grave de memory leak. Você consegue identificar?',
      buggyCode: `@Component({ /* ... */ })
export class NotificacoesComponent implements OnInit {
  private notificacoes$ = inject(NotificacaoService).stream$;
  mensagens = signal<string[]>([]);

  ngOnInit() {
    this.notificacoes$.subscribe(msg => {
      this.mensagens.update(m => [...m, msg]);
    });
  }
}`,
      fixedCode: `@Component({ /* ... */ })
export class NotificacoesComponent implements OnInit, OnDestroy {
  private notificacoes$ = inject(NotificacaoService).stream$;
  private destroy$ = new Subject<void>();
  mensagens = signal<string[]>([]);

  ngOnInit() {
    this.notificacoes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.mensagens.update(m => [...m, msg]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      hint: 'O que acontece com a subscription quando o componente é destruído?',
      bugDescription: 'A subscription nunca é cancelada. Quando o componente é destruído, o Observable continua emitindo e tentando atualizar um componente que não existe mais. Use `takeUntil` + Subject ou `takeUntilDestroyed()`.',
    },
    {
      id: 16,
      category: 'rxjs',
      title: 'switchMap vs mergeMap na busca',
      description: 'Esta busca com autocomplete pode exibir resultados desatualizados. Qual é o problema?',
      buggyCode: `@Component({ /* ... */ })
export class BuscaComponent {
  private http = inject(HttpClient);
  resultados = signal<string[]>([]);

  readonly termoBusca = signal('');

  constructor() {
    toObservable(this.termoBusca).pipe(
      debounceTime(300),
      mergeMap(termo => this.http.get<string[]>(\`/api/busca?q=\${termo}\`))
    ).subscribe(res => this.resultados.set(res));
  }
}`,
      fixedCode: `@Component({ /* ... */ })
export class BuscaComponent {
  private http = inject(HttpClient);
  resultados = signal<string[]>([]);

  readonly termoBusca = signal('');

  constructor() {
    toObservable(this.termoBusca).pipe(
      debounceTime(300),
      switchMap(termo => this.http.get<string[]>(\`/api/busca?q=\${termo}\`))
    ).subscribe(res => this.resultados.set(res));
  }
}`,
      hint: 'Se o usuário digita rápido, múltiplas requisições são disparadas. Qual operador cancela a requisição anterior?',
      bugDescription: '`mergeMap` mantém todas as requisições em paralelo. Se uma anterior demorar mais, pode substituir um resultado novo por um antigo. `switchMap` cancela a requisição anterior ao receber um novo termo.',
    },
    {
      id: 17,
      category: 'rxjs',
      title: 'Subject usado sem completar',
      description: 'Este serviço usa um Subject para eventos mas tem um problema de design. Encontre o bug.',
      buggyCode: `@Injectable({ providedIn: 'root' })
export class EventoService {
  private _eventos = new Subject<string>();
  readonly eventos$ = this._eventos.asObservable();

  emitir(evento: string): void {
    this._eventos.next(evento);
    this._eventos.complete(); // encerra após 1 evento
  }
}`,
      fixedCode: `@Injectable({ providedIn: 'root' })
export class EventoService {
  private _eventos = new Subject<string>();
  readonly eventos$ = this._eventos.asObservable();

  emitir(evento: string): void {
    this._eventos.next(evento);
    // NÃO chamar complete() se quiser emitir múltiplos eventos
  }

  // Opcional: método para encerrar o stream quando o serviço for destruído
  encerrar(): void {
    this._eventos.complete();
  }
}`,
      hint: 'O que acontece com um Subject após chamar `.complete()`?',
      bugDescription: 'Chamar `.complete()` encerra o Subject permanentemente. Qualquer chamada subsequente a `emitir()` não terá efeito porque Subjects completos não aceitam novos valores.',
    },

    // ─── SIGNALS ───────────────────────────────────────────────
    {
      id: 18,
      category: 'signals',
      title: 'Signal mutado diretamente',
      description: 'Este componente tenta atualizar uma lista via signal, mas a UI não atualiza. Ache o bug.',
      buggyCode: `@Component({
  template: \`
    @for (item of itens(); track item.id) {
      <li>{{ item.nome }}</li>
    }
    <button (click)="adicionar()">Adicionar</button>
  \`
})
export class ListaComponent {
  itens = signal<{ id: number; nome: string }[]>([]);

  adicionar() {
    this.itens().push({ id: Date.now(), nome: 'Novo Item' });
  }
}`,
      fixedCode: `@Component({
  template: \`
    @for (item of itens(); track item.id) {
      <li>{{ item.nome }}</li>
    }
    <button (click)="adicionar()">Adicionar</button>
  \`
})
export class ListaComponent {
  itens = signal<{ id: number; nome: string }[]>([]);

  adicionar() {
    this.itens.update(lista => [...lista, { id: Date.now(), nome: 'Novo Item' }]);
  }
}`,
      hint: 'Signals precisam ser notificados de mudanças. Mutação direta no array não gera notificação.',
      bugDescription: '`this.itens().push()` muta o array internamente sem notificar o signal. A UI não detecta a mudança. Use `update` com uma nova referência de array (`[...lista, novoItem]`).',
    },
    {
      id: 19,
      category: 'signals',
      title: 'computed() com efeito colateral',
      description: 'Este computed está fazendo algo que não deveria. Encontre o problema.',
      buggyCode: `@Component({ /* ... */ })
export class PedidoComponent {
  private pedidoService = inject(PedidoService);
  quantidade = signal(1);
  preco = signal(50);

  // Recalcula o total e salva no servidor
  total = computed(() => {
    const t = this.quantidade() * this.preco();
    this.pedidoService.salvarRascunho(t); // salva no servidor
    return t;
  });
}`,
      fixedCode: `@Component({ /* ... */ })
export class PedidoComponent {
  private pedidoService = inject(PedidoService);
  quantidade = signal(1);
  preco = signal(50);

  // Apenas computa, sem efeito colateral
  total = computed(() => this.quantidade() * this.preco());

  constructor() {
    // Efeitos colaterais ficam no effect()
    effect(() => {
      this.pedidoService.salvarRascunho(this.total());
    });
  }
}`,
      hint: '`computed()` deve ser uma função pura. O que fazer quando se precisa de efeitos colaterais reativos?',
      bugDescription: '`computed()` deve ser puro — apenas derivar um valor. Efeitos colaterais (chamadas de API, logs, DOM) devem ir em `effect()`. Um computed com side effects pode executar múltiplas vezes de forma imprevisível.',
    },
    {
      id: 20,
      category: 'signals',
      title: 'toSignal() sem contexto de injeção',
      description: 'Este código tenta converter um Observable em Signal mas gera erro. Qual é o problema?',
      buggyCode: `@Component({ /* ... */ })
export class ProdutosComponent {
  private http = inject(HttpClient);

  // Chamado de fora do construtor
  carregarProdutos() {
    this.produtos = toSignal(
      this.http.get<Produto[]>('/api/produtos')
    );
  }

  produtos: Signal<Produto[] | undefined> | undefined;
}`,
      fixedCode: `@Component({ /* ... */ })
export class ProdutosComponent {
  private http = inject(HttpClient);

  // toSignal() deve ser chamado no contexto de injeção (construtor ou campo)
  readonly produtos = toSignal(
    this.http.get<Produto[]>('/api/produtos'),
    { initialValue: [] }
  );
}`,
      hint: '`toSignal()` requer um contexto de injeção ativo. Onde esse contexto existe?',
      bugDescription: '`toSignal()` precisa ser chamado em um contexto de injeção (construtor, campo de classe, ou usando `runInInjectionContext`). Chamá-lo em um método comum fora do construtor gera `NG0203: toSignal() can only be used within an injection context`.',
    },

    // ─── ANGULAR CORE ──────────────────────────────────────────
    {
      id: 21,
      category: 'angular-core',
      title: 'OnPush com objeto mutado',
      description: 'Com ChangeDetection.OnPush, a UI não atualiza ao modificar o objeto. Ache o bug.',
      buggyCode: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ usuario.nome }}</p>\`
})
export class UsuarioComponent {
  usuario = { id: 1, nome: 'Ana' };

  atualizar() {
    this.usuario.nome = 'Bruno'; // muta o objeto existente
  }
}`,
      fixedCode: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ usuario().nome }}</p>\`
})
export class UsuarioComponent {
  usuario = signal({ id: 1, nome: 'Ana' });

  atualizar() {
    this.usuario.update(u => ({ ...u, nome: 'Bruno' })); // nova referência
  }
}`,
      hint: 'Com `OnPush`, o Angular compara referências de objetos. O que precisa mudar para ele detectar a alteração?',
      bugDescription: 'Com `OnPush`, mutar uma propriedade de um objeto não muda a referência do objeto, então o Angular não detecta a mudança. Use signals ou crie um novo objeto (`{ ...usuario, nome: "Bruno" }`).',
    },
    {
      id: 22,
      category: 'angular-core',
      title: 'Lógica pesada no construtor',
      description: 'Este componente tem uma prática ruim no construtor. Identifique e corrija.',
      buggyCode: `@Component({ /* ... */ })
export class RelatorioComponent {
  dados: Dado[] = [];

  constructor(private relatorioService: RelatorioService) {
    // Carrega dados no construtor
    this.relatorioService.getDados().subscribe(d => {
      this.dados = d;
    });
  }
}`,
      fixedCode: `@Component({ /* ... */ })
export class RelatorioComponent implements OnInit {
  private relatorioService = inject(RelatorioService);
  dados = signal<Dado[]>([]);

  ngOnInit() {
    // Lógica de inicialização no ngOnInit
    this.relatorioService.getDados().subscribe(d => {
      this.dados.set(d);
    });
  }
}`,
      hint: 'Qual hook de ciclo de vida é o lugar correto para lógica de inicialização em Angular?',
      bugDescription: 'O construtor deve ser usado apenas para injeção de dependências. Lógica de negócio, chamadas HTTP e subscriptions devem ficar no `ngOnInit`, que é executado após o Angular configurar os inputs do componente.',
    },
  ];

  getAll(): BugChallenge[] {
    return this.challenges;
  }

  getById(id: number): BugChallenge | undefined {
    return this.challenges.find((c) => c.id === id);
  }

  getByCategory(category: string): BugChallenge[] {
    return this.challenges.filter((c) => c.category === category);
  }
}

