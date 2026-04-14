import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import './App.css'

// Dados movidos para fora para serem acessados por ambas as rotas
const projetos = [
  {
    id: 1,
    titulo: "Sistema de Academia",
    status: "concluido",
    tag: "Concluído",
    desc: "Gestão de alunos e treinos. Integração com API Java e validação de regras (RN06).  Nota: O repositorio não está visivel por estar privado",
    detalhes: "O Sistema de Academia foi desenvolvido para resolver o problema de integridade de dados em academias de bairro. A principal regra de negócio (RN06) impede a exclusão de alunos com mensalidades pendentes, garantindo consistência financeira.",
    regras: [
      "RN04: Arquitetura Separada (API REST em Java + Frontend React).",
      "RN05: Controle de Acesso (Admin gerencia, Aluno visualiza).",
      "RN06: Integridade Referencial (Bloqueio de exclusão com débitos)."
    ],
    stack: ["React", "Java 17", "Spring Boot", "PostgreSQL"],
    complexity: { logic: 4, ui: 3 },
    lessons: "Inicialmente expus entidades JPA diretamente no Controller. Refatorei para usar DTOs (Records do Java 17), desacoplando a persistência da API e melhorando a segurança.",
    endpoints: [
      { method: "GET", path: "/api/v1/alunos", desc: "Lista alunos ativos" },
      { method: "POST", path: "/api/v1/treinos", desc: "Vincula treino ao aluno" }
    ],
    repo: "https://github.com/sabrinaroriz/SistemaAcademia",
    demoLogs: [
      "java -jar academia-system.jar",
      "[INFO] Initializing Spring Boot Application...",
      "[INFO] Connecting to PostgreSQL at localhost:5432...",
      "[OK] Database connection established.",
      "[INFO] Running migration V1__Create_Tables.sql...",
      "[RN06] Checking student financial integrity...",
      "[OK] System ready on port 8080."
    ],
    img: "/prints/academia-capa.png", // Salve suas imagens na pasta "public/prints/" do projeto
    gallery: [
      "/prints/academia-tela1.png", // Print 1 em execução
      "/prints/academia-tela2.png", // Print 2 em execução
      "/prints/academia-tela3.png"  // Print 3 em execução
    ]
  },
  {
    id: 2,
    titulo: "Ponto Certo",
    status: "concluido",
    tag: "Concluído",
    desc: "Sistema híbrido SQL/Pandas para registro imutável de horários (RN08).",
    detalhes: "Focado na imutabilidade do registro de ponto, este sistema utiliza Pandas para processamento de grandes volumes de dados e SQL para persistência segura. Nota: Os dados referentes aos usuários foram substituídos por dados sintéticos para preservar as informações sensíveis originais.",
    regras: [
      "RN07: Dualidade de Dados (Leitura híbrida SQL/Excel).",
      "RN08: Imutabilidade (Horário original nunca é sobrescrito, apenas retificado)."
    ],
    stack: ["React", "Python", "Pandas", "SQL"],
    complexity: { logic: 5, ui: 2 },
    lessons: "O processamento inicial com laços 'for' era lento (10s). Aprendi a vetorizar operações com Pandas, reduzindo o tempo para 0.2s.",
    repo: "https://github.com/LucaSilva0208/Ponto-Certo.git",
    demoLogs: [
      "python main.py --sync",
      "> Loading configuration...",
      "> Connecting to Legacy SQL Database...",
      "> Fetching raw punch records...",
      "> Processing 15,000 records with Pandas...",
      "> [RN08] Verifying immutability hashes...",
      "> Data sync completed successfully."
    ],
    img: "/prints/Ponto-capa.png",
    gallery: [
      "/prints/Ponto-tela1.png",
      "/prints/Ponto-tela2.png",
      "/prints/Ponto-tela3.png"
    ]
  },
  {
    id: 3,
    titulo: "API RESTful",
    status: "refatorando",
    tag: "Spring Boot",
    desc: "Padronização de endpoints e tratamento de erros amigáveis (RN10).",
    detalhes: "Uma API modelo que implementa as melhores práticas de REST, incluindo tratamento global de exceções e padronização de respostas JSON. Nota: O repositorio não está visivel por estar privado",
    regras: [
      "RN09: Padronização REST (Verbos HTTP corretos).",
      "RN10: Tratamento de Erros (Mensagens amigáveis ao invés de stack traces)."
    ],
    stack: ["Java", "Spring Boot", "Swagger", "JUnit"],
    complexity: { logic: 3, ui: 1 },
    lessons: "Aprendi a importância do @ControllerAdvice para tratamento global de exceções, evitando try-catch repetitivos nos Services.",
    endpoints: [
      { method: "GET", path: "/api/users/{id}", desc: "Busca usuário por ID" },
      { method: "DELETE", path: "/api/users/{id}", desc: "Remove usuário (Soft Delete)" }
    ],
    repo: "https://github.com/rafaelafgomes/saapi.git",
    demoLogs: [
      "mvn spring-boot:run",
      "[INFO] Tomcat started on port 8080",
      "[REQ] GET /api/v1/users/123",
      "[RES] 200 OK { id: 123, name: 'Lucas' }",
      "[REQ] POST /api/v1/users (Invalid Data)",
      "[RES] 400 Bad Request { error: 'RN10: Invalid email format' }"
    ],
    img: "/prints/api-capa.png",
    gallery: [
      "/prints/api-tela1.png",
      "/prints/api-tela2.png",
      "/prints/api-tela3.png"
    ]
  },
  {
    id: 4,
    titulo: "Recuperador de Excel",
    status: "concluido",
    tag: "Ferramenta",
    desc: "Aplicação de resgate de dados (Data Rescue) para planilhas .xlsx corrompidas ou protegidas.",
    detalhes: "Ferramenta focada em baixo consumo de memória utilizando Node.js e ExcelJS com streaming de leitura/escrita. O sistema possui sanitização automatizada para remover caracteres ASCII que impedem a abertura do XML e conta com uma rigorosa política Zero-Persistence.",
    regras: [
      "RN11: Suporte exclusivo para extensão .xlsx com limite de 25MB.",
      "RN12: Bypass automático de proteção de planilha/pasta de trabalho.",
      "RN13: Política Zero-Persistence (arquivos originais e recuperados são excluídos imediatamente após o processo)."
    ],
    stack: ["Node.js", "Express", "ExcelJS", "JavaScript", "HTML/CSS"],
    complexity: { logic: 4, ui: 2 },
    lessons: "Implementar streaming de leitura/escrita me ensinou muito sobre o gerenciamento de memória em ambientes limitados (Render). Processar os dados linha a linha (em vez de carregar tudo na RAM) evitou crashes e tornou a aplicação resiliente.",
    repo: "https://github.com/LucaSilva0208/Recuperador-de-Excel.git", // Lembre-se de colocar o seu link real aqui!
    liveLink: "https://recuperador-de-excel.onrender.com",
    demoLogs: [
      "> Inicializando resgate de arquivo via Node.js...",
      "> Recebendo upload de arquivo protegido (18MB)...",
      "> [OK] Validação .xlsx e limites de tamanho aprovados.",
      "> Iniciando processamento de resgate via stream (baixo uso de RAM)...",
      "> [WARN] Sanitizando caracteres de controle ASCII...",
      "> [OK] Bypass de proteção executado com sucesso.",
      "> Sucesso! Planilha pronta. Excluindo temporários (Zero-Persistence)..."
    ],
    img: "/prints/excel-execucao.png",
    gallery: [
      "/prints/excel-codigo.png",
      "/prints/excel-execucao.png"
    ]
  }
];

const skills = [
  { nome: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", classe: "c-skill" },
  { nome: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", classe: "java-skill", tooltip: "Praticando POO e em breve APIs REST" },
  { nome: "Spring", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", classe: "spring-skill" },
  { nome: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", classe: "react-skill" },
  { nome: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", classe: "python-skill" },
  { nome: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", classe: "js-skill" },
  { nome: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", classe: "node-skill" },
  { nome: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", classe: "html-skill" }
];

const timelineData = [
  { year: "2021", title: "Fundamentos", desc: "Lógica e Estrutura de Dados em C." },
  { year: "2022", title: "Fundamentos", desc: "Orientação a objeto em java."},
  { year: "2025", title: "Fullstack", desc: "Especialização em React e Spring Boot." },
  { year: "2026", title: "Automação", desc: "Scripts Python (Projeto Ponto AMAC)." }
];

const achievements = [
  { id: 1, title: "Mestre do C", icon: "🏆", desc: "Dominou ponteiros e memória." },
  { id: 2, title: "Explorador de Pandas", icon: "🐼", desc: "Manipulação de dados massiva." },
  { id: 3, title: "Iniciante Spring", icon: "🍃", desc: "Primeira API RESTful em produção." },
  { id: 4, title: "Salvador de Dados", icon: "🚑", desc: "Resgate de planilhas e manipulação via streams." }
];

const currentStudy = {
  status: "📖 Lendo",
  title: "Arquitetura Limpa",
  author: "Robert C. Martin"
};

function DemoModal({ project, onClose }) {
  const [status, setStatus] = useState('booting'); // booting, running
  const [activeTab, setActiveTab] = useState('terminal');
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = project.gallery || [project.img];

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const totalTime = (project.demoLogs?.length || 0) * 300 + 800;
    const timer = setTimeout(() => {
      setStatus('running');
      setActiveTab('system');
    }, totalTime);
    return () => clearTimeout(timer);
  }, [project]);

  return (
    <div className="demo-overlay" onClick={onClose}>
      <div className="demo-window" onClick={e => e.stopPropagation()}>
        <div className="demo-titlebar">
          <span className="window-btn close-btn" onClick={onClose}></span>
          <span className="window-btn min-btn"></span>
          <span className="window-btn max-btn"></span>
          <span style={{marginLeft: '10px', color: '#aaa', fontSize: '12px'}}>
            {activeTab === 'terminal' ? 'terminal' : 'sys'} — {project.titulo}
          </span>
          {status === 'running' && (
            <div className="demo-tabs">
              <button className={`tab-btn ${activeTab === 'terminal' ? 'active' : ''}`} onClick={() => setActiveTab('terminal')}>Terminal</button>
              <button className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>System</button>
            </div>
          )}
        </div>
        
        {activeTab === 'terminal' && (
          <div className="demo-terminal">
            {project.demoLogs && project.demoLogs.map((log, i) => (
              <div key={i} className="log-line" style={{ animationDelay: `${i * 0.3}s` }}>
                <span style={{color: '#27c93f'}}>➜</span> {log}
              </div>
            ))}
            <div className="log-line" style={{ animationDelay: `${(project.demoLogs?.length || 0) * 0.3}s` }}>
              <span className="cursor-blink">_</span>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="demo-screen">
            <img 
              src={images[currentSlide]} 
              alt="Sistema Rodando" 
              onError={(e) => { 
                const missingFile = images[currentSlide].split('/').pop();
                e.target.src = `https://placehold.co/800x600/1e1e1e/FF5F56?text=Falta+o+arquivo:\n${missingFile}`; 
                console.error("ERRO: O navegador não encontrou a imagem no caminho ->", images[currentSlide]); 
              }}
            />
            
            {images.length > 1 && (
              <>
                <button className="nav-btn prev-btn" onClick={prevSlide}>&#10094;</button>
                <button className="nav-btn next-btn" onClick={nextSlide}>&#10095;</button>
                <div className="slide-indicators">
                  {images.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`dot ${currentSlide === idx ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    ></span>
                  ))}
                </div>
              </>
            )}

            <div className="system-overlay">
              <div className="system-badge">🟢 Sistema Online</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Lucas Silva. Desenvolvedor Fullstack.</p>
          <p className="built-with">Construído com React & CSS Nativo</p>
        </div>
        <div className="footer-links">
          <a href="https://github.com/LucaSilva0208" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/lucas-silva-6a18b037b" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:l.silvapjf@gmail.com">Contato</a>
        </div>
      </div>
      <div className="api-status">
        <span>System Status: <strong>Online</strong> 🟢</span>
      </div>
    </footer>
  );
}

function ProjectDetails({ theme, toggleTheme }) {
  const { id } = useParams();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const projeto = projetos.find(p => p.id === Number(id));

  if (!projeto) {
    return <div className="app-container"><h2>Projeto não encontrado</h2><Link to="/" className="repo-link">Voltar</Link></div>;
  }

  const renderComplexity = (level) => {
    return (
      <div className="meter-container">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className={`meter-bar ${i <= level ? 'filled' : ''}`}></div>)}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header>
        <nav>
          <Link to="/"><h1>Lucas Silva<span className="dot-dev">.dev</span></h1></Link>
          <ul style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <li><Link to="/">Voltar para Home</Link></li>
            <button onClick={toggleTheme} className="theme-btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <span className={`status ${projeto.status}`}>{projeto.tag}</span>
        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{projeto.titulo}</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.6', opacity: 0.8 }}>{projeto.detalhes}</p>
        
        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Ficha Técnica</h3>
          <p><strong>Status:</strong> {projeto.tag}</p>
          <p><strong>Resumo:</strong> {projeto.desc}</p>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <a href={projeto.repo} target="_blank" rel="noopener noreferrer" className="repo-link">Ver Código no GitHub &rarr;</a>
            {projeto.liveLink && (
              <a href={projeto.liveLink} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ backgroundColor: '#646cff', color: '#fff', borderColor: '#646cff' }}>Acessar Aplicação &rarr;</a>
            )}
          </div>

          <div className="complexity-section">
            <div className="complexity-row">
              <span>Lógica de Dados:</span> {renderComplexity(projeto.complexity.logic)}
            </div>
            <div className="complexity-row">
              <span>Complexidade UI:</span> {renderComplexity(projeto.complexity.ui)}
            </div>
          </div>

          <h3>Regras de Negócio (RN)</h3>
          <ul style={{ textAlign: 'left', marginBottom: '20px', lineHeight: '1.6' }}>
            {projeto.regras.map((rule, i) => <li key={i}>{rule}</li>)}
          </ul>

          <h3>Arquitetura & Tecnologias</h3>
          <div className="skills-container" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
            {projeto.stack.map(tech => <span key={tech} className="skill-badge">{tech}</span>)}
          </div>

          {projeto.endpoints && (
            <>
              <h3>Endpoints Principais</h3>
              <div className="endpoints-container">
                {projeto.endpoints.map((ep, i) => (
                  <div key={i} className="endpoint-block">
                    <span className={`method ${ep.method}`}>{ep.method}</span>
                    <span className="path">{ep.path}</span>
                    <span className="desc-comment">// {ep.desc}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3>💡 Lições Aprendidas</h3>
          <div className="lessons-card">{projeto.lessons}</div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href={projeto.repo} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ display: 'inline-block' }}>Ver Código no GitHub &rarr;</a>
            {projeto.liveLink && (
              <a href={projeto.liveLink} target="_blank" rel="noopener noreferrer" className="repo-link" style={{ display: 'inline-block', backgroundColor: '#646cff', color: '#fff', borderColor: '#646cff' }}>Acessar Aplicação &rarr;</a>
            )}
            <button className="demo-btn" onClick={() => setShowDemo(true)}>
              ▶ Executar Demo
            </button>
          </div>
        </div>

        {showDemo && (
          <DemoModal project={projeto} onClose={() => setShowDemo(false)} />
        )}
        <Footer />
      </main>
    </div>
  );
}

function Home({ theme, toggleTheme }) {
  const [activeDemo, setActiveDemo] = useState(null);
  const [filter, setFilter] = useState('Todos');

  const filteredProjects = filter === 'Todos' 
    ? projetos 
    : projetos.filter(p => p.stack.some(s => s.toLowerCase().includes(filter.toLowerCase())));

  const filters = ['Todos', 'Java', 'React', 'Python', 'JavaScript', 'Node.js'];

  const handleSkillClick = (skillName) => {
    // Verifica se a tecnologia clicada possui um filtro correspondente nos projetos
    const filterMatch = filters.find(f => f.toLowerCase() === skillName.toLowerCase());
    if (filterMatch) {
      setFilter(filterMatch);
      document.getElementById('projetos').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <header>
        <nav>
          <h1>Lucas Silva<span className="dot-dev">.dev</span></h1>
          <ul style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#skills">Techs</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#timeline">Jornada</a></li>
            <button onClick={toggleTheme} className="theme-btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </ul>
        </nav>
      </header>

      <main>
        <section id="intro">
          <h2 className="typing-effect">Desenvolvedor Fullstack</h2>
          <p>Transformando lógica de negócios em código limpo e soluções escaláveis.</p>
          
          <div className="reading-widget">
            <span className="reading-status">{currentStudy.status}:</span>
            <span className="reading-title">{currentStudy.title} <small>({currentStudy.author})</small></span>
          </div>
        </section>

        <section id="sobre">
          <h3>Sobre Mim</h3>
          <div className="card about-card">
            <div className="about-image-container">
              <img 
                src="/prints/cartao-fundo.png" 
                alt="Apresentação Lucas Silva" 
                className="about-presentation-img"
              />
            </div>
            <div className="about-text">
              <p>
                Olá! Minha jornada na programação começou em 2021 no <strong>Instituto Federal do Sudeste de Minas Gerais</strong>. Desde então, me apaixonei por resolver problemas através do código e hoje tenho focado em desenvolvimento Web, explorando ecossistemas como <strong>Python, Java e React</strong>.
              </p>
              <p>
                Me considero um desenvolvedor bastante versátil: não tenho uma preferência estrita por uma única stack, o que me permite me <strong>adaptar rapidamente a qualquer ambiente</strong> ou novo desafio. No momento, o meu maior objetivo é conquistar a minha <strong>primeira oportunidade como Desenvolvedor Júnior ou Estagiário</strong> para poder contribuir com projetos reais e continuar evoluindo.
              </p>
              <p>
                E para quebrar o gelo: quando não estou programando, gosto de aproveitar meu tempo livre jogando videogame, lendo livros de fantasia, tocando violão, dando passeios e valorizando bons momentos com a minha família! 🎮🎸📚
              </p>
              <div style={{ marginTop: '25px' }}>
                <a href="/prints/cartao-com-dados.png" download="Lucas_Silva_Cartao_Apresentacao.png" className="demo-btn" style={{ display: 'inline-block' }}>
                  📥 Baixar Cartão de Visitas
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="skills">
          <h3>Stack Tecnológica</h3>
          <div className="skills-container">
            {skills.map(skill => (
              <div key={skill.nome} className={`skill-badge-icon ${skill.classe}`} title={skill.tooltip || skill.nome} onClick={() => handleSkillClick(skill.nome)}>
                <img src={skill.icon} alt={skill.nome} />
                <span>{skill.nome}</span>
                {skill.tooltip && <span className="tooltip-text">{skill.tooltip}</span>}
              </div>
            ))}
          </div>
        </section>

        <section id="achievements">
          <h3>Conquistas</h3>
          <div className="achievements-grid">
            {achievements.map(ach => (
              <div key={ach.id} className="achievement-badge">
                <div className="ach-icon">{ach.icon}</div>
                <div className="ach-info"><strong>{ach.title}</strong><br/><small>{ach.desc}</small></div>
              </div>
            ))}
          </div>
        </section>

        <section id="timeline">
          <h3>Minha Jornada</h3>
          <div className="timeline">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
            {/* Linha vertical conectora */}
            <div className="timeline-line"></div>
          </div>
        </section>

        <section id="projetos">
          <h3>Meus Projetos</h3>
          
          <div className="filter-container">
            {filters.map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>

          <div className="projects-grid">
            {filteredProjects.map(proj => (
              <div key={proj.id} className="card">
                <span className={`status ${proj.status}`}>{proj.tag}</span>
                <img 
                  src={proj.img} 
                  alt={proj.titulo} 
                  className="project-mockup" 
                  onError={(e) => { 
                    const missingFile = proj.img.split('/').pop();
                    e.target.src = `https://placehold.co/600x400/1e1e1e/FF5F56?text=Falta+a+Capa:\n${missingFile}`; 
                    console.error("ERRO: Capa não encontrada no caminho ->", proj.img); 
                  }}
                />
                <h4>{proj.titulo}</h4>
                <p>{proj.desc}</p>
                <div className="card-footer">
                  <Link to={`/projeto/${proj.id}`} className="repo-link">Detalhes</Link>
                  <button className="demo-btn-small" onClick={() => setActiveDemo(proj)}>
                    ▶ Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {activeDemo && (
          <DemoModal project={activeDemo} onClose={() => setActiveDemo(null)} />
        )}
      </main>

      <Footer />
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <style>{`
        /* Variáveis de Tema */
        body.light {
          background-color: #fdfdfd;
          background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          color: #333;
          --card-bg: #fff;
          --text-color: #333;
          --border-color: #eaeaea;
          --header-bg: rgba(253, 253, 253, 0.85);
          --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }
        body.dark {
          background-color: #121212;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
          color: #f4f4f4;
          --card-bg: #1e1e1e;
          --text-color: #f4f4f4;
          --border-color: #444;
          --header-bg: rgba(18, 18, 18, 0.85);
          --card-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        }

        /* Estilos Globais Ajustados */
        .card {
          background-color: var(--card-bg);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: var(--card-shadow);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        /* Badges Interativos */
        .skill-badge-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          background: var(--card-bg);
          border-radius: 10px;
          width: 100px;
          transition: transform 0.3s, border-color 0.3s;
          border: 2px solid transparent;
          position: relative;
          cursor: pointer;
        }
        .skill-badge-icon img { width: 40px; height: 40px; margin-bottom: 8px; }
        .skill-badge-icon:hover { transform: translateY(-5px); }
        
        /* Regra específica Java */
        .java-skill:hover { border-color: #4caf50; }
        .tooltip-text {
          visibility: hidden;
          width: 120px;
          background-color: #333;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          position: absolute;
          z-index: 1;
          bottom: 100%;
          left: 50%;
          margin-left: -60px;
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.8rem;
        }
        .skill-badge-icon:hover .tooltip-text { visibility: visible; opacity: 1; }

        /* Timeline */
        .timeline { position: relative; max-width: 600px; margin: 40px auto; padding-left: 20px; border-left: 2px solid #646cff; }
        .timeline-item { margin-bottom: 30px; position: relative; padding-left: 20px; }
        .timeline-dot { width: 12px; height: 12px; background: #646cff; border-radius: 50%; position: absolute; left: -27px; top: 5px; }
        .timeline-date { font-weight: bold; color: #646cff; margin-bottom: 5px; }
        
        /* Mockups */
        .project-mockup { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; }

        /* Theme Toggle */
        .theme-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0; }

        /* Footer Styles */
        .site-footer {
          margin-top: 60px;
          padding: 40px 20px 20px;
          border-top: 1px solid var(--border-color);
          text-align: center;
        }
        .footer-content {
          display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 20px;
        }
        @media(min-width: 768px) {
          .footer-content { flex-direction: row; justify-content: space-between; text-align: left; }
        }
        .built-with { font-size: 0.85rem; opacity: 0.7; margin-top: 5px; }
        .footer-links { display: flex; gap: 15px; }
        .footer-links a { color: var(--text-color); text-decoration: none; font-weight: bold; transition: color 0.3s; }
        .footer-links a:hover { color: #646cff; }
        .api-status {
          font-size: 0.85rem; opacity: 0.8; display: inline-block;
          padding: 5px 15px; background: var(--card-bg);
          border: 1px solid var(--border-color); border-radius: 20px;
          margin-top: 10px;
        }
        
        /* Ajustes de Header para o botão */
        nav ul { list-style: none; padding: 0; margin: 0; }
        nav a { color: inherit; text-decoration: none; }
        nav a:hover { color: #646cff; }

        /* Header Fixo e Moderno */
        header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--header-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          padding: 15px 20px;
          margin-bottom: 40px;
          border-radius: 0 0 16px 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        nav { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; }
        nav h1 { margin: 0; font-size: 1.6rem; }
        .dot-dev { color: #646cff; }

        /* Seção Intro (Hero) mais chamativa */
        #intro { text-align: center; padding: 60px 20px; }
        .typing-effect {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #646cff 0%, #ff64d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 15px;
        }
        #intro p { font-size: 1.2rem; opacity: 0.8; max-width: 600px; margin: 0 auto 20px; line-height: 1.6; }

        /* Demo Modal Styles */
        .demo-btn {
          background: #27c93f;
          color: #1a1a1a;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .demo-btn:hover { transform: scale(1.05); }

        .demo-btn-small {
          background: transparent;
          color: #27c93f;
          border: 1px solid #27c93f;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: 0.3s;
        }
        .demo-btn-small:hover { background: #27c93f; color: #000; }
        
        .demo-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; backdrop-filter: blur(3px);
        }
        .demo-window {
          width: 95%; max-width: 1200px; height: 80vh;
          background: #1e1e1e; border-radius: 8px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.7);
          display: flex; flex-direction: column;
          border: 1px solid #333; font-family: 'Courier New', monospace;
        }
        .demo-titlebar {
          background: #2d2d2d; padding: 10px 15px;
          display: flex; gap: 8px; align-items: center; border-bottom: 1px solid #333;
        }
        .window-btn { width: 12px; height: 12px; border-radius: 50%; }
        .close-btn { background: #ff5f56; cursor: pointer; }
        .min-btn { background: #ffbd2e; }
        .max-btn { background: #27c93f; }
        .demo-terminal { padding: 20px; color: #f0f0f0; overflow-y: auto; text-align: left; flex: 1; }
        .log-line { opacity: 0; animation: fadeIn 0.3s forwards; margin-bottom: 8px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .cursor-blink { animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        /* Demo Screen Styles */
        .demo-screen {
          width: 100%; flex: 1; position: relative;
          background: #000; display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.5s ease-in-out; overflow: hidden;
        }
        .demo-screen img { width: 100%; height: 100%; object-fit: contain; opacity: 1; filter: none; }
        
        .system-overlay { position: absolute; top: 15px; right: 15px; z-index: 10; pointer-events: none; }
        .system-badge { background: rgba(39, 201, 63, 0.9); color: #000; padding: 6px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(4px); }

        /* Demo Navigation */
        .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; font-size: 1.2rem; transition: 0.3s; z-index: 5; }
        .nav-btn:hover { background: rgba(0,0,0,0.8); }
        .prev-btn { left: 0; border-radius: 0 5px 5px 0; }
        .next-btn { right: 0; border-radius: 5px 0 0 5px; }
        
        .slide-indicators { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 5; }
        .dot { width: 10px; height: 10px; background: rgba(255,255,255,0.3); border-radius: 50%; cursor: pointer; transition: 0.3s; }
        .dot.active { background: #27c93f; transform: scale(1.2); }

        /* Demo Tabs */
        .demo-tabs { margin-left: auto; display: flex; gap: 5px; }
        .tab-btn { background: none; border: none; color: #aaa; cursor: pointer; font-size: 0.8rem; padding: 2px 8px; border-radius: 4px; }
        .tab-btn:hover { color: #fff; background: #444; }
        .tab-btn.active { color: #fff; background: #646cff; }

        /* Demo Code */
        .demo-code { padding: 20px; background: #1e1e1e; color: #d4d4d4; overflow: auto; flex: 1; text-align: left; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.9rem; }

        /* Sobre Mim Card */
        .about-card { padding: 0; display: flex; flex-direction: column; overflow: hidden; }
        .about-image-container { width: 100%; height: 250px; border-bottom: 1px solid var(--border-color); }
        .about-presentation-img { width: 100%; height: 100%; object-fit: cover; }
        .about-text { padding: 30px; font-size: 1.1rem; line-height: 1.8; }
        @media(min-width: 768px) {
          .about-card { flex-direction: row; }
          .about-image-container { width: 40%; height: auto; border-bottom: none; border-right: 1px solid var(--border-color); }
          .about-text { width: 60%; padding: 40px; }
        }

        /* Novos Estilos */
        /* Filtro */
        .filter-container { display: flex; gap: 10px; justify-content: center; margin-bottom: 30px; flex-wrap: wrap; }
        .filter-btn { padding: 8px 16px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-color); cursor: pointer; border-radius: 20px; transition: 0.3s; }
        .filter-btn:hover { border-color: #646cff; }
        .filter-btn.active { background: #646cff; color: #fff; border-color: #646cff; }

        /* Widget Leitura */
        .reading-widget { margin-top: 20px; display: inline-flex; align-items: center; gap: 10px; background: var(--card-bg); padding: 10px 20px; border-radius: 50px; border: 1px solid var(--border-color); font-size: 0.9rem; }
        .reading-status { font-weight: bold; color: #646cff; }

        /* Conquistas */
        .achievements-grid { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-top: 20px; }
        .achievement-badge { display: flex; align-items: center; gap: 10px; background: var(--card-bg); padding: 10px 15px; border-radius: 8px; border: 1px solid var(--border-color); width: 200px; text-align: left; }
        .ach-icon { font-size: 1.5rem; }
        .ach-info small { opacity: 0.7; font-size: 0.75rem; }

        /* Complexidade */
        .complexity-section { margin: 20px 0; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; }
        .complexity-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
        .meter-container { display: flex; gap: 3px; }
        .meter-bar { width: 25px; height: 8px; background: #444; border-radius: 2px; }
        .meter-bar.filled { background: #27c93f; box-shadow: 0 0 5px rgba(39, 201, 63, 0.5); }

        /* Endpoints */
        .endpoints-container { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .endpoint-block { 
          background: #111; padding: 12px; border-radius: 6px; 
          font-family: 'Courier New', monospace; font-size: 0.9rem;
          display: flex; gap: 15px; align-items: center; border-left: 3px solid #646cff;
          overflow-x: auto;
        }
        .method { font-weight: bold; }
        .method.GET { color: #61DBFB; }
        .method.POST { color: #27c93f; }
        .method.DELETE { color: #ff5f56; }
        .path { color: #e0e0e0; }
        .desc-comment { color: #666; font-style: italic; margin-left: auto; }

        /* Lições */
        .lessons-card {
          background: rgba(255, 189, 46, 0.1);
          border-left: 4px solid #ffbd2e;
          padding: 15px;
          border-radius: 4px;
          font-style: italic;
          margin-bottom: 20px;
        }
      `}</style>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={<Home theme={theme} toggleTheme={toggleTheme} />} 
          />
          <Route 
            path="/projeto/:id" 
            element={<ProjectDetails theme={theme} toggleTheme={toggleTheme} />} 
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
