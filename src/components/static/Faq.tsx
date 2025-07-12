import { useState } from 'react';
import { ChevronDown, AlertTriangle, Scale, HelpCircle, Cpu, Trophy, Shield } from 'lucide-react';

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState('All Questions');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const tabs = [
    { name: 'All Questions', color: 'bg-blue-600', textColor: 'text-white' },
    { name: 'Legal & Disclaimers', icon: Scale, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { name: 'General', icon: HelpCircle, color: 'bg-blue-100', textColor: 'text-blue-700' },
    { name: 'Technical', icon: Cpu, color: 'bg-green-100', textColor: 'text-green-700' },
    { name: 'Winnings', icon: Trophy, color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { name: 'Security', icon: Shield, color: 'bg-blue-100', textColor: 'text-red-700' }
  ];

  const questions = [
    {
      id: 1,
      category: 'Legal & Disclaimers',
      icon: Scale,
      question: 'Are you affiliated with official Powerball or any government-run drawing?',
      answer: 'NO. Powerball $BALL is not affiliated with any state-run prize draw, government-sponsored contest, or the official Powerball game. This is a memecoin project and entertainment platform built on the Solana blockchain. It operates as a cryptocurrency token giveaway for entertainment purposes only.'
    },
    {
      id: 2,
      category: 'Legal & Disclaimers',
      icon: Scale,
      question: 'Is this legal in my jurisdiction?',
      answer: 'You are solely responsible for determining whether participation is legal in your jurisdiction. This platform operates as a cryptocurrency project, not as gambling or an investment opportunity. Laws vary by location, and you must comply with your local regulations. If you are unsure, consult with legal counsel before participating.'
    },
    {
      id: 3,
      category: 'General',
      icon: HelpCircle,
      question: 'What is Powerball $BALL?',
      answer: 'Powerball $BALL is a Solana-based memecoin project with hourly and daily token distributions. Every 10,000 $BALL tokens you hold count as 1 entry. Winners are selected using Solana\'s Verifiable Random Functions (VRF) for guaranteed fairness. This is entertainment only.'
    },
    {
      id: 4,
      category: 'General',
      icon: HelpCircle,
      question: 'How often are draws held?',
      answer: 'There are two types of draws: Hourly draws happen every hour (24 times per day) with 78% payouts, and Daily draws happen once per day at 7:30 PM EST with 82% payouts from a separate jackpot pool.'
    },
    {
      id: 5,
      category: 'General',
      icon: HelpCircle,
      question: 'How much does it cost to play?',
      answer: 'You need to own at least 10,000 $BALL tokens to get 1 raffle entry. Buy $BALL tokens on Jupiter Exchange using the official contract: BALLrveijbhu42QaS2XW1pRBYfMji73bGeYJghUvQs6y. More tokens = more entries: 20,000 tokens = 2 entries, 50,000 tokens = 5 entries, etc.'
    },
    {
      id: 6,
      category: 'Winnings',
      icon: Trophy,
      question: 'How and when do I receive winnings?',
      answer: 'Winnings are automatically sent to your wallet immediately after each draw! There\'s no need to claim prizes or contact anyone. If you win, the prize will appear in your wallet within minutes.'
    },
    {
      id: 7,
      category: 'General',
      icon: HelpCircle,
      question: 'Is this affiliated with the official Powerball game?',
      answer: 'No, Powerball $BALL is not affiliated with the official Powerball game. This is an independent project built on the Solana blockchain with its own rules and mechanics.'
    },
    {
      id: 8,
      category: 'Technical',
      icon: Cpu,
      question: 'What is the official $BALL token contract address?',
      answer: 'The official $BALL token contract address is: BALLrveijbhu42QaS2XW1pRBYfMji73bGeYJghUvQs6y. Always verify this address when buying tokens. Never buy from any other contract address claiming to be $BALL.'
    },
    {
      id: 9,
      category: 'Technical',
      icon: Cpu,
      question: 'Where can I buy $BALL tokens?',
      answer: 'You can buy $BALL tokens on Jupiter Exchange (recommended) or any Solana DEX. Always use the correct contract address: BALLrveijbhu42QaS2XW1pRBYfMji73bGeYJghUvQs6y. You can also use the direct Jupiter link: https://jup.ag/swap/SOL-BALL'
    },
    {
      id: 10,
      category: 'Technical',
      icon: Cpu,
      question: 'How does the VRF (Verifiable Random Function) work technically?',
      answer: 'Solana\'s VRF generates 32 bytes of pure randomness that gets converted to a BigInt using: BigInt(\'0x\' + Buffer.from(randomness).toString(\'hex\')). This random number is then mapped to the ticket space using modulo: randomIndex = R % totalTickets. Finally, we walk through cumulative ticket counts to find which holder owns that specific ticket number. Every ticket has exactly 1/totalTickets probability of being selected.'
    },
    {
      id: 11,
      category: 'Technical',
      icon: Cpu,
      question: 'How can I verify draws are fair?',
      answer: 'Every draw is completely transparent and verifiable! We publish snapshot files (showing all holders and ticket counts) and tickets files (showing the ticket-to-owner mapping) for every drawing. You can download these files from /snapshot/ and verify the winner selection process yourself. All VRF transactions are also viewable on Solscan.'
    },
    {
      id: 12,
      category: 'General',
      icon: HelpCircle,
      question: 'Do I need to do anything after buying $BALL tokens?',
      answer: 'No! Once you hold at least 10,000 $BALL tokens in your wallet, you are automatically eligible for all future draws. There\'s no registration required - just hold the tokens and you\'re entered into every hourly and daily draw.'
    },
    {
      id: 13,
      category: 'Winnings',
      icon: Trophy,
      question: 'How much can I win?',
      answer: 'Hourly draws pay out 78% of the main wallet balance, while Daily draws pay out 82% of a separate daily jackpot wallet (Ms2o71HY8wyZM4KUPdwswHJLqe8Kon4Kq9Rg3ZUsB1G). Prize amounts vary based on participation and the current wallet balances.'
    },
    {
      id: 14,
      category: 'Winnings',
      icon: Trophy,
      question: 'Can I win multiple times?',
      answer: 'Absolutely! There\'s no limit to how many times you can win. Each draw is independent, so previous wins don\'t affect your chances in future draws. As long as you hold the minimum 10,000 $BALL tokens, you\'re automatically entered into every draw.'
    },
    {
      id: 15,
      category: 'Winnings',
      icon: Trophy,
      question: 'Are there any taxes on winnings?',
      answer: 'Tax obligations vary by jurisdiction. Cryptocurrency winnings may be subject to capital gains or income tax in some countries. Please consult with a tax professional to understand your local tax obligations.'
    },
    {
      id: 16,
      category: 'Security',
      icon: Shield,
      question: 'Is Powerball $BALL safe?',
      answer: 'Yes! The system runs on auditable smart contracts on Solana. All randomness uses cryptographic VRF for guaranteed fairness, and every transaction is recorded on-chain. However, only invest what you can afford to lose, as with any form of gambling.'
    },
    {
      id: 17,
      category: 'Security',
      icon: Shield,
      question: 'How do I avoid scams?',
      answer: 'Only use the official contract address: BALLrveijbhu42QaS2XW1pRBYfMji73bGeYJghUvQs6y. Never give your private keys to anyone. Be wary of fake websites or social media accounts. Always verify the contract address before buying tokens - blockchain transactions are irreversible.'
    }
  ];

  const filteredQuestions = activeTab === 'All Questions' 
    ? questions 
    : questions.filter(q => q.category === activeTab);

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Frequently Asked Questions
      </h1>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">IMPORTANT LEGAL DISCLAIMER</h2>
          <AlertTriangle className="w-6 h-6 text-yellow-600 ml-2" />
        </div>
        
        <p className="text-gray-800 font-semibold mb-4">
          This platform is not affiliated with any government-run drawing or official Powerball game.
        </p>
        
        <div className="text-gray-700 space-y-3">
          <p>
            Powerball $BALL is a <strong>memecoin project</strong> and entertainment platform built on the Solana blockchain. We 
            are not affiliated with, endorsed by, or connected to any state-sponsored drawing or the official Powerball 
            game.
          </p>
          
          <p>
            This platform operates as a cryptocurrency token giveaway for entertainment purposes only. This platform 
            should not be construed as gambling in any legal sense.
          </p>
          
          <p className="text-sm text-gray-600">
            You are solely responsible for compliance with your local laws and regulations. Please only participate if it is legal in your 
            jurisdiction and with funds you can afford to lose.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.name;
          
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${isActive ? tab.color : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
                ${isActive ? tab.textColor : ''}
              `}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((item) => {
          const IconComponent = item.icon;
          const isOpen = openQuestion === item.id;
          
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleQuestion(item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="font-medium text-gray-800">{item.question}</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="pl-8 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;