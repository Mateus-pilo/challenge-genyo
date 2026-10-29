# CRUD de Funcionarios

Aplicacao de cadastro de funcionarios com API NestJS, interface Angular e MongoDB.

## Por que Node.js e NestJS

Node.js foi escolhido para manter o backend no ecossistema JavaScript/TypeScript usado pela interface Angular, compartilhar práticas e tipos entre as camadas e atender bem a uma API HTTP orientada a operações de I/O, como consultas e gravações no MongoDB. Seu modelo assíncrono permite tratar várias requisições sem bloquear a execução durante essas operações.

NestJS organiza essa base em módulos, controllers e providers, deixando as responsabilidades explícitas. A injeção de dependências nativa facilita substituir implementações, isolar o acesso ao banco e testar use-cases sem depender de HTTP ou MongoDB. Decorators e TypeScript também tornam os contratos mais claros; a estrutura ajuda a manter o código legível conforme a aplicação cresce.

## Executar com Docker Compose

Pre-requisitos: Docker Desktop com Docker Compose.

Na raiz do repositorio, opcionalmente copie `.env.example` para `.env` e ajuste as variaveis. O Compose usa os valores de `.env` quando preenchidos e aplica defaults quando o arquivo nao existe ou uma variavel esta vazia:

```bash
cp .env.example .env
docker compose up
```

Na primeira inicializacao, o Compose instala as dependencias dentro dos containers. Por padrao, a API fica em `http://localhost:3000`, a interface em `http://localhost:4200` e o MongoDB na porta `27017`. Portas, imagens, banco, origem web e destino do proxy podem ser configurados por variaveis de ambiente. Os dados persistem no volume `mongo_data`.

A documentação interativa da API fica em `http://localhost:3000/api/docs`.

Para parar os servicos, use `docker compose down`. Para apagar tambem os dados do MongoDB, use `docker compose down -v`.

O Compose monta `apps/api` e `apps/web` como diretorios de desenvolvimento. As dependencias de cada aplicacao devem ser instaladas no container; os fontes ficam no workspace para hot reload.

## Executar sem Docker

Pre-requisitos: Node.js 20.19+ e MongoDB.

1. Configure `MONGODB_URI` no ambiente da API para `mongodb://localhost:27017/employee_crud` e `WEB_ORIGIN` para a origem local do Angular.
2. Em um terminal, execute a API:

   ```bash
   cd apps/api
   npm install
   npm run start:dev
   ```

3. Em outro terminal, execute o frontend:

   ```bash
   cd apps/web
   npm install
   API_PROXY_TARGET=http://localhost:3000 npm start -- --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.js
   ```

## API

| Metodo   | Rota             | Operacao                      |
| -------- | ---------------- | ----------------------------- |
| `POST`   | `/employees`     | Cadastrar funcionario         |
| `GET`    | `/employees`     | Listar por admissao crescente |
| `GET`    | `/employees/:id` | Consultar funcionario         |
| `PUT`    | `/employees/:id` | Atualizar funcionario         |
| `DELETE` | `/employees/:id` | Excluir funcionario           |

O backend valida campos e regras de negocio antes de persistir. O `EmployeesService` orquestra use-cases independentes, que dependem do contrato de repositorio em vez de acessar Mongoose diretamente.

O endpoint `GET /health` informa quando a API esta pronta; o Compose usa essa verificacao antes de iniciar o frontend.

A documentação OpenAPI está disponível em `http://localhost:3000/api/docs` durante a execução da API.

## Testes e build

```bash
cd apps/api
npm test -- --runInBand
npm run build
```

```bash
cd apps/web
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

O calculo de dias trabalhados inclui tanto a data de admissao quanto a de demissao. Para funcionarios sem data de demissao, o total nao e exibido.
