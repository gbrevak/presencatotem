import { useEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import conveniosLight from './assets/convenios-publicos/Conv\u00eanios ativos edt 30.03 1.jpg'
import conveniosDark from './assets/convenios-publicos/Conv\u00eanios ativos edt 30.03 2.jpg'
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

const portfolioOptions = ['CLT', 'INSS', 'FGTS Pay', 'SIAPE', 'Convênios Públicos']

type PortfolioOption = typeof portfolioOptions[number]

type PortfolioSubEntry = { title: string; qrUrl?: string; qrLabel?: string; imageSrc?: { light: string; dark: string }; fields: { label: string; value: string; icon: React.ReactNode }[] }
const portfolioData: Record<string, { title: string; qrUrl?: string; qrLabel?: string; imageSrc?: { light: string; dark: string }; fields?: { label: string; value: string; icon: React.ReactNode }[]; subOptions?: Record<string, PortfolioSubEntry> }> = {
  CLT: {
    title: 'Roteiro Operacional CLT',
    qrUrl: 'https://convenios.grupopresenca.com.br/Roteiros',
    fields: [
      {
        label: 'Idade Mínima',
        value: '21 anos',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" /></svg>,
      },
      {
        label: 'Idade Máxima',
        value: '58 anos',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Zm9-5.5h3.5v1.5H14v-3.5h1.5v2Z" /></svg>,
      },
      {
        label: 'Parcela Mínima',
        value: 'R$\u00a0100,00',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm.75 14.5v1h-1.5v-1.05A3.5 3.5 0 0 1 8.5 13h1.5a2 2 0 0 0 2 2h.25a1.75 1.75 0 0 0 0-3.5h-.5a3.25 3.25 0 0 1 0-6.5V4h1.5v1.05A3.5 3.5 0 0 1 15.5 8.5H14a2 2 0 0 0-2-2h-.25a1.25 1.25 0 0 0 0 2.5h.5a3.25 3.25 0 0 1 .5 6.45Z" /></svg>,
      },
      {
        label: 'Valor Mínimo',
        value: 'R$\u00a0800,00',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" /></svg>,
      },
      {
        label: 'Valor Máximo',
        value: 'R$\u00a015.000,00',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg>,
      },
      {
        label: 'Prazo',
        value: 'até 36x',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8 2.75a.75.75 0 0 1 1.5 0V4h5V2.75a.75.75 0 0 1 1.5 0V4h1.5A2.5 2.5 0 0 1 20 6.5v13A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-13A2.5 2.5 0 0 1 6.5 4H8V2.75ZM5.5 9v10.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V9h-13Zm3.25 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-6.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>,
      },
      {
        label: 'Taxa',
        value: '5,99% a 7,99% a.m.',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm10.5 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM19 5 5 19l1.06 1.06L20.06 6.06 19 5Z" /></svg>,
      },
      {
        label: 'Margem',
        value: '70% da margem disponível',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 0 16V4Zm0 2v3.5l3 1.75-.75 1.3L11 10.7V6h1Z" /></svg>,
      },
    ],
  },
  'FGTS Pay': {
    title: 'FGTS Pay — Plataforma White Label',
    qrUrl: 'https://www.soupresenca.com.br/produtos/fgts-pay',
    qrLabel: 'Saiba mais',
    fields: [
      {
        label: 'O que é',
        value: 'Plataforma white label para aceitar FGTS como pagamento',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm1 5v2h-2V7h2Zm0 4v6h-2v-6h2Z" /></svg>,
      },
      {
        label: 'Público',
        value: 'Lojistas de todos os portes',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H2Zm13.5-9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5 2h-1a5 5 0 0 1 5 5h-7v2h9a7 7 0 0 0-6-6.96V13Z" /></svg>,
      },
      {
        label: 'Taxa por transação',
        value: 'Sem taxas sobre as vendas',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm10.5 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM19 5 5 19l1.06 1.06L20.06 6.06 19 5Z" /></svg>,
      },
      {
        label: 'Pagamento ao lojista',
        value: 'À vista, no ato da transação',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm.75 14.5v1h-1.5v-1.05A3.5 3.5 0 0 1 8.5 13h1.5a2 2 0 0 0 2 2h.25a1.75 1.75 0 0 0 0-3.5h-.5a3.25 3.25 0 0 1 0-6.5V4h1.5v1.05A3.5 3.5 0 0 1 15.5 8.5H14a2 2 0 0 0-2-2h-.25a1.25 1.25 0 0 0 0 2.5h.5a3.25 3.25 0 0 1 .5 6.45Z" /></svg>,
      },
      {
        label: 'Remuneração',
        value: 'Receba por cada operação realizada via FGTS Pay',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg>,
      },
      {
        label: 'Identidade visual',
        value: '100% personalizada com a marca do parceiro',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 3C9.24 3 7 5.24 7 8c0 2.57 1.93 4.7 4.43 4.97l-5.19 5.18A1.5 1.5 0 0 0 7.3 20.6L12 15.9l4.7 4.7a1.5 1.5 0 0 0 1.06-2.55L12.57 12.97C15.07 12.7 17 10.57 17 8c0-2.76-2.24-5-5-5Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" /></svg>,
      },
      {
        label: 'Integração',
        value: 'API aberta + plataforma web white label',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8.7 15.3 5.4 12l3.3-3.3-1.4-1.4L2.6 12l4.7 4.7 1.4-1.4Zm6.6 0 3.3-3.3-3.3-3.3 1.4-1.4 4.7 4.7-4.7 4.7-1.4-1.4Zm-2.35 1.07-1.93-.74 2.28-6 1.93.74-2.28 6Z" /></svg>,
      },
      {
        label: 'Suporte',
        value: 'Treinamento inicial + acompanhamento contínuo',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm-1 6h2v2h-2V8Zm0 4h2v6h-2v-6Z" /></svg>,
      },
    ],
  },
  SIAPE: {
    title: 'Consignado SIAPE',
    qrUrl: 'https://www.soupresenca.com.br/produtos/siape',
    qrLabel: 'Saiba mais',
    fields: [
      {
        label: 'Público',
        value: 'Servidores públicos federais',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H2Zm13.5-9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5 2h-1a5 5 0 0 1 5 5h-7v2h9a7 7 0 0 0-6-6.96V13Z" /></svg>,
      },
      {
        label: 'Desconto',
        value: 'Automático em folha de pagamento',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg>,
      },
      {
        label: 'Inadimplência',
        value: 'Zero — maior segurança do mercado',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-2 14.5-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8Z" /></svg>,
      },
      {
        label: 'Taxa',
        value: 'Condições especiais para servidores',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm10.5 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM19 5 5 19l1.06 1.06L20.06 6.06 19 5Z" /></svg>,
      },
      {
        label: 'Processo',
        value: '100% digital com aprovação rápida',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8 2.75a.75.75 0 0 1 1.5 0V4h5V2.75a.75.75 0 0 1 1.5 0V4h1.5A2.5 2.5 0 0 1 20 6.5v13A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-13A2.5 2.5 0 0 1 6.5 4H8V2.75ZM5.5 9v10.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V9h-13Zm3.25 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-6.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>,
      },
      {
        label: 'Autocontratação',
        value: 'Link white label personalizado com sua marca',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 3C9.24 3 7 5.24 7 8c0 2.57 1.93 4.7 4.43 4.97l-5.19 5.18A1.5 1.5 0 0 0 7.3 20.6L12 15.9l4.7 4.7a1.5 1.5 0 0 0 1.06-2.55L12.57 12.97C15.07 12.7 17 10.57 17 8c0-2.76-2.24-5-5-5Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" /></svg>,
      },
      {
        label: 'Integração',
        value: 'API completa para seus sistemas',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8.7 15.3 5.4 12l3.3-3.3-1.4-1.4L2.6 12l4.7 4.7 1.4-1.4Zm6.6 0 3.3-3.3-3.3-3.3 1.4-1.4 4.7 4.7-4.7 4.7-1.4-1.4Zm-2.35 1.07-1.93-.74 2.28-6 1.93.74-2.28 6Z" /></svg>,
      },
      {
        label: 'Suporte',
        value: 'Treinamento e acompanhamento especializado no setor público',
        icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm-1 6h2v2h-2V8Zm0 4h2v6h-2v-6Z" /></svg>,
      },
    ],
  },
  'Conv\u00eanios P\u00fablicos': {
    title: 'Conv\u00eanios P\u00fablicos',
    qrUrl: 'https://convenios.grupopresenca.com.br/Roteiros',
    imageSrc: { light: conveniosLight, dark: conveniosDark },
    fields: [],
  },
  INSS: {
    title: 'INSS',
    subOptions: {
      'Novo': {
        title: 'Roteiro Operacional INSS \u2014 Novo',
        qrUrl: 'https://convenios.grupopresenca.com.br/Roteiros',
        fields: [
          { label: 'Idade M\u00ednima', value: '20 anos', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" /></svg> },
          { label: 'Idade M\u00e1xima', value: '62 anos', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Zm9-5.5h3.5v1.5H14v-3.5h1.5v2Z" /></svg> },
          { label: 'Parcela M\u00ednima', value: 'R$\u00a060,00', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm.75 14.5v1h-1.5v-1.05A3.5 3.5 0 0 1 8.5 13h1.5a2 2 0 0 0 2 2h.25a1.75 1.75 0 0 0 0-3.5h-.5a3.25 3.25 0 0 1 0-6.5V4h1.5v1.05A3.5 3.5 0 0 1 15.5 8.5H14a2 2 0 0 0-2-2h-.25a1.25 1.25 0 0 0 0 2.5h.5a3.25 3.25 0 0 1 .5 6.45Z" /></svg> },
          { label: 'Valor M\u00ednimo', value: 'R$\u00a0500,00', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" /></svg> },
          { label: 'Valor M\u00e1ximo', value: 'R$\u00a015.000,00', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg> },
          { label: 'Prazo', value: 'at\u00e9 36x', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8 2.75a.75.75 0 0 1 1.5 0V4h5V2.75a.75.75 0 0 1 1.5 0V4h1.5A2.5 2.5 0 0 1 20 6.5v13A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-13A2.5 2.5 0 0 1 6.5 4H8V2.75ZM5.5 9v10.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V9h-13Zm3.25 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-6.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg> },
          { label: 'Taxa', value: '6,99% a.m.', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm10.5 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM19 5 5 19l1.06 1.06L20.06 6.06 19 5Z" /></svg> },
          { label: 'Margem', value: '70% da margem dispon\u00edvel', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 0 16V4Zm0 2v3.5l3 1.75-.75 1.3L11 10.7V6h1Z" /></svg> },
        ],
      },
      'Cart\u00e3o Benef\u00edcio': {
        title: 'Roteiro Operacional INSS \u2014 Cart\u00e3o Benef\u00edcio',
        qrUrl: 'https://convenios.grupopresenca.com.br/Roteiros',
        fields: [
          { label: 'Idade M\u00ednima', value: '21 anos', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Z" /></svg> },
          { label: 'Idade M\u00e1xima', value: '70 anos', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0H5Zm9-5.5h3.5v1.5H14v-3.5h1.5v2Z" /></svg> },
          { label: 'Prazo', value: '96x', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M8 2.75a.75.75 0 0 1 1.5 0V4h5V2.75a.75.75 0 0 1 1.5 0V4h1.5A2.5 2.5 0 0 1 20 6.5v13A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-13A2.5 2.5 0 0 1 6.5 4H8V2.75ZM5.5 9v10.5c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V9h-13Zm3.25 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm-6.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3.25 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg> },
          { label: 'Valor M\u00ednimo', value: 'R$\u00a0400,00', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6Z" /></svg> },
          { label: 'Valor M\u00e1ximo', value: 'conforme margem dispon\u00edvel', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm3.5 1a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Zm0 4a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" /></svg> },
          { label: 'Taxa', value: '2,46% ao m\u00eas', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M5.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Zm10.5 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM19 5 5 19l1.06 1.06L20.06 6.06 19 5Z" /></svg> },
          { label: 'Parcela M\u00ednima', value: 'R$\u00a030,00', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm.75 14.5v1h-1.5v-1.05A3.5 3.5 0 0 1 8.5 13h1.5a2 2 0 0 0 2 2h.25a1.75 1.75 0 0 0 0-3.5h-.5a3.25 3.25 0 0 1 0-6.5V4h1.5v1.05A3.5 3.5 0 0 1 15.5 8.5H14a2 2 0 0 0-2-2h-.25a1.25 1.25 0 0 0 0 2.5h.5a3.25 3.25 0 0 1 .5 6.45Z" /></svg> },
          { label: 'P\u00fablico', value: 'Aposentados e Pensionistas', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0H2Zm13.5-9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5 2h-1a5 5 0 0 1 5 5h-7v2h9a7 7 0 0 0-6-6.96V13Z" /></svg> },
          { label: 'Margem', value: '5% (70% saque e 30% compra)', icon: <svg viewBox="0 0 24 24" role="presentation"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2Zm0 2a8 8 0 0 1 0 16V4Zm0 2v3.5l3 1.75-.75 1.3L11 10.7V6h1Z" /></svg> },
        ],
      },
    },
  },
}

type TestimonialItem = { type: 'image'; src: string } | { type: 'video'; src: string }

const _testimonialImageEntries = Object.entries(
  import.meta.glob('./assets/depoimentos/*.png', { eager: true, import: 'default' }) as Record<string, string>
).map(([path, src]) => ({ path, type: 'image' as const, src }))

const _testimonialVideoEntries = Object.entries(
  import.meta.glob('./assets/depoimentos/*.mp4', { eager: true, import: 'default' }) as Record<string, string>
).map(([path, src]) => ({ path, type: 'video' as const, src }))

const testimonialItems: TestimonialItem[] = [
  ..._testimonialImageEntries,
  ..._testimonialVideoEntries,
].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
  .map(({ type, src }) => ({ type, src }))

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
  const [activePortfolioOption, setActivePortfolioOption] = useState<PortfolioOption | null>(null)
  const [activePortfolioSubOption, setActivePortfolioSubOption] = useState<string | null>(null)
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail'>('home')
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'back'>('forward')
  const [idleSecondsLeft, setIdleSecondsLeft] = useState(idleTimeoutSeconds)
  const [platformScale, setPlatformScale] = useState(1)
  const platformWrapRef = useRef<HTMLDivElement>(null)
  const [vendeaiScale, setVendeaiScale] = useState(1)
  const vendeaiWrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
    if (activeMenu !== 'VendeAI') return
    const el = vendeaiWrapRef.current
    if (!el) return
    const update = () => setVendeaiScale(el.clientWidth / 1280)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [activeMenu])

  useEffect(() => {
    if (currentScreen !== 'detail' || activeMenu !== 'Depoimentos' || testimonialItems.length === 0) {
      return undefined
    }
    // Video slides drive their own progress via onTimeUpdate/onEnded
    if (testimonialItems[activeStory]?.type === 'video') return undefined

    let progress = 0

    const intervalId = window.setInterval(() => {
      progress = Math.min(progress + storyStep, 100)

      if (progress >= 100) {
        progress = 0
        setStoryProgress(0)
        setActiveStory((currentStory) => (currentStory + 1) % testimonialItems.length)
      } else {
        setStoryProgress(progress)
      }
    }, storyTickMs)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [activeMenu, currentScreen, activeStory])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const item = testimonialItems[activeStory]
    if (currentScreen === 'detail' && activeMenu === 'Depoimentos' && item?.type === 'video') {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [activeStory, activeMenu, currentScreen])

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
      currentStory === 0 ? testimonialItems.length - 1 : currentStory - 1,
    )
  }

  function showNextStory() {
    setStoryProgress(0)
    setActiveStory((currentStory) => (currentStory + 1) % testimonialItems.length)
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
          <svg viewBox="0 0 24 24" role="presentation" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* ⌘ Command-style symbol: four loops connected by a center square */}
            <rect x="9" y="9" width="6" height="6" rx="1" />
            <path d="M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9Z" />
            <path d="M15 9V6.5A2.5 2.5 0 1 1 17.5 9H15Z" />
            <path d="M9 15v2.5A2.5 2.5 0 1 1 6.5 15H9Z" />
            <path d="M15 15v2.5A2.5 2.5 0 1 0 17.5 15H15Z" />
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

  const _activePortfolioEntry = activePortfolioOption ? portfolioData[activePortfolioOption] : null
  const activeDetailEntry: PortfolioSubEntry | null =
    _activePortfolioEntry
      ? activePortfolioSubOption && _activePortfolioEntry.subOptions?.[activePortfolioSubOption]
        ? _activePortfolioEntry.subOptions[activePortfolioSubOption]
        : _activePortfolioEntry.fields
          ? (_activePortfolioEntry as PortfolioSubEntry)
          : null
      : null

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
                {activeMenu === 'Portfolio' && activeDetailEntry ? (
                  <div className="portfolio-full-header">
                    <div className="portfolio-full-header-left">
                      <button type="button" className="back-button" onClick={goBackToHome}>
                        Voltar ao menu
                      </button>
                      <div className="panel-heading">
                        <p className="eyebrow">Selecionado</p>
                        <h2>{activeMenu}</h2>
                      </div>
                      <button
                        type="button"
                        className="back-button"
                        onClick={() => { setActivePortfolioOption(null); setActivePortfolioSubOption(null) }}
                      >
                        ← Voltar ao portfólio
                      </button>
                      {activePortfolioSubOption && (
                        <button
                          type="button"
                          className="back-button"
                          onClick={() => setActivePortfolioSubOption(null)}
                        >
                          ← Voltar ao {_activePortfolioEntry?.title}
                        </button>
                      )}
                      <h3 className="portfolio-detail-title">{activeDetailEntry.title}</h3>
                    </div>
                    {activeDetailEntry.qrUrl && (
                      <div className="portfolio-qr-wrap">
                        <QRCodeSVG
                          value={activeDetailEntry.qrUrl}
                          size={148}
                          className="portfolio-qr"
                          bgColor="transparent"
                          fgColor="currentColor"
                        />
                        <span className="portfolio-qr-label">{activeDetailEntry.qrLabel ?? 'Acessar roteiro'}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="detail-topbar">
                    <button type="button" className="back-button" onClick={goBackToHome}>
                      Voltar ao menu
                    </button>
                    <div className="panel-heading">
                      <p className="eyebrow">Selecionado</p>
                      <h2>{activeMenu}</h2>
                    </div>
                  </div>
                )}

                {activeMenu === 'Depoimentos' ? (
                  <div className="stories-module">
                    <div className="story-progress" aria-hidden="true">
                      {testimonialItems.map((_, index) => {
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

                      {testimonialItems.length > 0 ? (
                        testimonialItems.map((item, index) =>
                          item.type === 'video' ? (
                            <video
                              key={item.src}
                              ref={videoRef}
                              className={`story-image${index === activeStory ? ' is-active' : ''}`}
                              src={item.src}
                              muted
                              playsInline
                              onTimeUpdate={(e) => {
                                const v = e.currentTarget
                                if (v.duration) setStoryProgress((v.currentTime / v.duration) * 100)
                              }}
                              onEnded={() => {
                                setStoryProgress(0)
                                setActiveStory((s) => (s + 1) % testimonialItems.length)
                              }}
                            />
                          ) : (
                            <img
                              key={item.src}
                              className={`story-image${index === activeStory ? ' is-active' : ''}`}
                              src={item.src}
                              alt={`Depoimento ${index + 1}`}
                              loading="eager"
                            />
                          )
                        )
                      ) : (
                        <p className="panel-note">Nenhuma imagem encontrada em assets/depoimentos.</p>
                      )}
                    </div>

                    <p className="story-touch-hint">Toque na esquerda para voltar · direita para avançar</p>
                  </div>
                ) : activeMenu === 'Portfolio' ? (
                  activeDetailEntry ? (
                    activeDetailEntry.imageSrc ? (
                      <img
                        src={theme === 'light' ? activeDetailEntry.imageSrc.light : activeDetailEntry.imageSrc.dark}
                        alt={activeDetailEntry.title}
                        className="convenios-image"
                      />
                    ) : (
                    <div className="portfolio-detail-grid">
                      {activeDetailEntry.fields.map(({ label, value, icon }) => (
                        <div key={label} className="portfolio-detail-row">
                          <span className="portfolio-detail-label">
                            <span className="portfolio-detail-icon" aria-hidden="true">{icon}</span>
                            {label}
                          </span>
                          <span className="portfolio-detail-value">{value}</span>
                        </div>
                      ))}
                    </div>
                    )
                  ) : activePortfolioOption && _activePortfolioEntry?.subOptions ? (
                    <div className="portfolio-shell">
                      <button
                        type="button"
                        className="back-button"
                        onClick={() => setActivePortfolioOption(null)}
                      >
                        ← Voltar ao portfólio
                      </button>
                      <h3 className="portfolio-detail-title">{_activePortfolioEntry.title}</h3>
                      <div className="portfolio-grid" role="list" aria-label={`Sub-op\u00e7\u00f5es de ${activePortfolioOption}`}>
                        {Object.keys(_activePortfolioEntry.subOptions).map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            className="portfolio-option"
                            role="listitem"
                            onClick={() => setActivePortfolioSubOption(sub)}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="portfolio-shell">
                      <div className="portfolio-grid" role="list" aria-label="Opcoes de portfolio">
                        {portfolioOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className="portfolio-option"
                            role="listitem"
                            onClick={() => { setActivePortfolioSubOption(null); setActivePortfolioOption(option) }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                ) : activeMenu === 'Plataforma' ? (
                  <div className="platform-shell">
                    <div
                      className="platform-frame-wrap glass-card"
                      ref={platformWrapRef}
                      style={{ height: `${Math.round(800 * platformScale)}px` }}
                    >
                      <iframe
                        className="platform-frame"
                        src="https://portal-hml.presencabank.com.br/sign-in?redirectURL=%2Fdashboards"
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
                ) : activeMenu === 'VendeAI' ? (
                  <div className="platform-shell">
                    <div
                      className="platform-frame-wrap glass-card"
                      ref={vendeaiWrapRef}
                      style={{ height: `${Math.round(800 * vendeaiScale)}px` }}
                    >
                      <iframe
                        className="platform-frame"
                        src="https://app.vendeaitecnologia.com.br/fair-dashboard"
                        title="VendeAI"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        style={{
                          width: '1280px',
                          height: '800px',
                          transform: `scale(${vendeaiScale})`,
                          transformOrigin: 'top left',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => window.open('https://app.vendeaitecnologia.com.br/fair-dashboard', '_blank', 'noopener,noreferrer')}
                    >
                      Abrir em nova janela
                    </button>
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
