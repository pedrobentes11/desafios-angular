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
