// L-Zore 神煞卡牌战斗系统 - 核心游戏逻辑

class LZoreGame {
    constructor() {
        this.currentTurn = 1;
        this.gamePhase = 'preparation'; // preparation, battle, ended
        this.selectedCard = null;
        this.publicPool = [];
        this.publicPoolOpen = [];
        
        // 玩家状态
        this.player = {
            name: '络尘',
            bazi: {
                year: { gan: '甲', zhi: '子' },
                month: { gan: '乙', zhi: '丑' },
                day: { gan: '丙', zhi: '寅' },
                hour: { gan: '丁', zhi: '卯' }
            },
            remainingElements: 8, // 剩余元素数量
            hand: [],
            board: new Array(4).fill(null), // 玩家的4个位置（年月日时）
            activeGods: [],
            status: '正常'
        };
        
        // AI对手状态
        this.opponent = {
            name: 'AI虚拟人格',
            bazi: {
                year: { gan: '戊', zhi: '辰' },
                month: { gan: '己', zhi: '巳' },
                day: { gan: '庚', zhi: '午' },
                hour: { gan: '辛', zhi: '未' }
            },
            remainingElements: 8, // 剩余元素数量
            hand: [],
            board: new Array(4).fill(null), // AI的4个位置（年月日时）
            activeGods: [],
            status: '正常'
        };
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateUI();
    }
    
    // 初始化游戏
    initializeGame() {
        this.createCardDatabase();
        this.createPublicPool();
        this.dealInitialHands();
        this.setupOpponentBoard();
    }
    
    // 创建神煞卡牌数据库
    createCardDatabase() {
        this.cardDatabase = [
            // 吉神类神煞
            {
                id: 'tianyiguiren',
                name: '天乙贵人',
                type: 'auspicious',
                element: 'metal',
                power: 4,
                rarity: '⭐⭐⭐',
                description: '最高吉星，避免厄运，遇事有人帮',
                effect: '保护己方4枚元素不被中和',
                condition: '金系天干 + 土系地支',
                pillarPreference: ['year', 'day']
            },
            {
                id: 'wenchang',
                name: '文昌贵人',
                type: 'auspicious',
                element: 'water',
                power: 2,
                rarity: '⭐⭐',
                description: '聪明擅艺，主聪明过人，利考试学术',
                effect: '中和对方2枚元素，智慧加成',
                condition: '水系天干 + 木系地支',
                pillarPreference: ['month', 'day']
            },
            {
                id: 'lushen',
                name: '禄神',
                type: 'auspicious',
                element: 'earth',
                power: 1,
                rarity: '⭐',
                description: '主福禄财运，象征稳定收入地位',
                effect: '每回合获得额外效果',
                condition: '天干归位',
                pillarPreference: ['year', 'month']
            },
            {
                id: 'jinyu',
                name: '金舆',
                type: 'auspicious',
                element: 'metal',
                power: 2,
                rarity: '⭐⭐',
                description: '华丽富贵车，聪明富贵，性格温和',
                effect: '增加资源获取，防御+1',
                condition: '金系组合',
                pillarPreference: ['year', 'month']
            },
            {
                id: 'taiji',
                name: '太极贵人',
                type: 'auspicious',
                element: 'special',
                power: 4,
                rarity: '⭐⭐⭐',
                description: '聪明好学，喜神秘事物如命理卜筮',
                effect: '阴阳转化，逆转五行关系',
                condition: '阴阳平衡',
                pillarPreference: ['day']
            },
            
            // 凶神类神煞
            {
                id: 'yangren',
                name: '羊刃',
                type: 'inauspicious',
                element: 'fire',
                power: 3,
                rarity: '⭐⭐⭐',
                description: '刚烈冲动，易惹是非，吉则勇猛',
                effect: '中和对方3枚元素，可能反噬',
                condition: '火系过旺',
                pillarPreference: ['day', 'hour']
            },
            {
                id: 'jiesha',
                name: '劫煞',
                type: 'inauspicious',
                element: 'metal',
                power: 2,
                rarity: '⭐⭐',
                description: '一生多是非破财，破财小人意外',
                effect: '破坏对方资源，中和2枚',
                condition: '金克木过度',
                pillarPreference: ['month', 'hour']
            },
            {
                id: 'wangshen',
                name: '亡神',
                type: 'inauspicious',
                element: 'water',
                power: 3,
                rarity: '⭐⭐⭐',
                description: '自内失之为亡，容易招惹是非',
                effect: '对已受损目标元素翻倍',
                condition: '水系冲克',
                pillarPreference: ['hour']
            },
            {
                id: 'kongwang',
                name: '空亡',
                type: 'inauspicious',
                element: 'special',
                power: 2,
                rarity: '⭐⭐',
                description: '象征力量落空，吉神减力凶煞化解',
                effect: '使目标暂时失效',
                condition: '柱位空缺',
                pillarPreference: ['any']
            },
            {
                id: 'xianchin',
                name: '咸池',
                type: 'inauspicious',
                element: 'water',
                power: 1,
                rarity: '⭐',
                description: '风流酒色，与异性纠缠不清',
                effect: '迷惑对方，影响决策',
                condition: '桃花位',
                pillarPreference: ['month', 'hour']
            },
            
            // 特殊神煞
            {
                id: 'huagai',
                name: '华盖',
                type: 'special',
                element: 'earth',
                power: 1,
                rarity: '⭐',
                description: '性情恬淡资质聪颖，易倾向宗教艺术',
                effect: '隐藏战术意图，属性转换',
                condition: '土库之星',
                pillarPreference: ['year', 'day']
            },
            {
                id: 'yima',
                name: '驿马',
                type: 'special',
                element: 'fire',
                power: 2,
                rarity: '⭐⭐',
                description: '主奔波变动异地发展，吉则升迁远行',
                effect: '增加行动次数，快速移动',
                condition: '动星',
                pillarPreference: ['hour']
            },
            {
                id: 'jiangxing',
                name: '将星',
                type: 'special',
                element: 'metal',
                power: 3,
                rarity: '⭐⭐⭐',
                description: '权力之星，具有组织领导才能',
                effect: '指挥其他神煞协战',
                condition: '权威地位',
                pillarPreference: ['year', 'month']
            },
            {
                id: 'kuigang',
                name: '魁罡',
                type: 'special',
                element: 'earth',
                power: 4,
                rarity: '⭐⭐⭐',
                description: '刚烈正直勇猛，耿直胸无城府',
                effect: '无视部分防御，霸道元素',
                condition: '特殊日柱',
                pillarPreference: ['day']
            },
            {
                id: 'tongzi',
                name: '童子煞',
                type: 'special',
                element: 'wood',
                power: 2,
                rarity: '⭐⭐',
                description: '天庭童男女因犯过错转世人间',
                effect: '净化负面效果',
                condition: '纯真之心',
                pillarPreference: ['hour']
            }
        ];
    }
    
    // 创建公共卡池
    createPublicPool() {
        // 从卡牌数据库中随机选择20-30张卡牌作为公共卡池
        const poolSize = 25;
        this.publicPool = [];
        for (let i = 0; i < poolSize; i++) {
            const randomCard = { 
                ...this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)],
                publicIndex: i
            };
            this.publicPool.push(randomCard);
        }
        this.publicPoolOpen = [];
    }
    
    // 发初始手牌
    dealInitialHands() {
        this.player.hand = this.drawCards(5);
        this.opponent.hand = this.drawCards(5);
    }
    
    // 抽卡
    drawCards(count) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            const randomCard = { 
                ...this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)],
                id: this.cardDatabase[Math.floor(Math.random() * this.cardDatabase.length)].id + '_' + Date.now() + '_' + i
            };
            cards.push(randomCard);
        }
        return cards;
    }
    
    // 设置AI对手的初始布局
    setupOpponentBoard() {
        // AI随机部署一些神煞卡牌
        const opponentCards = this.drawCards(2);
        const positions = [0, 1]; // 只在前两个位置放置卡牌
        
        opponentCards.forEach((card, index) => {
            this.opponent.board[positions[index]] = card;
        });
        
        this.calculateActiveGods('opponent');
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 手牌点击事件（保留原有功能）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card')) {
                this.selectCard(e.target.closest('.card'));
            }
        });
        
        // 格子点击事件（保留原有功能）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.grid-cell.player')) {
                this.placeCard(e.target.closest('.grid-cell'));
            }
        });
        
        // 拖拽事件监听器
        this.setupDragAndDrop();
    }
    
    // 设置拖拽功能
    setupDragAndDrop() {
        // 拖拽开始事件
        document.addEventListener('dragstart', (e) => {
            if (e.target.closest('.card')) {
                const cardElement = e.target.closest('.card');
                const cardId = cardElement.dataset.cardId;
                const card = this.player.hand.find(c => c.id === cardId);
                
                if (card) {
                    this.draggedCard = card;
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', cardElement.outerHTML);
                    
                    // 添加拖拽样式
                    cardElement.classList.add('dragging');
                    
                    // 高亮可放置区域
                    this.highlightDropZones(true);
                    
                    this.addLogEntry(`开始拖拽 ${card.name}`, 'player');
                }
            }
        });
        
        // 拖拽结束事件
        document.addEventListener('dragend', (e) => {
            if (e.target.closest('.card')) {
                e.target.closest('.card').classList.remove('dragging');
                this.highlightDropZones(false);
                this.draggedCard = null;
            }
        });
        
        // 拖拽进入目标区域
        document.addEventListener('dragenter', (e) => {
            if (e.target.closest('.grid-cell.player')) {
                e.preventDefault();
                const cell = e.target.closest('.grid-cell.player');
                if (this.canDropCard(cell)) {
                    cell.classList.add('drag-over');
                }
            }
        });
        
        // 拖拽在目标区域移动
        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.grid-cell.player')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });
        
        // 拖拽离开目标区域
        document.addEventListener('dragleave', (e) => {
            if (e.target.closest('.grid-cell.player')) {
                const cell = e.target.closest('.grid-cell.player');
                // 检查是否真的离开了cell（而不是进入子元素）
                if (!cell.contains(e.relatedTarget)) {
                    cell.classList.remove('drag-over');
                }
            }
        });
        
        // 放置卡牌
        document.addEventListener('drop', (e) => {
            if (e.target.closest('.grid-cell.player')) {
                e.preventDefault();
                const cell = e.target.closest('.grid-cell.player');
                cell.classList.remove('drag-over');
                
                if (this.draggedCard && this.canDropCard(cell)) {
                    this.dropCard(cell);
                }
            }
        });
    }
    
    // 检查是否可以放置卡牌
    canDropCard(cellElement) {
        if (!this.draggedCard) return false;
        
        const position = parseInt(cellElement.dataset.position) - 4;
        
        // 检查位置是否已被占用
        if (this.player.board[position] !== null) {
            return false;
        }
        
        // 移除行动点数检查
        return true;
    }
    
    // 放置卡牌（拖拽版本）
    dropCard(cellElement) {
        if (!this.draggedCard) return;
        
        const position = parseInt(cellElement.dataset.position) - 4;
        
        if (!this.canDropCard(cellElement)) {
            this.addLogEntry('无法在此位置放置卡牌！', 'system');
            return;
        }
        
        // 放置卡牌
        this.player.board[position] = this.draggedCard;
        // 移除行动点数扣除
        
        // 从手牌中移除
        this.player.hand = this.player.hand.filter(card => card.id !== this.draggedCard.id);
        
        this.addLogEntry(`通过拖拽放置了 ${this.draggedCard.name} 在 ${this.getPositionName(position)}`, 'player');
        
        // 重置选择状态
        this.selectedCard = null;
        document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
        
        // 计算神煞效果
        this.calculateActiveGods('player');
        this.updateUI();
        
        // 重置拖拽状态
        this.draggedCard = null;
        this.highlightDropZones(false);
    }
    
    // 高亮放置区域
    highlightDropZones(highlight) {
        document.querySelectorAll('.grid-cell.player').forEach(cell => {
            if (highlight) {
                if (this.canDropCard(cell)) {
                    cell.classList.add('drop-zone-available');
                } else {
                    cell.classList.add('drop-zone-unavailable');
                }
            } else {
                cell.classList.remove('drop-zone-available', 'drop-zone-unavailable', 'drag-over');
            }
        });
    }
    
    // 选择卡牌
    selectCard(cardElement) {
        // 移除之前的选择
        document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
        
        // 选择新卡牌
        cardElement.classList.add('selected');
        const cardId = cardElement.dataset.cardId;
        this.selectedCard = this.player.hand.find(card => card.id === cardId);
        
        // 高亮可放置的位置
        this.highlightValidPositions();
    }
    
    // 高亮可放置的位置
    highlightValidPositions() {
        document.querySelectorAll('.grid-cell.player').forEach(cell => {
            cell.classList.remove('glowing');
            if (!this.isPositionOccupied(parseInt(cell.dataset.position))) {
                cell.classList.add('glowing');
            }
        });
    }
    
    // 检查位置是否被占用
    isPositionOccupied(position) {
        return this.player.board[position - 4] !== null;
    }
    
    // 放置卡牌
    placeCard(cellElement) {
        if (!this.selectedCard) return;
        
        const position = parseInt(cellElement.dataset.position) - 4; // 转换为玩家板面索引
        
        if (this.player.board[position] !== null) {
            this.addLogEntry('该位置已被占用！', 'system');
            return;
        }
        
        // 移除行动点数检查
        
        // 放置卡牌
        this.player.board[position] = this.selectedCard;
        // 移除行动点数扣除
        
        // 从手牌中移除
        this.player.hand = this.player.hand.filter(card => card.id !== this.selectedCard.id);
        
        this.addLogEntry(`放置了 ${this.selectedCard.name} 在 ${this.getPositionName(position)}`, 'player');
        
        // 重置选择
        this.selectedCard = null;
        document.querySelectorAll('.card').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.remove('glowing'));
        
        // 计算神煞效果
        this.calculateActiveGods('player');
        this.updateUI();
    }
    
    // 获取位置名称
    getPositionName(position) {
        const names = ['年柱', '月柱', '日柱', '时柱'];
        return names[position];
    }
    
    // 计算激活的神煞
    calculateActiveGods(player) {
        const board = player === 'player' ? this.player.board : this.opponent.board;
        const activeGods = [];
        
        // 检查神煞激活条件
        board.forEach((card, index) => {
            if (card && this.checkGodActivationCondition(card, board)) {
                activeGods.push(card.name);
            }
        });
        
        if (player === 'player') {
            this.player.activeGods = activeGods;
        } else {
            this.opponent.activeGods = activeGods;
        }
    }
    
    // 检查神煞激活条件
    checkGodActivationCondition(card, board) {
        // 简化的激活条件检查
        switch (card.condition) {
            case '金系天干 + 土系地支':
                return this.hasElementCombination(board, 'metal', 'earth');
            case '水系天干 + 木系地支':
                return this.hasElementCombination(board, 'water', 'wood');
            case '天干归位':
                return true; // 简化条件
            case '金系组合':
                return this.hasElement(board, 'metal');
            case '阴阳平衡':
                return this.checkYinYangBalance(board);
            default:
                return true;
        }
    }
    
    // 检查元素组合
    hasElementCombination(board, element1, element2) {
        const elements = board.filter(card => card).map(card => card.element);
        return elements.includes(element1) && elements.includes(element2);
    }
    
    // 检查是否有某个元素
    hasElement(board, element) {
        return board.some(card => card && card.element === element);
    }
    
    // 检查阴阳平衡
    checkYinYangBalance(board) {
        const cards = board.filter(card => card);
        return cards.length >= 4; // 简化条件
    }
    
    // 结束回合
    endTurn() {
        this.addLogEntry(`第${this.currentTurn}回合结束`, 'system');
        
        // AI回合
        this.aiTurn();
        
        // 处理回合结束事件
        this.processEndOfTurn();
        
        // 开始新回合
        this.currentTurn++;
        
        // 抽卡
        if (this.player.hand.length < 7) {
            this.player.hand.push(...this.drawCards(1));
        }
        
        // 处理公共卡池自动翻开
        this.processPublicPool();
        
        this.addLogEntry(`第${this.currentTurn}回合开始`, 'system');
        this.updateUI();
    }
    
    // AI回合
    aiTurn() {
        this.addLogEntry('AI虚拟人格思考中...', 'opponent');
        
        setTimeout(() => {
            // AI随机选择一个行动
            const actions = ['attack', 'defend', 'special'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            switch (action) {
                case 'attack':
                    this.aiAttack();
                    break;
                case 'defend':
                    this.aiDefend();
                    break;
                case 'special':
                    this.aiSpecialAction();
                    break;
            }
        }, 1000);
    }
    
    // AI攻击
    aiAttack() {
        // AI选择一个攻击性神煞
        const attackCards = this.opponent.board.filter(card => 
            card && (card.type === 'inauspicious' || card.power >= 3)
        );
        
        if (attackCards.length > 0) {
            const card = attackCards[0];
            const damage = this.calculateDamage(card);
            this.player.remainingElements = Math.max(0, this.player.remainingElements - damage);
            
            this.addLogEntry(`AI使用 ${card.name} 中和 ${damage} 枚元素`, 'opponent');
            
            if (this.player.remainingElements <= 0) {
                this.endGame('defeat');
            }
        } else {
            this.addLogEntry('AI选择防守', 'opponent');
        }
    }
    
    // AI防御
    aiDefend() {
        this.addLogEntry('AI加强防御', 'opponent');
    }
    
    // AI特殊行动
    aiSpecialAction() {
        this.addLogEntry('AI使用特殊能力', 'opponent');
    }
    
    // 计算伤害
    calculateDamage(card) {
        let damage = card.power;
        
        // 根据五行相克关系调整伤害
        if (this.checkElementAdvantage(card.element)) {
            damage = Math.floor(damage * 1.5);
        }
        
        return damage;
    }
    
    // 检查五行优势
    checkElementAdvantage(element) {
        // 简化的五行相克逻辑
        return Math.random() > 0.5;
    }
    
    // 处理回合结束
    processEndOfTurn() {
        // 处理持续效果
        this.processOngoingEffects();
        
        // 检查胜负条件
        this.checkWinConditions();
    }
    
    // 处理持续效果
    processOngoingEffects() {
        // 处理禄神的资源生成
        if (this.player.activeGods.includes('禄神')) {
            this.addLogEntry('禄神效果：获得额外效果', 'player');
        }
    }
    
    // 检查胜负条件
    checkWinConditions() {
        if (this.player.remainingElements <= 0) {
            this.endGame('defeat');
        } else if (this.opponent.remainingElements <= 0) {
            this.endGame('victory');
        } else if (this.currentTurn >= 15) {
            this.endGame('draw');
        }
    }
    
    // 处理公共卡池
    processPublicPool() {
        // 每2回合自动翻开一张公共卡
        if (this.currentTurn % 2 === 0) {
            this.openPublicCard();
        }
    }
    
    // 翻开公共卡
    openPublicCard() {
        if (this.publicPoolOpen.length < this.publicPool.length) {
            const card = this.publicPool[this.publicPoolOpen.length];
            this.publicPoolOpen.push(card);
            
            this.addLogEntry(`公共卡池翻开：${card.name}`, 'system');
            this.applyPublicCardEffect(card);
        }
    }
    
    // 应用公共卡效果
    applyPublicCardEffect(card) {
        switch (card.type) {
            case 'auspicious':
                this.addLogEntry(`${card.name} 为双方提供增益效果`, 'system');
                // 属性分配：恢复空位或强化神煞
                break;
            case 'inauspicious':
                this.addLogEntry(`${card.name} 对双方造成中和效果`, 'system');
                this.player.remainingElements = Math.max(0, this.player.remainingElements - 1);
                this.opponent.remainingElements = Math.max(0, this.opponent.remainingElements - 1);
                // 属性分配：中和凶神或削弱对手
                break;
            case 'special':
                this.addLogEntry(`${card.name} 按描述执行特殊效果`, 'system');
                break;
        }
    }
    
    // 使用特殊能力
    useSpecialAbility() {
        if (this.player.activeGods.length === 0) {
            this.addLogEntry('没有激活的神煞可使用！', 'system');
            return;
        }
        
        const god = this.player.activeGods[0];
        this.addLogEntry(`使用神煞能力：${god}`, 'player');
        
        // 根据不同神煞执行不同效果
        this.executeGodAbility(god);
    }
    
    // 执行神煞能力
    executeGodAbility(godName) {
        switch (godName) {
            case '天乙贵人':
                this.addLogEntry('天乙贵人：保护己方免受中和', 'player');
                break;
            case '文昌贵人':
                this.addLogEntry('文昌贵人：智慧加成，额外抽卡', 'player');
                this.player.hand.push(...this.drawCards(1));
                break;
            case '羊刃':
                this.addLogEntry('羊刃：对敌方造成强力中和', 'player');
                this.opponent.remainingElements = Math.max(0, this.opponent.remainingElements - 3);
                break;
            default:
                this.addLogEntry(`${godName}：发动特殊效果`, 'player');
        }
        
        this.updateUI();
    }
    
    // 显示公共卡池
    showPublicPool() {
        const poolInfo = this.publicPoolOpen.map(card => card.name).join(', ');
        if (poolInfo) {
            this.addLogEntry(`已翻开的公共卡：${poolInfo}`, 'system');
        } else {
            this.addLogEntry('公共卡池尚未翻开任何卡牌', 'system');
        }
    }
    
    // 结束游戏
    endGame(result) {
        this.gamePhase = 'ended';
        
        switch (result) {
            case 'victory':
                this.addLogEntry('🎉 胜利！络尘成功击败了AI虚拟人格！', 'player');
                break;
            case 'defeat':
                this.addLogEntry('💀 失败！络尘被AI虚拟人格击败...', 'opponent');
                break;
            case 'draw':
                this.addLogEntry('⚖️ 平局！双方势均力敌！', 'system');
                break;
        }
        
        // 禁用操作
        document.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
    }
    
    // 添加日志
    addLogEntry(message, type = 'system') {
        const logContainer = document.getElementById('logContainer');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type} fade-in`;
        logEntry.textContent = message;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // 更新UI
    updateUI() {
        this.updateStatusBar();
        this.updatePlayerInfo();
        this.updateHandCards();
        this.updateBoard();
    }
    
    // 更新状态栏
    updateStatusBar() {
        document.getElementById('currentTurn').textContent = this.currentTurn;
        document.getElementById('handCount').textContent = this.player.hand.length;
        
        // 更新大运
        const eras = ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳'];
        const eraIndex = Math.floor((this.currentTurn - 1) / 5) % eras.length;
        document.getElementById('currentEra').textContent = eras[eraIndex];
    }
    
    // 更新玩家信息
    updatePlayerInfo() {
        const elementsPercent = (this.player.remainingElements / 8) * 100;
        document.getElementById('playerHealth').style.width = `${elementsPercent}%`;
        
        // 显示八字而不是数值
        const baziText = `${this.player.bazi.year.gan}${this.player.bazi.year.zhi} ${this.player.bazi.month.gan}${this.player.bazi.month.zhi} ${this.player.bazi.day.gan}${this.player.bazi.day.zhi} ${this.player.bazi.hour.gan}${this.player.bazi.hour.zhi}`;
        document.getElementById('playerHealthText').textContent = baziText;
        
        document.getElementById('playerStatus').textContent = this.player.status;
        document.getElementById('playerActiveGods').textContent = 
            this.player.activeGods.length > 0 ? this.player.activeGods.join(', ') : '无';
    }
    
    // 更新手牌显示
    updateHandCards() {
        const handContainer = document.getElementById('handCards');
        handContainer.innerHTML = '';
        
        this.player.hand.forEach(card => {
            const cardElement = this.createCardElement(card);
            handContainer.appendChild(cardElement);
        });
    }
    
    // 创建卡牌元素
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.type}`;
        cardDiv.dataset.cardId = card.id;
        cardDiv.draggable = true; // 启用拖拽
        
        cardDiv.innerHTML = `
            <div class="card-header">
                <span class="card-type">${this.getCardTypeText(card.type)}</span>
                <span class="card-rarity">${card.rarity}</span>
            </div>
            <div class="card-title element-${card.element}">${card.name}</div>
            <div class="card-description">${card.description}</div>
            <div class="card-stats">
                <div class="stat power-stat">⚡${card.power}</div>
            </div>
        `;
        
        return cardDiv;
    }
    
    // 获取卡牌类型文本
    getCardTypeText(type) {
        switch (type) {
            case 'auspicious': return '吉神';
            case 'inauspicious': return '凶神';
            case 'special': return '特殊';
            default: return '未知';
        }
    }
    
    // 更新战场
    updateBoard() {
        // 更新玩家板面（4个位置）
        for (let i = 0; i < 4; i++) {
            const cell = document.querySelector(`[data-position="${i + 4}"]`);
            const card = this.player.board[i];
            
            if (card) {
                cell.classList.add('occupied');
                cell.innerHTML = `
                    <div class="pillar-label">${this.getPillarLabel(i)}</div>
                    <div class="card-in-cell">
                        <div class="card-name element-${card.element}">${card.name}</div>
                        <div class="card-power">⚡${card.power}</div>
                    </div>
                `;
            } else {
                cell.classList.remove('occupied');
                cell.innerHTML = `
                    <div class="pillar-label">${this.getPillarLabel(i)}</div>
                `;
            }
        }
        
        // 更新对手板面（4个位置）
        for (let i = 0; i < 4; i++) {
            const cell = document.querySelector(`[data-position="${i}"]`);
            const card = this.opponent.board[i];
            
            if (card) {
                cell.classList.add('occupied');
                cell.innerHTML = `
                    <div class="pillar-label">${this.getPillarLabel(i)}</div>
                    <div class="card-in-cell">
                        <div class="card-name element-${card.element}">${card.name}</div>
                        <div class="card-power">⚡${card.power}</div>
                    </div>
                `;
            } else {
                cell.classList.remove('occupied');
                cell.innerHTML = `
                    <div class="pillar-label">${this.getPillarLabel(i)}</div>
                `;
            }
        }
    }
    
    // 获取柱位标签
    getPillarLabel(position) {
        const labels = ['年柱', '月柱', '日柱', '时柱'];
        return labels[position];
    }
}

// 全局函数
function endTurn() {
    if (window.game) {
        window.game.endTurn();
    }
}

function useSpecialAbility() {
    if (window.game) {
        window.game.useSpecialAbility();
    }
}

function showPublicPool() {
    if (window.game) {
        window.game.showPublicPool();
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    window.game = new LZoreGame();
    console.log('L-Zore 神煞卡牌战斗系统已启动！');
}); 