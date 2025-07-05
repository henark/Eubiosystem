# 🌟 Engenharia Eudaimónica - Ecossistema Energético Descentralizado

## Visão Geral

Este repositório contém a implementação completa de um sistema de Engenharia Eudaimónica - um ecossistema energético descentralizado que demonstra os quatro princípios fundamentais através de código funcional e filosofia aplicada.

## 🧬 Os Quatro Princípios Implementados

### 🛡️ Autopoiese - Capacidade de Auto-Regeneração
Sistema com circuit breakers, retry automático e recuperação de falhas

### 🤝 Simbiose - Harmonia e Equidade Distributiva  
Precificação dinâmica, índice de equidade e redistribuição equilibrada

### 🧠 Metacognição - Consciência Coletiva
Governança transparente, logging estruturado e métricas de participação

### ⚡ Ressonância Semântica - Significado em Ação
Votação quadrática, interface intuitiva e feedback imediato

## 🏗️ Componentes do Sistema

### 📄 `EnergyGridDAO.sol` (599 linhas)
Smart contract Solidity com:
- Sistema de membros autopoiético
- Precificação dinâmica baseada em equidade
- Governança com votação quadrática
- Circuit breakers e validação plausível

### 🖥️ `eudaimonic-dashboard/`
Interface React/Next.js com:
- Dashboard da saúde sistémica
- Componentes para cada princípio Eudaimónico
- Integração blockchain robusta
- Estados de UI autopoiéticos

### 🔌 `eudaimonic-iot-backend/`
Servidor Node.js/Express com:
- Backend seguro para sensores IoT
- Validação plausível de dados
- Retry automático para resiliência
- Logging estruturado para metacognição

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Blockchain local (Hardhat/Ganache) ou testnet
- MetaMask ou wallet compatível

### Quick Start
```bash
# 1. Deploy do Smart Contract
# Compilar e fazer deploy do EnergyGridDAO.sol

# 2. Backend IoT
cd eudaimonic-iot-backend
npm install && cp .env.example .env
# Editar .env com configurações
npm run dev

# 3. Dashboard
cd eudaimonic-dashboard  
npm install
# Atualizar CONTRACT_ADDRESS em blockchainService.ts
npm run dev

# 4. Acessar
# Dashboard: http://localhost:3000
# API IoT: http://localhost:3001
```

## 📊 Métricas Eudaimónicas

| Princípio | Métrica | Meta |
|-----------|---------|------|
| **Autopoiese** | Uptime do Sistema | >99.5% |
| **Simbiose** | Coeficiente de Gini | <0.4 |
| **Metacognição** | Participação em Votações | >70% |
| **Ressonância** | Engagement Comunitário | 0-100 |

## 🔄 Fluxo de Dados

```
[Sensores IoT] → [Backend Seguro] → [Blockchain] → [Dashboard] → [Utilizadores]
      ↑                                   ↓
      └─────────── [Sistema de Governança] ←──────────────────────┘
```

## 📚 Documentação

- **[GOVERNANCE_LOGIC.md](GOVERNANCE_LOGIC.md)** - Análise detalhada do sistema de governança
- **[eudaimonic-dashboard/README.md](eudaimonic-dashboard/README.md)** - Dashboard sistémico
- **[ENGENHARIA_EUDAIMONICA_IMPLEMENTACAO_COMPLETA.md](ENGENHARIA_EUDAIMONICA_IMPLEMENTACAO_COMPLETA.md)** - Documentação consolidada

## 🎯 Status do Projeto

### ✅ Implementado
- [x] Smart Contract com 4 princípios Eudaimónicos
- [x] Dashboard sistémico completo
- [x] Backend IoT seguro
- [x] Integração blockchain robusta
- [x] Sistema de governança funcional

### 🔄 Próximos Passos
- [ ] Governança modular (diferentes tipos de propostas)
- [ ] Sistema de tokens duplo ($ENERGY + $EUD)
- [ ] Integração com sensores IoT reais
- [ ] Métricas avançadas de saúde sistémica

## 🧪 Filosofia em Código

Esta implementação demonstra como princípios filosóficos podem ser traduzidos em código funcional:

```typescript
// Autopoiese: Retry automático
async function withAutopoiesis<T>(operation: () => Promise<T>): Promise<T>

// Simbiose: Taxa dinâmica baseada em equidade
function _calculateDynamicFee(uint256 amount) internal view returns (uint256)

// Metacognição: Logging estruturado
interface LogEntry { component: string; action: string; impact: string; }

// Ressonância Semântica: Votação quadrática
function voteQuadratic(uint256 proposalId, bool support, uint256 intensity)
```

## 📈 Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │   Backend IoT   │    │  Smart Contract │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (Solidity)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
    ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
    │ Wallet  │              │ Sensores│              │Blockchain│
    │(MetaMask)│              │   IoT   │              │(Ethereum)│
    └─────────┘              └─────────┘              └─────────┘
```

## 🤝 Contribuição

Este projeto demonstra a implementação prática dos princípios de Engenharia Eudaimónica. Contribuições que ampliem ou melhorem a manifestação destes princípios são bem-vindas.

## 📜 Licença

MIT - Este projeto é open source para promover o desenvolvimento de sistemas que servem à florescência humana.

---

*"Onde a tecnologia encontra a sabedoria, e a energia flui em harmonia"*

**Status:** ✅ Implementação Funcional Completa  
**Versão:** 1.0.0 - Eudaimónica Fundamental
