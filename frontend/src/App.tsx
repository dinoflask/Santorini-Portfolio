import React from "react";
import "./App.css"; // import the css file to enable your styles.
import { GameState, Cell } from "./game";
import BoardCell from "./Cell.tsx";

// App.tsx
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

/**
 * Define the type of the props field for a React component
 */
interface Props {}

interface AppState {
  cells: Cell[];
  currentPlayer: string;
  winner: number | null;
  turnPhase: string | null;
  godCards: string[];
  canPassBuild: boolean;
  canPassMove: boolean; // NEW
}

class App extends React.Component<Props, AppState> {
  private initialized: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      cells: [],
      currentPlayer: "", // for example, tracking whose turn it is
      winner: null,
      turnPhase: null,
      godCards: [],
      canPassBuild: false,
      canPassMove: false, // NEW
    };
  }

  newGame = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/newgame`);
      const json = await response.json();

      // SINGLE batched setState - merges all properties
      this.setState({
        cells: json["cells"],
        currentPlayer: json["currentPlayer"],
        winner: json["winner"],
        turnPhase: json["turnPhase"],
        godCards: json["godCards"] ?? [],
        canPassBuild: json["canPassBuild"] ?? false,
        canPassMove: json["canPassMove"] ?? false, // NEW
      });
    } catch (error) {
      console.error("New Game failed:", error);
    }
  };

  play = (x: number, y: number): React.MouseEventHandler => {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`${API_BASE_URL}/play?x=${x}&y=${y}`);
      const json = await response.json();
      this.setState({
        cells: json["cells"],
        currentPlayer: json["currentPlayer"],
        winner: json["winner"],
        turnPhase: json["turnPhase"],
        godCards: json["godCards"] ?? [],
        canPassBuild: json["canPassBuild"] ?? false,
        canPassMove: json["canPassMove"] ?? false, // NEW
      });
    };
  };

  chooseGod = (god: string): React.MouseEventHandler => {
    return async (e) => {
      e.preventDefault();
      const response = await fetch(`${API_BASE_URL}/choose?god=${god}`);
      const json = await response.json();
      this.setState({
        cells: json["cells"],
        currentPlayer: json["currentPlayer"],
        winner: json["winner"],
        turnPhase: json["turnPhase"],
        godCards: json["godCards"] ?? [],
        canPassBuild: json["canPassBuild"] ?? false,
        canPassMove: json["canPassMove"] ?? false, // NEW
      });
    };
  };

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable)
      return (
        <div key={index}>
          <a href="/" onClick={this.play(cell.x, cell.y)}>
            <BoardCell cell={cell}></BoardCell>
          </a>
        </div>
      );
    else
      return (
        <div key={index}>
          <BoardCell cell={cell}></BoardCell>
        </div>
      );
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    if (this.state.turnPhase === "GOD_SELECTION") {
      return this.renderGodSelection();
    }
    let instructionsText = "";
    if (this.state.winner == -1) {
      instructionsText = `Current turn: ${this.state.currentPlayer}`;
    } else {
      if (this.state.winner == 0) {
        instructionsText = `Winner: A`;
      } else {
        instructionsText = `Winner: B`;
      }
    }

    return (
      <div id="app-container">
        <header id="app-header">Santorini</header>
        {/* Winner popup stays fixed */}
        {this.state.winner != -1 && (
          <div id="winner-popup">
            <div id="winner-message">
              Winner: {this.state.winner === 0 ? "A" : "B"}
            </div>
          </div>
        )}

        {/* Main game UI - centered and scaled */}
        <div id="game-ui">
          <div id="board">
            {this.state.cells.map((cell, i) => this.createCell(cell, i))}
          </div>
          <div id="instructions">{instructionsText}</div>
          <div id="bottombar">
            <button onClick={this.newGame}>New Game</button>
            {this.state.turnPhase === "BUILD" && this.state.canPassBuild && (
              <button onClick={this.passBuild}>Skip extra build</button>
            )}
            {this.state.turnPhase === "MOVE" && this.state.canPassMove && (
              <button onClick={this.passMove}>Pass Move</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  renderGodSelection(): React.ReactNode {
    const gods = this.state.godCards;
    return (
      <div
        id="god-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="god-popup-title"
      >
        <div id="god-popup-content">
          <h2 id="god-popup-title">
            Choose your God power (Player {this.state.currentPlayer})
          </h2>
          <div id="god-grid">
            {gods.map((god) => (
              <button key={god} onClick={this.chooseGod(god)}>
                {god}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  passBuild: React.MouseEventHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/passBuild`);
    const json = await response.json();
    this.setState({
      cells: json["cells"],
      currentPlayer: json["currentPlayer"],
      winner: json["winner"],
      turnPhase: json["turnPhase"],
      godCards: json["godCards"] ?? [],
      canPassBuild: json["canPassBuild"] ?? false,
      canPassMove: json["canPassMove"] ?? false, // NEW
    });
  };

  passMove: React.MouseEventHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/passMove`);
    const json = await response.json();
    this.setState({
      cells: json["cells"],
      currentPlayer: json["currentPlayer"],
      winner: json["winner"],
      turnPhase: json["turnPhase"],
      godCards: json["godCards"] ?? [],
      canPassBuild: json["canPassBuild"] ?? false,
      canPassMove: json["canPassMove"] ?? false, // NEW
    });
  };
}

export default App;
