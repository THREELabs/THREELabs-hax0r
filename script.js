// Game State Management
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.maxLevels = 3;
        this.score = 0;
        this.inventory = new Set();
        this.unlockedSkills = new Set();
        this.progress = 0;
        this.timeRemaining = 600; // 10 minutes
        this.isPaused = false;
        this.activeTools = new Set();
        this.terminalHistory = [];
        this.loadState();
    }

    saveState() {
        const saveData = {
            currentLevel: this.currentLevel,
            score: this.score,
            inventory: Array.from(this.inventory),
            unlockedSkills: Array.from(this.unlockedSkills),
            progress: this.progress,
            terminalHistory: this.terminalHistory
        };
        localStorage.setItem('hackingGameState', JSON.stringify(saveData));
    }

    loadState() {
        const savedState = localStorage.getItem('hackingGameState');
        if (savedState) {
            const data = JSON.parse(savedState);
            Object.assign(this, data);
            this.inventory = new Set(data.inventory);
            this.unlockedSkills = new Set(data.unlockedSkills);
        }
    }
}

// Sound Effects Manager
class SoundManager {
    constructor() {
        this.sounds = {};
        this.initSounds();
    }

    initSounds() {
        const soundEffects = {
            keypress: 'data:audio/wav;base64,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',
            success: 'data:audio/wav;base64,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',
            error: 'data:audio/wav;base64,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'
        };

        for (const [name, base64] of Object.entries(soundEffects)) {
            const audio = new Audio(base64);
            this.sounds[name] = audio;
        }
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(console.error);
        }
    }
}

// Terminal Emulator
class Terminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.history = [];
        this.currentLine = '';
        this.prompt = '> ';
        this.cursorPosition = 0;
        this.soundManager = new SoundManager();
    }

    write(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.container.appendChild(line);
        this.container.scrollTop = this.container.scrollHeight;
        this.history.push(text);
    }

    async typeText(text, speed = 50) {
        const line = document.createElement('div');
        line.className = 'terminal-line typing';
        this.container.appendChild(line);

        for (let i = 0; i < text.length; i++) {
            this.soundManager.play('keypress');
            line.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    clear() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        this.history = [];
    }
}

// Network Visualization
class NetworkGraph {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.nodes = [];
        this.edges = [];
        this.selectedNodes = new Set();
    }

    addNode(x, y) {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        
        node.addEventListener('click', () => this.handleNodeClick(this.nodes.length));
        
        this.container.appendChild(node);
        this.nodes.push(node);
        
        return this.nodes.length - 1;
    }

    addEdge(fromIndex, toIndex) {
        const edge = {
            from: fromIndex,
            to: toIndex,
            element: document.createElement('div')
        };
        
        edge.element.className = 'edge';
        this.updateEdgePosition(edge);
        
        this.container.appendChild(edge.element);
        this.edges.push(edge);
    }

    updateEdgePosition(edge) {
        const fromNode = this.nodes[edge.from];
        const toNode = this.nodes[edge.to];
        
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        
        const angle = Math.atan2(
            toRect.top - fromRect.top,
            toRect.left - fromRect.left
        );
        
        const length = Math.sqrt(
            Math.pow(toRect.left - fromRect.left, 2) +
            Math.pow(toRect.top - fromRect.top, 2)
        );
        
        edge.element.style.width = `${length}px`;
        edge.element.style.transform = `rotate(${angle}rad)`;
        edge.element.style.left = `${fromRect.left + fromRect.width / 2}px`;
        edge.element.style.top = `${fromRect.top + fromRect.height / 2}px`;
    }

    handleNodeClick(index) {
        if (this.selectedNodes.has(index)) {
            this.selectedNodes.delete(index);
            this.nodes[index].classList.remove('selected');
        } else {
            this.selectedNodes.add(index);
            this.nodes[index].classList.add('selected');
        }
        
        if (this.onSelectionChange) {
            this.onSelectionChange(Array.from(this.selectedNodes));
        }
    }
}

// Password Cracking Minigame
class PasswordCracker {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.attempts = 0;
        this.maxAttempts = 5;
        this.currentHint = '';
        this.password = '';
        this.soundManager = new SoundManager();
    }

    async start(password, initialHint) {
        this.password = password;
        this.currentHint = initialHint;
        this.attempts = 0;
        
        const hintElement = document.createElement('div');
        hintElement.className = 'password-hint';
        hintElement.textContent = this.currentHint;
        
        const inputElement = document.createElement('input');
        inputElement.type = 'password';
        inputElement.placeholder = 'Enter password';
        
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Attempt Crack';
        
        this.container.appendChild(hintElement);
        this.container.appendChild(inputElement);
        this.container.appendChild(submitButton);
        
        return new Promise((resolve) => {
            submitButton.addEventListener('click', () => {
                this.attempts++;
                const attempt = inputElement.value;
                
                if (attempt === this.password) {
                    this.soundManager.play('success');
                    resolve(true);
                } else {
                    this.soundManager.play('error');
                    if (this.attempts >= this.maxAttempts) {
                        resolve(false);
                    } else {
                        this.updateHint();
                    }
                }
            });
        });
    }

    updateHint() {
        // Add more sophisticated hint logic based on attempts
        const hintElement = this.container.querySelector('.password-hint');
        if (this.attempts === 2) {
            hintElement.textContent = this.currentHint + "\nHint: Contains both letters and numbers";
        } else if (this.attempts === 3) {
            hintElement.textContent = this.currentHint + "\nHint: Length is " + this.password.length + " characters";
        }
    }
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameState = new GameState();
    const terminal = new Terminal('terminal-content');
    const soundManager = new SoundManager();

    // Initialize game components
    const passwordCracker = new PasswordCracker('puzzle1');
    const networkGraph = new NetworkGraph('puzzle2');

    // Start game sequence
    async function startGame() {
        await terminal.typeText('Initializing Shadow Protocol...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await terminal.typeText('Establishing secure connection...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await terminal.typeText('Access granted. Welcome, Agent.');
        
        document.getElementById('terminal-container').classList.add('hidden');
        document.getElementById('level1').classList.remove('hidden');
        gameState.updateProgress(0);
    }

    // Event Listeners
    document.getElementById('start-button').addEventListener('click', startGame);

    // Password cracking puzzle
    async function checkPassword(event) {
        const password = document.getElementById('passwordInput').value;
        if (event && event.shiftKey) {
            proceedToNextPuzzle('puzzle1', 'puzzle2');
            return;
        }

        const result = await passwordCracker.start('dataispower1234', 'NovaCorp CEO\'s favorite phrase + Employee ID');
        if (result) {
            proceedToNextPuzzle('puzzle1', 'puzzle2');
            gameState.updateProgress(33);
        }
    }

    // Network puzzle
    function initializeNetwork() {
        // Create network nodes
        const nodePositions = [
            {x: 50, y: 50}, {x: 150, y: 100}, {x: 250, y: 50},
            {x: 150, y: 200}, {x: 50, y: 250}, {x: 250, y: 250}
        ];

        nodePositions.forEach(pos => networkGraph.addNode(pos.x, pos.y));
        
        // Add connections
        networkGraph.addEdge(0, 1);
        networkGraph.addEdge(1, 2);
        networkGraph.addEdge(1, 3);
        networkGraph.addEdge(3, 4);
        networkGraph.addEdge(3, 5);
    }

    // Helper functions
    function proceedToNextPuzzle(currentId, nextId) {
        document.getElementById(currentId).classList.add('hidden');
        document.getElementById(nextId).classList.remove('hidden');
        soundManager.play('success');
    }

    // Initialize network visualization
    initializeNetwork();
});
