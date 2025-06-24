# Quantum Math Tutor

An adaptive math-tutoring React app powered by a Deep Q-Learning RL agent inspired by a toy imaginary-time evolution model.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Development Server](#development-server)  
5. [Architecture](#architecture)  
   - [Frontend](#frontend)  
   - [RL Agent](#rl-agent)  
6. [Adaptive Learning Model](#adaptive-learning-model)  
7. [Project Structure](#project-structure)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## Project Overview

Quantum Math Tutor delivers personalized practice questions on key math topics using a reinforcement-learning approach. A Deep Q-Learning agent—conceptually inspired by imaginary-time evolution—selects each next question to maximize students’ mastery and retention over time.

---

## Features

- **Adaptive Question Selection**  
  The RL agent chooses problems dynamically based on current mastery estimates.  
- **Topic-Level Mastery Tracking**  
  Visualize your strength and weakness across topics (algebra, geometry, etc.).  
- **Interactive React UI**  
  Responsive question screen, progress dashboard, and feedback pages.  
- **Imaginary-Time-Inspired Policy**  
  A toy model simulates “energy relaxation” of question-state vectors to guide exploration vs. exploitation.  

---

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS  
- **RL Agent**: TensorFlow.js Deep Q-Learning  
- **State Management**: Redux Toolkit  
- **Bundler**: Vite  
- **Testing**: Jest + React Testing Library  

---

## Getting Started

### Prerequisites

- Node.js ≥ 16.x  
- npm (or Yarn)  
- Git  

### Installation

1. Clone the repo  
   ```bash
   git clone https://github.com/your-org/quantum-math-tutor.git
   cd quantum-math-tutor
   ```

2. Install dependencies  
   ```bash
   npm install
   # or
   yarn install
   ```

### Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will reload on code changes.

---

## Architecture

### Frontend

- **`src/App.tsx`**  
  Root component that sets up routing and context providers.  
- **`src/components/QuestionScreen/`**  
  Displays current question and answer options.  
- **`src/components/Dashboard/`**  
  Shows topic-mastery bars and historical performance.  
- **`src/store/`**  
  Redux slices for user state, question bank, and mastery metrics.

### RL Agent

- **`src/utils/reinforcementUtils.ts`**  
  Implements the Deep Q-Learning training loop and policy network.  
- **`src/utils/questionUtils.ts`**  
  Wraps the imaginary-time evolution toy model to propose candidate questions.  
- **TensorFlow.js**  
  Runs the Q-network entirely in the browser for instant, adaptive feedback.

---

## Adaptive Learning Model

1. **State Representation**  
   A vector of per-topic mastery scores (normalized to [0,1]).  
2. **Action Space**  
   Each available question in the bank.  
3. **Reward Signal**  
   +1 for correct answers, –1 for incorrect.  
4. **Imaginary-Time Inspiration**  
   - We treat the Q-values as a “wavefunction” over question space.  
   - A toy imaginary-time evolution step damps high-error states and amplifies promising ones.  
   - This regularizes learning and encourages efficient topic coverage.  

---

## Project Structure

```
quantum-math-tutor/
├── public/                   # Static assets
├── src/
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Redux slices & store
│   ├── utils/                # DQN & question-selection logic
│   ├── assets/               # Images, icons, fonts
│   ├── App.tsx
│   └── main.tsx
├── tests/                    # Unit & integration tests
├── package.json
└── tailwind.config.js
```

---

## Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/XYZ`)  
3. Commit your changes (`git commit -m "Add XYZ"`)  
4. Push to your fork (`git push origin feature/XYZ`)  
5. Open a Pull Request  

Please follow the existing code style, write meaningful commit messages, and include tests for new features.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
