import Phaser from 'phaser';
import type { GameState } from '../types/gameTypes';
import { GAME_CONFIG } from '../constants/gameData';
import { getPillarName } from '../utils/gameUtils';

/**
 * 战场管理器
 * 负责战场布局、拖拽系统
 */
export class BattlefieldManager {
    private scene: Phaser.Scene;
    private gameState: GameState;
    private battleField!: Phaser.GameObjects.Container;
    private dropZones: Phaser.GameObjects.Zone[] = [];
    private gridCells: Phaser.GameObjects.Rectangle[] = [];
    private draggedCard: Phaser.GameObjects.Container | null = null;
    private messageCallback: (text: string, type: 'success' | 'warning' | 'error') => void;
    private onCardPlaced: (card: Phaser.GameObjects.Container, position: number) => void;

    constructor(
        scene: Phaser.Scene,
        gameState: GameState,
        messageCallback: (text: string, type: 'success' | 'warning' | 'error') => void,
        onCardPlaced: (card: Phaser.GameObjects.Container, position: number) => void
    ) {
        this.scene = scene;
        this.gameState = gameState;
        this.messageCallback = messageCallback;
        this.onCardPlaced = onCardPlaced;
    }

    /**
     * 创建战场布局
     */
    createBattleField(): Phaser.GameObjects.Container {
        const { width, height } = this.scene.cameras.main;
        
        // 创建战场容器
        this.battleField = this.scene.add.container(width / 2, height / 2);
        
        // 创建八格战场布局
        this.createEightGridBattlefield();
        
        // 创建拖放区域
        this.createDropZones();
        
        return this.battleField;
    }

    /**
     * 创建八格战场布局
     */
    private createEightGridBattlefield() {
        const gridWidth = 600;
        const gridHeight = 300;
        const cellWidth = gridWidth / 4;
        const cellHeight = gridHeight / 2;
        
        // 创建战场背景
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.3);
        bg.fillRect(-gridWidth / 2, -gridHeight / 2, gridWidth, gridHeight);
        
        // 创建网格线
        bg.lineStyle(2, 0x00ffff, 0.5);
        
        // 垂直线
        for (let i = 1; i < 4; i++) {
            const x = -gridWidth / 2 + i * cellWidth;
            bg.moveTo(x, -gridHeight / 2);
            bg.lineTo(x, gridHeight / 2);
        }
        
        // 水平线
        const y = 0;
        bg.moveTo(-gridWidth / 2, y);
        bg.lineTo(gridWidth / 2, y);
        
        bg.strokePath();
        this.battleField.add(bg);
        
        // 创建格子和标签
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const position = row * 4 + col;
                const x = -gridWidth / 2 + col * cellWidth + cellWidth / 2;
                const y = -gridHeight / 2 + row * cellHeight + cellHeight / 2;
                
                // 创建格子
                const cell = this.scene.add.rectangle(x, y, cellWidth - 4, cellHeight - 4, 0x0066ff, 0.1);
                cell.setStrokeStyle(2, 0x0066ff, 0.3);
                this.battleField.add(cell);
                this.gridCells.push(cell);
                
                // 添加位置标签
                const label = this.scene.add.text(x, y - cellHeight / 2 + 15, 
                    `${getPillarName(position)}\n(${position})`, {
                    fontSize: '12px',
                    color: '#88ffff',
                    align: 'center'
                });
                label.setOrigin(0.5);
                this.battleField.add(label);
            }
        }
        
        // 添加区域标签
        const playerLabel = this.scene.add.text(0, gridHeight / 2 - 15, '玩家区域', {
            fontSize: '14px',
            color: '#00ff88',
            fontStyle: 'bold'
        });
        playerLabel.setOrigin(0.5);
        this.battleField.add(playerLabel);
        
        const opponentLabel = this.scene.add.text(0, -gridHeight / 2 + 15, '对手区域', {
            fontSize: '14px',
            color: '#ff6666',
            fontStyle: 'bold'
        });
        opponentLabel.setOrigin(0.5);
        this.battleField.add(opponentLabel);
    }

    /**
     * 创建拖放区域
     */
    private createDropZones() {
        const gridWidth = 600;
        const gridHeight = 300;
        const cellWidth = gridWidth / 4;
        const cellHeight = gridHeight / 2;
        
        // 只为玩家区域（下半部分）创建拖放区域
        for (let col = 0; col < 4; col++) {
            const position = 4 + col; // 玩家区域位置 4-7
            const x = this.battleField.x - gridWidth / 2 + col * cellWidth + cellWidth / 2;
            const y = this.battleField.y + cellHeight / 2;
            
            const dropZone = this.scene.add.zone(x, y, cellWidth - 4, cellHeight - 4);
            dropZone.setRectangleDropZone(cellWidth - 4, cellHeight - 4);
            dropZone.setData('position', position);
            
            this.dropZones.push(dropZone);
        }
    }

    /**
     * 设置拖拽系统
     */
    setupDragAndDrop() {
        
        // 拖拽开始
        this.scene.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
            if (!this.gameState.canPlayerUseCards) {
                this.messageCallback('冷却期间无法使用卡牌！', 'warning');
                return;
            }
            
            this.draggedCard = gameObject;
            gameObject.setDepth(1000);
            
            // 高亮显示可放置区域
            this.highlightDropZones(true);
            
            this.messageCallback('拖拽卡牌到战场格子中！', 'success');
        });
        
        // 拖拽中
        this.scene.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        // 拖拽结束
        this.scene.input.on('dragend', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container) => {
            this.highlightDropZones(false);
            
            if (this.draggedCard && !this.draggedCard.getData('placed')) {
                // 只有在没有成功放置时才恢复原位置
                const originalX = this.draggedCard.getData('originalX');
                const originalY = this.draggedCard.getData('originalY');
                
                console.log(`卡牌拖拽结束，恢复到原位置: (${originalX}, ${originalY})`);
                
                this.scene.tweens.add({
                    targets: this.draggedCard,
                    x: originalX,
                    y: originalY,
                    duration: 300,
                    ease: 'Power2'
                });
                
                this.draggedCard.setDepth(0);
            }
            
            // 清理拖拽状态
            this.draggedCard = null;
        });
        
        // 放置在拖放区域
        this.scene.input.on('drop', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Container, dropZone: Phaser.GameObjects.Zone) => {
            if (!this.gameState.canPlayerUseCards) {
                this.messageCallback('冷却期间无法使用卡牌！', 'warning');
                return;
            }
            
            const position = dropZone.getData('position');
            const cardData = gameObject.getData('cardData');
            
            // 检查位置是否已被占用
            if (this.isPositionOccupied(position)) {
                this.messageCallback(`位置 ${position} (${getPillarName(position)}) 已被占用！`, 'error');
                console.log('战场状态:', this.gameState.battleFieldPositions);
                return;
            }
            
            console.log(`放置卡牌到位置 ${position}，卡牌数据:`, cardData);
            
            // 移动卡牌到新位置
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.setDepth(10);
            
            // 标记卡牌已放置和位置信息
            gameObject.setData('placed', true);
            gameObject.setData('position', position);
            
            // 禁用拖拽
            gameObject.removeInteractive();
            
            // 标记位置已占用，存储卡牌数据
            this.setPositionOccupied(position, true, cardData);
            
            console.log(`卡牌成功放置在位置 ${position}，坐标: (${gameObject.x}, ${gameObject.y})`);
            console.log('更新后的战场状态:', this.gameState.battleFieldPositions);
            
            // 触发卡牌放置事件
            this.onCardPlaced(gameObject, position);
            
            this.messageCallback(`卡牌放置在${getPillarName(position)}位置！`, 'success');
            
            // 重要：确保拖拽状态被清理
            this.draggedCard = null;
        });
    }

    /**
     * 高亮显示拖放区域
     */
    private highlightDropZones(highlight: boolean) {
        this.gridCells.slice(4).forEach(cell => { // 只高亮玩家区域
            if (highlight) {
                cell.setStrokeStyle(3, 0x00ff88, 0.8);
                cell.setFillStyle(0x00ff88, 0.2);
            } else {
                cell.setStrokeStyle(2, 0x0066ff, 0.3);
                cell.setFillStyle(0x0066ff, 0.1);
            }
        });
    }

    /**
     * 检查位置是否被占用
     */
    private isPositionOccupied(position: number): boolean {
        return this.gameState.battleFieldPositions[position] !== null;
    }

    /**
     * 设置位置占用状态
     */
    private setPositionOccupied(position: number, occupied: boolean, cardData?: any) {
        if (occupied && cardData) {
            this.gameState.battleFieldPositions[position] = cardData;
        } else {
            this.gameState.battleFieldPositions[position] = null;
        }
    }

    /**
     * 获取战场容器
     */
    getBattleField(): Phaser.GameObjects.Container {
        return this.battleField;
    }

    /**
     * 获取拖放区域
     */
    getDropZones(): Phaser.GameObjects.Zone[] {
        return this.dropZones;
    }

    /**
     * 获取网格格子
     */
    getGridCells(): Phaser.GameObjects.Rectangle[] {
        return this.gridCells;
    }

    /**
     * 清理位置状态（用于卡牌移入弃牌堆时）
     */
    clearPosition(position: number) {
        this.setPositionOccupied(position, false);
        console.log(`清理位置 ${position} 的状态`);
    }

    /**
     * 调试：打印当前战场状态
     */
    debugBattleFieldState() {
        console.log('当前战场状态:', this.gameState.battleFieldPositions);
        console.log('占用的位置:', 
            this.gameState.battleFieldPositions
                .map((card, index) => card ? `位置${index}: ${card.name}` : null)
                .filter(Boolean)
        );
    }
} 