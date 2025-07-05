# 🌟 Dashboard Sistémico Eudaimónico

## Visão Geral

O Dashboard Sistémico é o "espelho da alma" do nosso ecossistema energético Eudaimónico. Não apenas mostra dados, mas reflete a interconnexão e saúde dos princípios fundamentais da Engenharia Eudaimónica.

## 🧬 Princípios Eudaimónicos Implementados

### 1. 🛡️ Autopoiese - Medidor de Resiliência
- **Objetivo**: Medir a capacidade de auto-regeneração do sistema
- **Componente**: `ResilienceGauge`
- **Métricas**:
  - Uptime do contrato
  - Membros ativos vs. suspensos
  - Estabilidade da rede
  - Saúde autopoiética geral

### 2. 🤝 Simbiose - Índice de Equidade
- **Objetivo**: Visualizar a distribuição harmoniosa de recursos
- **Componente**: `EquityIndex`
- **Métricas**:
  - Coeficiente de Gini
  - Saldo médio vs. mediano
  - Estado da distribuição (equilibrada/concentrada/crítica)
  - Diferença média-mediana

### 3. 🧠 Metacognição - Feed de Atividade da Governança
- **Objetivo**: Mostrar a consciência coletiva em ação
- **Componente**: `GovernanceActivity`
- **Funcionalidades**:
  - Taxa de participação em votações
  - Propostas ativas e recentes
  - Nível de consenso
  - Feed de eventos em tempo real

### 4. ⚡ Ressonância Semântica - Painel de Ação Pessoal
- **Objetivo**: Interface do utilizador com o ecossistema
- **Componente**: `PersonalActionPanel`
- **Ações Disponíveis**:
  - Reportar produção de energia
  - Criar e votar em propostas
  - Transferir créditos de energia
  - Doar créditos de votação
  - Votação quadrática com intensidade

## 🏗️ Arquitetura Técnica

### Estrutura de Pastas
```
src/
├── app/
│   └── page.tsx              # Página principal do Dashboard
├── components/
│   ├── dashboard/            # Componentes específicos do Dashboard
│   │   ├── ResilienceGauge.tsx
│   │   ├── EquityIndex.tsx
│   │   ├── GovernanceActivity.tsx
│   │   ├── PersonalActionPanel.tsx
│   │   └── SystemPulse.tsx
│   └── ui/                   # Componentes de UI reutilizáveis
│       └── ConnectWallet.tsx
├── services/
│   └── blockchainService.ts  # Serviço de interação com blockchain
└── types/
    └── energyGrid.ts         # Tipos TypeScript
```

### Stack Tecnológico
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: Viem + Wagmi
- **TypeScript**: Para tipagem robusta
- **Estado**: React Hooks (useState, useEffect)

## 🔄 Filosofia de Design

### Estados de UI (Autopoiese)
- **Loading**: Feedback claro durante operações
- **Success**: Confirmação visual de sucesso
- **Error**: Mensagens de erro compreensíveis
- **Idle**: Estado de repouso transparente

### Paleta de Cores Semânticas
- **Emerald/Green**: Autopoiese, saúde, energia
- **Cyan/Blue**: Simbiose, equidade, harmonia
- **Purple/Indigo**: Metacognição, governança
- **Amber/Orange**: Ressonância, ação, poder pessoal

### Feedback Responsivo
- Animações sutis que "respiram" com o sistema
- Pulso visual indicando saúde sistémica
- Transições suaves entre estados
- Tooltips informativos e educativos

## 🔗 Integração com Blockchain

### Serviços Implementados
```typescript
// Leitura de dados
- getMemberInfo(address)
- getSystemStats()
- getProposal(proposalId)
- calculateSystemHealth()

// Ações de escrita
- registerMember()
- reportEnergyProduction(amount)
- transferCredits(to, amount)
- createProposal(description)
- voteQuadratic(proposalId, support, intensity)
- donateVotingCredits(to, amount)
```

### Gestão de Estado
- Sincronização automática com blockchain
- Subscrição de eventos em tempo real
- Cache inteligente de dados
- Atualização periódica de métricas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- MetaMask ou wallet compatível
- Acesso à rede blockchain (localhost/testnet)

### Instalação
```bash
cd eudaimonic-dashboard
npm install
```

### Configuração
1. Configure o endereço do contrato em `blockchainService.ts`
2. Ajuste a rede blockchain conforme necessário
3. Configure variáveis de ambiente se necessário

### Execução
```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🔮 Funcionalidades Avançadas

### Pulso Sistémico
O componente `SystemPulse` calcula a saúde geral do sistema:
- Combina métricas dos 4 princípios Eudaimónicos
- Animação visual baseada na saúde
- Tooltip detalhado com breakdown de métricas

### Votação Quadrática
- Interface intuitiva para intensidade de voto
- Cálculo automático de custo (intensidade²)
- Feedback visual do impacto da escolha

### Eventos em Tempo Real
- Feed de atividade em tempo real
- Categorização por tipo e impacto
- Histórico de eventos recentes

## 🔧 Próximas Melhorias

### Funcionalidades Futuras
- [ ] Gráficos e visualizações avançadas
- [ ] Notificações push para eventos importantes
- [ ] Dashboard personalizado por utilizador
- [ ] Modo escuro/claro
- [ ] Suporte multi-idioma

### Optimizações
- [ ] Caching avançado com React Query
- [ ] Lazy loading de componentes
- [ ] Optimização de re-renders
- [ ] Compressão de imagens e assets

## 📚 Filosofia Eudaimónica

Este Dashboard não é apenas uma interface - é uma manifestação dos valores da Engenharia Eudaimónica:

1. **Transparência**: Todas as métricas são claras e auditáveis
2. **Participação**: Interface acessível para todas as ações
3. **Consciência**: Feedback educativo sobre o impacto das ações
4. **Harmonia**: Design que reflete o equilíbrio sistémico
5. **Evolução**: Adaptabilidade e crescimento contínuo

---

*"Onde a tecnologia encontra a sabedoria, e a energia flui em harmonia"*
