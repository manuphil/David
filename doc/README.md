# 🎲 Winary Ball - Loterie Décentralisée sur Solana

## 📋 Description
Winary Ball est une plateforme de loterie entièrement décentralisée construite sur la blockchain Solana. Les utilisateurs participent automatiquement aux tirages en détenant le token $WBALL.

## 🔧 Prérequis

### Installation des outils
```bash
# Installer Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Installer Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Installer Anchor
npm install -g @coral-xyz/anchor-cli

# Installer Node.js et npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Configuration Solana
```bash
# Configurer pour devnet
solana config set --url devnet

# Générer une nouvelle keypair (ou utiliser existante)
solana-keygen new --outfile ~/.config/solana/id.json

# Obtenir des SOL de test
solana airdrop 2
```

## 🚀 Déploiement

### 1. Cloner et configurer le projet
```bash
git clone <votre-repo>
cd winary-ball
npm install
```

### 2. Construire le programme
```bash
anchor build
```

### 3. Déployer sur Devnet
```bash
# Déploiement automatique avec script
anchor run deploy

# Ou déploiement manuel
anchor deploy --provider.cluster devnet
```

### 4. Exécuter les tests
```bash
# Tests complets
anchor test

# Tests spécifiques
npm run test
```

## 📁 Structure du projet

```
winary-ball/
├── programs/
│   └── winary-ball/
│       ├── src/
│       │   └── lib.rs          # Smart contract principal
│       └── Cargo.toml
├── tests/
│   └── winary-ball.ts          # Tests complets
├── scripts/
│   └── deploy.ts               # Script de déploiement
├── Anchor.toml                 # Configuration Anchor
├── package.json
└── README.md
```

## 🔐 Fonctionnalités

### Token WBALL
- **Nom**: Winary Ball
- **Symbol**: WBALL
- **Decimals**: 6
- **Usage**: 1 ticket = 10,000 WBALL

### Mécanismes de loterie
- **Tirage Horaire**: 10% des achats de tokens
- **Tirage Journalier**: 5% des achats de tokens
- **Participation**: Automatique si vous détenez des WBALL
- **VRF**: Intégration Switchboard pour la randomisation

### Smart Contract Functions

```rust
// Initialiser la loterie
initialize()

// Créer le token WBALL
create_wball_token()

// Acheter des tokens WBALL
buy_wball_tokens(amount: u64)

// Enregistrer un participant
register_participant()

// Mettre à jour les tickets
update_tickets()

// Effectuer un tirage horaire
draw_hourly_winner()

// Effectuer un tirage journalier
draw_daily_winner()

// Obtenir les statistiques
get_lottery_stats()
```

## 🧪 Tests

### Tests disponibles
- ✅ Création du token WBALL
- ✅ Initialisation de la loterie
- ✅ Enregistrement des participants
- ✅ Achat de tokens
- ✅ Calcul des tickets
- ✅ Récupération des statistiques
- ✅ Flux complet de la loterie

### Exécuter les tests
```bash
# Tous les tests
anchor test

# Tests avec logs détaillés
anchor test -- --features "debug"

# Tests spécifiques
anchor test --skip-build
```

## 📊 Exemple d'utilisation

### 1. Déploiement réussi
```
🎉 DEPLOYMENT SUCCESSFUL!

📄 Deployment Summary:
╔══════════════════════════════════════════════════════════════╗
║                    WINARY BALL LOTTERY                       ║
║                   DEVNET DEPLOYMENT                          ║
╠══════════════════════════════════════════════════════════════╣
║ Program ID: WBaLL11111111111111111111111111111111111111      ║
║ WBALL Mint: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHRv      ║
║ Lottery State: 8qbHbw2BbbTHBW1sbeqakYXVKRQM8Ne7pLK7m6CVfeR9  ║
╚══════════════════════════════════════════════════════════════╝
```

### 2. Statistiques en temps réel
```
📊 Final Lottery Statistics:
  - Total participants: 2
  - Total tickets: 7
  - Hourly jackpot: 7500.0 tokens
  - Daily jackpot: 3750.0 tokens
```

## 🔗 Liens utiles

### Devnet
- **Solscan Program**: `https://solscan.io/account/PROGRAM_ID?cluster=devnet`
- **WBALL Token**: `https://solscan.io/token/MINT_ADDRESS?cluster=devnet`

### Mainnet (après déploiement)
- **Program ID**: À définir
- **WBALL Mint**: À définir

## 🛠️ Intégration Backend

### API REST (Django)
```python
# Endpoints prévus
GET /api/lottery/stats/          # Statistiques
GET /api/participants/           # Liste des participants
GET /api/draws/history/          # Historique des tirages
POST /api/participants/register/ # Enregistrer participant
PUT /api/tickets/update/         # Mettre à jour tickets
```

### WebSocket (Temps réel)
```javascript
// Connexion temps réel
const ws = new WebSocket('ws://localhost:8000/ws/lottery/');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Mettre à jour l'interface
};
```

## 🔒 Sécurité

### Audits recommandés
- [ ] Audit smart contract (Certik, Kudelski, etc.)
- [ ] Tests de sécurité backend
- [ ] Revue du code VRF
- [ ] Test de charge

### Bonnes pratiques
- ✅ Utilisation d'Anchor Framework
- ✅ Validation des entrées
- ✅ Gestion des erreurs
- ✅ Tests complets
- ✅ PDA sécurisés

## 📈 Roadmap

### Phase 1 - MVP ✅
- [x] Smart contract de base
- [x] Token WBALL
- [x] Système de tickets
- [x] Tests complets

### Phase 2 - Intégration 🚧
- [ ] Intégration Switchboard VRF
- [ ] Backend Django
- [ ] Frontend Next.js
- [ ] Interface admin

### Phase 3 - Production 📋
- [ ] Audit de sécurité
- [ ] Déploiement mainnet
- [ ] Monitoring
- [ ] Analytics

## 🤝 Contribution

### Développement local
```bash
# Cloner le repo
git clone <repo>
cd winary-ball

# Installer dépendances
npm install

# Démarrer le développement
anchor test --skip-deploy
```

### Structure des commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
test: ajout de tests
refactor: refactoring
```

## 📞 Support

Pour toute question ou support:
- **Email**: support@asitech.com
- **Documentation**: [Lien vers docs]
- **Issues**: [Lien vers GitHub issues]

## 📜 Licence

MIT License - voir LICENSE.md pour les détails.

---

**Développé par ASITECH** 🚀


🎰 Prompt Complet : Smart Contract Loterie Décentralisée Solana
📋 CONTEXTE & OBJECTIF
Créer un smart contract Rust/Anchor complet pour une loterie décentralisée sur Solana avec le token SPL $BALL. Le système doit être entièrement automatisé, transparent et sécurisé.
🎯 SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES
1. CONFIGURATION DE BASE
- Framework: Anchor (Rust)
- Token: $BALL (SPL Token)
- Mint Address: 7qi1pPouJhaQiVoNmnAnGmTaJbs5rXRFZXbQAmPZYehd
- Ratio: 1 ticket = 10,000 $BALL
- Program ID: CX8EZggbG4qH9d15UKevjGLACJDWsnxHP7JAUeGwodvp
2. STRUCTURE DES TIRAGES

Hourly PowerBall: Toutes les heures (1h = 3600 secondes)
Mega Daily PowerBall: Toutes les 24h (24h = 86400 secondes)
Contribution: 10% transactions → Jackpot Horaire, 5% → Jackpot Journalier

3. MÉCANISME DE PARTICIPATION

Participation automatique basée sur le balance $BALL
Pas d'inscription nécessaire
Calcul automatique des tickets: balance / 10000
Mise à jour dynamique lors des changements de balance

4. SYSTÈME DE TIRAGE

Utilisation de VRF (Switchboard recommandé pour Solana)
Génération pseudo-aléatoire basée sur slot + timestamp en fallback
Sélection pondérée par nombre de tickets
Historique complet des tirages

5. GESTION DES GAINS

Conversion automatique en SOL
Transfert direct vers le wallet gagnant
Système de réclamation (claim) sécurisé
Vérification anti-double claim

🏗️ ARCHITECTURE REQUISE
A. STRUCTURES DE DONNÉES
rust// État principal de la loterie
LotteryState {
    authority: Pubkey,
    ball_token_mint: Pubkey,
    vrf_account: Option<Pubkey>,
    tickets_per_entry: u64,
    hourly_jackpot: u64,
    daily_jackpot: u64,
    last_hourly_draw: i64,
    last_daily_draw: i64,
    total_participants: u64,
    total_tickets: u64,
    hourly_winner: Option<Pubkey>,
    daily_winner: Option<Pubkey>,
    hourly_prize_amount: u64,
    daily_prize_amount: u64,
    draw_number: u64,
    is_active: bool,
    bump: u8,
}

// Participant individuel
Participant {
    wallet: Pubkey,
    ball_balance: u64,
    tickets: u64,
    last_updated: i64,
    total_winnings: u64,
    is_eligible: bool,
    bump: u8,
}

// Historique des tirages
DrawHistory {
    draw_number: u64,
    draw_type: DrawType, // Hourly | Daily
    winner: Pubkey,
    prize_amount: u64,
    timestamp: i64,
    participants_count: u64,
    total_tickets: u64,
    slot: u64,
    random_seed: u64,
    vrf_result: Option<[u8; 32]>,
}
B. FONCTIONS PRINCIPALES

initialize() - Configuration initiale
register_participant() - Enregistrement/MAJ participant
contribute_to_jackpot() - Alimentation des jackpots
draw_hourly_lottery() - Tirage horaire
draw_daily_lottery() - Tirage journalier
claim_prize() - Réclamation des gains
get_lottery_stats() - Statistiques en temps réel
get_participant_info() - Info participant
get_draw_history() - Historique tirages
update_participant_tickets() - MAJ automatique tickets
emergency_pause() - Pause d'urgence (admin)
withdraw_fees() - Retrait des frais (admin)

C. INTÉGRATION VRF (SWITCHBOARD)
rust// Structure VRF
VrfState {
    lottery_state: Pubkey,
    vrf_account: Pubkey,
    oracle_queue: Pubkey,
    permission: Pubkey,
    escrow: Pubkey,
    is_initialized: bool,
}

// Fonctions VRF
- `init_vrf()`
- `request_randomness()`
- `consume_randomness()`
🔐 SÉCURITÉ & VALIDATIONS
Contraintes de Sécurité

Vérification des signatures (Signer required)
Validation des comptes (PDA, seeds)
Protection contre les attaques de réentrance
Vérification des balances avant transfert
Contrôle des permissions admin
Protection contre les débordements (overflow)

Gestion d'Erreurs
rust#[error_code]
pub enum LotteryError {
    TooEarlyForDraw,
    NoParticipants,
    NoPrizeToClaim,
    InsufficientFunds,
    InvalidTokenMint,
    Unauthorized,
    LotteryInactive,
    NoJackpot,
    InvalidAmount,
    VrfNotReady,
    ParticipantNotEligible,
    DrawAlreadyCompleted,
    InvalidTimeframe,
}
📊 FONCTIONNALITÉS AVANCÉES
1. Système de Pondération

Calcul probabilité basé sur tickets possédés
Distribution équitable selon les holdings
Algorithme de sélection pondérée

2. Optimisations Gas

Utilisation de PDA pour réduire les coûts
Batch operations quand possible
Compression des données

3. Observabilité

Logs détaillés avec émojis
Events pour le frontend
Métriques de performance

4. Compatibilité

Support multi-wallet (Phantom, Solflare)
API REST friendly
Format JSON pour frontend

🧪 TESTS REQUIS
Tests Unitaires

Initialisation correcte
Calcul des tickets
Mécanisme de tirage
Transferts de fonds
Gestion des erreurs

Tests d'Intégration

Scénarios complets de loterie
Intégration VRF
Tests de charge
Sécurité des fonds

📝 DOCUMENTATION INTÉGRÉE

Commentaires détaillés en français
Exemples d'utilisation
Schémas des flux de données
Guide de déploiement

🚀 INSTRUCTIONS DE GÉNÉRATION
Générer un smart contract Rust/Anchor complet qui :

Respecte 100% des spécifications ci-dessus
Inclut toutes les structures de données
Implémente toutes les fonctions avec logique complète
Intègre la sécurité et la gestion d'erreurs
Optimise pour la performance et les coûts
Fournit une documentation claire
Prépare l'intégration VRF Switchboard
Inclut des constantes configurables
Supporte l'administration sécurisée
Prepare le déploiement mainnet

Le code doit être production-ready, auditable et maintenable.