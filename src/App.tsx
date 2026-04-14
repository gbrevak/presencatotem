import { useEffect, useRef, useState } from 'react'
import './App.css'

type Theme = 'light' | 'dark'
type MenuId = 'Portfolio' | 'Plataforma' | 'Depoimentos' | 'Tecnologias' | 'VendeAI'

type MenuItem = {
  id: MenuId
  eyebrow: string
  title: string
  description: string
  accent: string
}

const menuItems: MenuItem[] = [
  {
    id: 'Portfolio',
    eyebrow: 'Cases e ativacoes',
    title: 'Portfolio',
    description: 'Experiencias e entregas para eventos, varejo e jornadas interativas.',
    accent: 'orange',
  },
  {
    id: 'Plataforma',
    eyebrow: 'Navegacao externa',
    title: 'Plataforma',
    description: 'Abrir o portal Sou Presenca em uma nova janela para demonstracao ao vivo.',
    accent: 'black',
  },
  {
    id: 'Depoimentos',
    eyebrow: 'Stories em tela cheia',
    title: 'Depoimentos',
    description: 'Narrativa curta, ritmada e tocavel para provas sociais do stand.',
    accent: 'orange',
  },
  {
    id: 'Tecnologias',
    eyebrow: 'Stack e recursos',
    title: 'Tecnologias',
    description: 'Base para apresentar integracoes, IA, kiosks e automacoes do ecossistema.',
    accent: 'black',
  },
  {
    id: 'VendeAI',
    eyebrow: 'Produto em destaque',
    title: 'VendeAI',
    description: 'Espaco pronto para detalhar o produto assim que voce enviar o conteudo.',
    accent: 'orange',
  },
]

const portfolioOptions = ['CLT', 'INSS', 'FGTS', 'SIAPE', 'Convenios Publicos']

const testimonialImages = Object.entries(
  import.meta.glob('./assets/depoimentos/*.png', { eager: true, import: 'default' }) as Record<
    string,
    string
  >,
)
  .sort(([fileA], [fileB]) => fileA.localeCompare(fileB, undefined, { numeric: true }))
  .map(([, filePath]) => filePath)

const homeSlideImages = Object.entries(
  import.meta.glob('./assets/home-carrossel/*.png', { eager: true, import: 'default' }) as Record<
    string,
    string
  >,
)
  .sort(([fileA], [fileB]) => fileA.localeCompare(fileB, undefined, { numeric: true }))
  .map(([, filePath]) => filePath)

const techImages = Object.entries(
  import.meta.glob('./assets/tech-carrossel/*.jpg', { eager: true, import: 'default' }) as Record<
    string,
    string
  >,
)
  .sort(([fileA], [fileB]) => fileA.localeCompare(fileB, undefined, { numeric: true }))
  .map(([, filePath]) => filePath)

const storyDurationMs = 5200
const storyTickMs = 80
const storyStep = 100 / (storyDurationMs / storyTickMs)
const idleTimeoutSeconds = 90

function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [activeMenu, setActiveMenu] = useState<MenuId>('Portfolio')
  const [activeStory, setActiveStory] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [activeHomeSlide, setActiveHomeSlide] = useState(0)
  const [homeSlideProgress, setHomeSlideProgress] = useState(0)
  const [activeTechSlide, setActiveTechSlide] = useState(0)
  const [techSlideProgress, setTechSlideProgress] = useState(0)
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail'>('home')
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward')
  const [idleSecondsLeft, setIdleSecondsLeft] = useState(idleTimeoutSeconds)
  const [platformScale, setPlatformScale] = useState(1)
  const platformWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (activeMenu !== 'Plataforma') return
    const el = platformWrapRef.current
    if (!el) return
    const update = () => setPlatformScale(el.clientWidth / 1280)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [activeMenu])

  useEffect(() => {
    if (currentScreen !== 'detail' || activeMenu !== 'Depoimentos' || testimonialImages.length === 0) {
      return undefined
    }

    let progress = 0

    const intervalId = window.setInterval(() => {
      progress = Math.min(progress + storyStep, 100)

      if (progress >= 100) {
        progress = 0
        setStoryProgress(0)
        setActiveStory((currentStory) => (currentStory + 1) % testimonialImages.length)
      } else {
        setStoryProgress(progress)
      }
    }, storyTickMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeMenu, currentScreen, activeStory])

  useEffect(() => {
    if (currentScreen !== 'detail' || activeMenu !== 'Tecnologias' || techImages.length === 0) {
      return undefined
    }

    let progress = 0

    const intervalId = window.setInterval(() => {
      progress = Math.min(progress + storyStep, 100)

      if (progress >= 100) {
        progress = 0
        setTechSlideProgress(0)
        setActiveTechSlide((current) => (current + 1) % techImages.length)
      } else {
        setTechSlideProgress(progress)
      }
    }, storyTickMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeMenu, currentScreen, activeTechSlide])

  useEffect(() => {
    if (currentScreen !== 'home' || homeSlideImages.length === 0) {
      return undefined
    }

    const homeCarouselId = window.setInterval(() => {
      setHomeSlideProgress((currentProgress) => {
        if (currentProgress >= 100) {
          setActiveHomeSlide((currentSlide) => (currentSlide + 1) % homeSlideImages.length)
          return 0
        }

        return Math.min(currentProgress + storyStep, 100)
      })
    }, storyTickMs)

    return () => {
      window.clearInterval(homeCarouselId)
    }
  }, [currentScreen, activeHomeSlide])

  useEffect(() => {
    if (currentScreen !== 'detail') {
      return undefined
    }

    const countdownId = window.setInterval(() => {
      setIdleSecondsLeft((currentValue) => {
        if (currentValue <= 1) {
          setTransitionDirection('back')
          setCurrentScreen('home')
          return idleTimeoutSeconds
        }

        return currentValue - 1
      })
    }, 1000)

    const resetIdleCountdown = () => {
      setIdleSecondsLeft(idleTimeoutSeconds)
    }

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    events.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleCountdown, { passive: true })
    })

    return () => {
      window.clearInterval(countdownId)
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleCountdown)
      })
    }
  }, [currentScreen])

  function handleMenuSelection(menuId: MenuId) {
    setActiveMenu(menuId)
    setTransitionDirection('forward')
    setCurrentScreen('detail')
    setIdleSecondsLeft(idleTimeoutSeconds)

    if (menuId === 'Depoimentos') {
      setActiveStory(0)
      setStoryProgress(0)
    }
    if (menuId === 'Tecnologias') {
      setActiveTechSlide(0)
      setTechSlideProgress(0)
    }
  }

  function goBackToHome() {
    setTransitionDirection('back')
    setCurrentScreen('home')
  }

  function showPreviousStory() {
    setStoryProgress(0)
    setActiveStory((currentStory) =>
      currentStory === 0 ? testimonialImages.length - 1 : currentStory - 1,
    )
  }

  function showNextStory() {
    setStoryProgress(0)
    setActiveStory((currentStory) => (currentStory + 1) % testimonialImages.length)
  }

  function showPreviousHomeSlide() {
    setHomeSlideProgress(0)
    setActiveHomeSlide((currentSlide) =>
      currentSlide === 0 ? homeSlideImages.length - 1 : currentSlide - 1,
    )
  }

  function showNextHomeSlide() {
    setHomeSlideProgress(0)
    setActiveHomeSlide((currentSlide) => (currentSlide + 1) % homeSlideImages.length)
  }

  function keepSessionAlive() {
    setIdleSecondsLeft(idleTimeoutSeconds)
  }

  function showPreviousTechSlide() {
    setTechSlideProgress(0)
    setActiveTechSlide((current) =>
      current === 0 ? techImages.length - 1 : current - 1,
    )
  }

  function showNextTechSlide() {
    setTechSlideProgress(0)
    setActiveTechSlide((current) => (current + 1) % techImages.length)
  }

  function renderMenuIcon(menuId: MenuId) {
    switch (menuId) {
      case 'Portfolio':
        return (
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Zm4 0a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Zm0 4a.75.75 0 0 0 0 1.5h5a.75.75 0 0 0 0-1.5H8Z" />
          </svg>
        )
      case 'Plataforma':
        return (
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M5 3h14a2 2 0 0 1 2 2v10H3V5a2 2 0 0 1 2-2ZM1 15h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2Z" />
          </svg>
        )
      case 'Depoimentos':
        return (
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v5A3.5 3.5 0 0 1 16.5 16H9l-3.2 3.2c-.47.47-1.3.14-1.3-.53V7.5Zm4 .5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5H8Zm0 3.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5H8Z" />
          </svg>
        )
      case 'Tecnologias':
        return (
          <svg viewBox="0 0 24 24" role="presentation">
            <path
              fillRule="evenodd"
              d="M7 4h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM8.25 8a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM13.25 8a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0ZM9 11h6v1H9ZM9 15.5h6v3H9Z"
            />
          </svg>
        )
      case 'VendeAI':
        return (
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M12 3.5 4.75 7.4v5.2c0 4.14 2.55 7.98 6.45 9.69.52.23 1.1.23 1.62 0 3.9-1.7 6.43-5.55 6.43-9.69V7.4L12 3.5Zm-.75 5.75a.75.75 0 0 1 1.5 0v2h2a.75.75 0 0 1 0 1.5h-2v2a.75.75 0 0 1-1.5 0v-2h-2a.75.75 0 0 1 0-1.5h2v-2Z" />
          </svg>
        )
      default:
        return null
    }
  }

  const idleClock = `${String(Math.floor(idleSecondsLeft / 60)).padStart(2, '0')}:${String(idleSecondsLeft % 60).padStart(2, '0')}`
  const shouldShowIdlePopup = currentScreen === 'detail' && idleSecondsLeft <= 30
  const compactLogoSrc = theme === 'light' ? '/logo-presenca-preto.svg' : '/logo-presenca-branco.svg'

  function renderSideMenu() {
    return (
      <nav className={`menu-nav-bar ${isMenuExpanded ? 'is-expanded' : 'is-collapsed'}`} aria-label="Menu principal">
        <button
          type="button"
          className="menu-expand-button"
          onClick={() => setIsMenuExpanded((expanded) => !expanded)}
          aria-label={isMenuExpanded ? 'Recolher opcoes do menu' : 'Expandir opcoes do menu'}
        >
          <span className={`hamburger-icon ${isMenuExpanded ? 'is-open' : ''}`} aria-hidden="true">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </span>
        </button>

        <span className="menu-nav-divider" aria-hidden="true" />

        <div className="menu-nav-items">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              onClick={() => handleMenuSelection(item.id)}
              aria-label={item.title}
            >
              <span className="menu-icon" aria-hidden="true">
                {renderMenuIcon(item.id)}
              </span>
              {isMenuExpanded ? (
                <span className="menu-label-wrap">
                  <strong>{item.title}</strong>
                  {item.id === 'VendeAI' ? <span>Parceria Vende.AI</span> : null}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </nav>
    )
  }

  return (
    <div className="app-shell">
      <div className="background-orbit" aria-hidden="true">
        <div className="orbit-node orbit-node-a">
          <div className="background-layer background-layer-a" />
        </div>
        <div className="orbit-node orbit-node-b">
          <div className="background-layer background-layer-b" />
        </div>
      </div>
      <div className="background-layer background-layer-c" aria-hidden="true" />

      <main className="kiosk-frame">
        <header className="topbar compact-topbar">
          <div className="topbar-start" aria-hidden="true">
            <img src={compactLogoSrc} alt="" className="topbar-mini-logo" />
          </div>

          <div className="brand-lockup compact-brand-lockup">
            <span className="brand-wordmark" aria-label="Presenca">
              Presença
            </span>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            <span className={`theme-icon-stack ${theme === 'light' ? 'is-light' : 'is-dark'}`} aria-hidden="true">
              <span className="theme-icon theme-icon-sun">
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="12" cy="12" r="4.1" />
                  <path d="M12 2.75v2.1M12 19.15v2.1M2.75 12h2.1M19.15 12h2.1M5.46 5.46l1.48 1.48M17.06 17.06l1.48 1.48M18.54 5.46l-1.48 1.48M6.94 17.06l-1.48 1.48" />
                </svg>
              </span>
              <span className="theme-icon theme-icon-moon">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M14.25 3.5a8.75 8.75 0 1 0 6.25 15.58A9.5 9.5 0 1 1 14.25 3.5Z" />
                </svg>

              </span>
            </span>
          </button>
        </header>

        {currentScreen === 'home' ? (
          <section key="home-screen" className={`screen-panel screen-panel-home slide-${transitionDirection}`}>
            <section className="notice-strip glass-panel" role="status" aria-live="polite">
              <p>Toque em um dos botoes abaixo para iniciar.</p>
            </section>

            <section className="home-stack">
              {renderSideMenu()}

              <section className="home-carousel glass-panel" aria-label="Carrossel de destaques">
                <div className="home-story-progress" aria-hidden="true">
                  {homeSlideImages.map((_, index) => {
                    const width =
                      index < activeHomeSlide ? 100 : index === activeHomeSlide ? homeSlideProgress : 0

                    return (
                      <span key={`home-progress-${index}`} className="story-progress-track">
                        <span className="story-progress-fill" style={{ width: `${width}%` }} />
                      </span>
                    )
                  })}
                </div>

                <article className="home-carousel-slide">
                  <button
                    type="button"
                    className="story-touch-zone story-touch-zone-left"
                    onClick={showPreviousHomeSlide}
                    aria-label="Voltar banner"
                  />
                  <button
                    type="button"
                    className="story-touch-zone story-touch-zone-right"
                    onClick={showNextHomeSlide}
                    aria-label="Avancar banner"
                  />

                  {homeSlideImages.map((src, index) => (
                    <img
                      key={src}
                      className={`home-carousel-media${index === activeHomeSlide ? ' is-active' : ''}`}
                      src={src}
                      alt={`Banner de destaque ${index + 1}`}
                      loading="eager"
                    />
                  ))}
                </article>
                <p className="story-touch-hint">Toque na esquerda para voltar · direita para avançar</p>
              </section>
            </section>
          </section>
        ) : (
          <section key={`detail-${activeMenu}`} className={`screen-panel screen-panel-detail slide-${transitionDirection}`}>
            <section className="home-stack detail-stack">
              {renderSideMenu()}

              <section className="content-grid minimal-content-grid">
                <article className="content-panel glass-panel spotlight-panel simplified-panel">
                <div className="detail-topbar">
                  <button type="button" className="back-button" onClick={goBackToHome}>
                    Voltar ao menu
                  </button>
                  <div className="panel-heading">
                    <p className="eyebrow">Selecionado</p>
                    <h2>{activeMenu}</h2>
                  </div>
                </div>

                {activeMenu === 'Depoimentos' ? (
                  <div className="stories-module">
                    <div className="story-progress" aria-hidden="true">
                      {testimonialImages.map((_, index) => {
                        const width =
                          index < activeStory ? 100 : index === activeStory ? storyProgress : 0

                        return (
                          <span key={`story-progress-${index}`} className="story-progress-track">
                            <span className="story-progress-fill" style={{ width: `${width}%` }} />
                          </span>
                        )
                      })}
                    </div>

                    <div className="story-card glass-card">
                      <button
                        type="button"
                        className="story-touch-zone story-touch-zone-left"
                        onClick={showPreviousStory}
                        aria-label="Voltar depoimento"
                      />
                      <button
                        type="button"
                        className="story-touch-zone story-touch-zone-right"
                        onClick={showNextStory}
                        aria-label="Avancar depoimento"
                      />

                      {testimonialImages.length > 0 ? (
                        testimonialImages.map((src, index) => (
                          <img
                            key={src}
                            className={`story-image${index === activeStory ? ' is-active' : ''}`}
                            src={src}
                            alt={`Depoimento ${index + 1}`}
                            loading="eager"
                          />
                        ))
                      ) : (
                        <p className="panel-note">Nenhuma imagem encontrada em assets/depoimentos.</p>
                      )}
                    </div>

                    <p className="story-touch-hint">Toque na esquerda para voltar · direita para avançar</p>
                  </div>
                ) : activeMenu === 'Portfolio' ? (
                  <div className="portfolio-shell">
                    <div className="portfolio-grid" role="list" aria-label="Opcoes de portfolio">
                      {portfolioOptions.map((option) => (
                        <button key={option} type="button" className="portfolio-option" role="listitem">
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : activeMenu === 'Plataforma' ? (
                  <div className="platform-shell">
                    <div
                      className="platform-frame-wrap glass-card"
                      ref={platformWrapRef}
                      style={{ height: `${Math.round(800 * platformScale)}px` }}
                    >
                      <iframe
                        className="platform-frame"
                        src="https://portal.soupresenca.com.br"
                        title="Portal Sou Presenca"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{
                          width: '1280px',
                          height: '800px',
                          transform: `scale(${platformScale})`,
                          transformOrigin: 'top left',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => window.open('https://portal.soupresenca.com.br', '_blank', 'noopener,noreferrer')}
                    >
                      Abrir em nova janela
                    </button>
                  </div>
                ) : activeMenu === 'Tecnologias' ? (
                  <div className="stories-module">
                    <div className="story-progress" aria-hidden="true">
                      {techImages.map((_, index) => {
                        const width =
                          index < activeTechSlide ? 100 : index === activeTechSlide ? techSlideProgress : 0
                        return (
                          <span key={`tech-progress-${index}`} className="story-progress-track">
                            <span className="story-progress-fill" style={{ width: `${width}%` }} />
                          </span>
                        )
                      })}
                    </div>

                    <div className="story-card glass-card">
                      <button
                        type="button"
                        className="story-touch-zone story-touch-zone-left"
                        onClick={showPreviousTechSlide}
                        aria-label="Voltar slide"
                      />
                      <button
                        type="button"
                        className="story-touch-zone story-touch-zone-right"
                        onClick={showNextTechSlide}
                        aria-label="Avancar slide"
                      />
                      {techImages.map((src, index) => (
                        <img
                          key={src}
                          className={`story-image${index === activeTechSlide ? ' is-active' : ''}`}
                          src={src}
                          alt={`Tecnologia ${index + 1}`}
                          loading="eager"
                        />
                      ))}
                    </div>

                    <p className="story-touch-hint">Toque na esquerda para voltar · direita para avançar</p>
                  </div>
                ) : (
                  <div className="placeholder-stack">
                    <p>Espaco reservado para o submenu e o conteudo que voce vai me passar depois.</p>
                  </div>
                )}
                </article>
              </section>
            </section>

            {shouldShowIdlePopup ? (
              <>
                <div className="idle-overlay" aria-hidden="true" />
                <div className="idle-popup" role="dialog" aria-live="assertive" aria-label="Aviso de inatividade">
                  <p className="idle-popup-title">Ainda está aí?</p>
                  <p className="idle-popup-body">
                    Voltando ao menu em <strong>{idleClock}</strong>.
                  </p>
                  <button type="button" className="idle-popup-button" onClick={keepSessionAlive}>
                    Ainda estou aqui
                  </button>
                </div>
              </>
            ) : null}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
