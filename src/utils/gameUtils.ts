import { ELEMENT_MAP, CARD_TYPE_COLORS } from '../constants/gameData';

/**
 * 获取五行属性文字
 */
export function getElementText(element: string): string {
    return ELEMENT_MAP[element] || '未知';
}

/**
 * 获取卡牌类型颜色
 */
export function getCardTypeColor(cardType: string): number {
    return CARD_TYPE_COLORS[cardType] || CARD_TYPE_COLORS.default;
}

/**
 * 获取柱位名称
 */
export function getPillarName(index: number): string {
    const pillars = ['年柱', '月柱', '日柱', '时柱'];
    return pillars[index] || '未知柱位';
}

/**
 * 检查位置是否在安全边界内
 */
export function isPositionSafe(x: number, y: number, battleFieldBounds: Phaser.Geom.Rectangle): boolean {
    const safeMargin = 20; // 20像素的安全边距
    
    // 检查x坐标是否在安全范围内
    const leftBound = battleFieldBounds.x + safeMargin;
    const rightBound = battleFieldBounds.x + battleFieldBounds.width - safeMargin;
    
    // 检查y坐标是否在安全范围内
    const topBound = battleFieldBounds.y + safeMargin;
    const bottomBound = battleFieldBounds.y + battleFieldBounds.height - safeMargin;
    
    return x >= leftBound && x <= rightBound && y >= topBound && y <= bottomBound;
}

/**
 * 像素绘制工具类
 */
export class PixelDrawUtils {
    /**
     * 绘制像素风边框
     */
    static drawPixelBorder(graphics: Phaser.GameObjects.Graphics, x: number, y: number, width: number, height: number, thickness: number) {
        // 顶边
        graphics.fillRect(x, y, width, thickness);
        // 底边
        graphics.fillRect(x, y + height - thickness, width, thickness);
        // 左边
        graphics.fillRect(x, y, thickness, height);
        // 右边
        graphics.fillRect(x + width - thickness, y, thickness, height);
    }

    /**
     * 绘制像素化装饰图案
     */
    static drawPixelDecoration(graphics: Phaser.GameObjects.Graphics, width: number, height: number, color: number, type: string) {
        graphics.fillStyle(color);
        const centerX = width / 2;
        
        switch (type) {
            case 'auspicious':
                // 吉神 - 像素化太阳图案
                this.drawPixelSun(graphics, centerX, 30);
                this.drawPixelCross(graphics, centerX, height - 30, 16);
                break;
                
            case 'inauspicious':
                // 凶神 - 像素化骷髅图案
                this.drawPixelSkull(graphics, centerX, 30);
                this.drawPixelX(graphics, centerX, height - 30, 12);
                break;
                
            case 'special':
                // 特殊 - 像素化星星图案
                this.drawPixelStar(graphics, centerX, 30);
                this.drawPixelDiamond(graphics, centerX, height - 30);
                break;
                
            case 'back':
                // 卡背 - 像素化神秘符文
                this.drawPixelMysticSymbol(graphics, centerX, height / 2);
                break;
        }
    }

    /**
     * 绘制像素太阳
     */
    static drawPixelSun(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number) {
        const pixelSize = 2;
        
        // 太阳核心 - 8x8像素
        graphics.fillRect(centerX - 8, centerY - 8, 16, 16);
        
        // 太阳光线 - 4个方向
        graphics.fillRect(centerX - pixelSize, centerY - 20, pixelSize * 2, 8); // 上
        graphics.fillRect(centerX - pixelSize, centerY + 12, pixelSize * 2, 8); // 下
        graphics.fillRect(centerX - 20, centerY - pixelSize, 8, pixelSize * 2); // 左
        graphics.fillRect(centerX + 12, centerY - pixelSize, 8, pixelSize * 2); // 右
        
        // 对角光线
        graphics.fillRect(centerX - 14, centerY - 14, 4, 4); // 左上
        graphics.fillRect(centerX + 10, centerY - 14, 4, 4); // 右上
        graphics.fillRect(centerX - 14, centerY + 10, 4, 4); // 左下
        graphics.fillRect(centerX + 10, centerY + 10, 4, 4); // 右下
    }

    /**
     * 绘制像素骷髅
     */
    static drawPixelSkull(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number) {
        // 骷髅头轮廓
        graphics.fillRect(centerX - 10, centerY - 12, 20, 16); // 主体
        graphics.fillRect(centerX - 6, centerY - 16, 12, 6);   // 头顶
        
        // 眼睛孔洞（用黑色）
        graphics.fillStyle(0x000000);
        graphics.fillRect(centerX - 8, centerY - 8, 3, 4);  // 左眼
        graphics.fillRect(centerX + 4, centerY - 8, 3, 4);  // 右眼
        
        // 鼻子
        graphics.fillRect(centerX - 1, centerY - 2, 2, 3);
        
        // 嘴巴
        graphics.fillRect(centerX - 5, centerY + 4, 10, 2);
        graphics.fillRect(centerX - 2, centerY + 6, 4, 2);
    }

    /**
     * 绘制像素星星
     */
    static drawPixelStar(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number) {
        const pixelSize = 2;
        
        // 星星中心
        graphics.fillRect(centerX - pixelSize, centerY - pixelSize, pixelSize * 2, pixelSize * 2);
        
        // 四个主要方向
        graphics.fillRect(centerX - pixelSize, centerY - 12, pixelSize * 2, 8); // 上
        graphics.fillRect(centerX - pixelSize, centerY + 4, pixelSize * 2, 8);  // 下
        graphics.fillRect(centerX - 12, centerY - pixelSize, 8, pixelSize * 2); // 左
        graphics.fillRect(centerX + 4, centerY - pixelSize, 8, pixelSize * 2);  // 右
        
        // 对角线尖端
        graphics.fillRect(centerX - 8, centerY - 8, pixelSize, pixelSize);   // 左上
        graphics.fillRect(centerX + 6, centerY - 8, pixelSize, pixelSize);   // 右上
        graphics.fillRect(centerX - 8, centerY + 6, pixelSize, pixelSize);   // 左下
        graphics.fillRect(centerX + 6, centerY + 6, pixelSize, pixelSize);   // 右下
    }

    /**
     * 绘制像素十字
     */
    static drawPixelCross(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number, size: number) {
        const thickness = 3;
        const halfSize = size / 2;
        // 垂直线
        graphics.fillRect(centerX - thickness/2, centerY - halfSize, thickness, size);
        // 水平线
        graphics.fillRect(centerX - halfSize, centerY - thickness/2, size, thickness);
    }

    /**
     * 绘制像素X
     */
    static drawPixelX(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number, size: number) {
        const pixelSize = 2;
        const halfSize = size / 2;
        
        // 左上到右下对角线
        for (let i = 0; i < size; i += pixelSize) {
            graphics.fillRect(centerX - halfSize + i, centerY - halfSize + i, pixelSize, pixelSize);
        }
        
        // 右上到左下对角线
        for (let i = 0; i < size; i += pixelSize) {
            graphics.fillRect(centerX + halfSize - i, centerY - halfSize + i, pixelSize, pixelSize);
        }
    }

    /**
     * 绘制像素钻石
     */
    static drawPixelDiamond(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number) {
        const pixelSize = 2;
        
        // 钻石形状 - 从上到下逐行绘制
        const rows = [
            [centerX, centerY - 8, 1],                    // 顶点
            [centerX - 2, centerY - 6, 3],               // 第二行
            [centerX - 4, centerY - 4, 5],               // 第三行
            [centerX - 6, centerY - 2, 7],               // 第四行
            [centerX - 4, centerY, 5],                   // 中间行
            [centerX - 2, centerY + 2, 3],               // 倒数第二行
            [centerX, centerY + 4, 1]                    // 底点
        ];
        
        rows.forEach(([startX, y, width]) => {
            for (let i = 0; i < width; i += pixelSize) {
                graphics.fillRect(startX + i * pixelSize, y, pixelSize, pixelSize);
            }
        });
    }

    /**
     * 绘制像素神秘符文
     */
    static drawPixelMysticSymbol(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number) {
        const pixelSize = 2;
        
        // 外圈 - 像素化圆形
        this.drawPixelCircle(graphics, centerX, centerY, 25, pixelSize);
        
        // 中圈
        this.drawPixelCircle(graphics, centerX, centerY, 15, pixelSize);
        
        // 内部十字
        this.drawPixelCross(graphics, centerX, centerY, 16);
        
        // 四个角的小方块
        graphics.fillRect(centerX - 20, centerY - 20, 4, 4);
        graphics.fillRect(centerX + 16, centerY - 20, 4, 4);
        graphics.fillRect(centerX - 20, centerY + 16, 4, 4);
        graphics.fillRect(centerX + 16, centerY + 16, 4, 4);
    }

    /**
     * 绘制像素化圆形
     */
    static drawPixelCircle(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number, radius: number, pixelSize: number = 2) {
        // 使用简化的圆形算法绘制像素化圆
        for (let angle = 0; angle < 360; angle += 15) {
            const radian = (angle * Math.PI) / 180;
            const x = Math.round(centerX + Math.cos(radian) * radius);
            const y = Math.round(centerY + Math.sin(radian) * radius);
            
            // 确保像素对齐
            const alignedX = Math.floor(x / pixelSize) * pixelSize;
            const alignedY = Math.floor(y / pixelSize) * pixelSize;
            
            graphics.fillRect(alignedX, alignedY, pixelSize, pixelSize);
        }
    }
}

/**
 * 获取天干的五行属性
 */
export function getTianGanElement(tianGan: string): string {
    const tianGanElements: { [key: string]: string } = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火', 
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    
    return tianGanElements[tianGan] || '未知';
}

/**
 * 获取地支的五行属性
 */
export function getDiZhiElement(diZhi: string): string {
    const diZhiElements: { [key: string]: string } = {
        '子': '水', '亥': '水',
        '寅': '木', '卯': '木',
        '巳': '火', '午': '火',
        '申': '金', '酉': '金',
        '辰': '土', '戌': '土', '丑': '土', '未': '土'
    };
    
    return diZhiElements[diZhi] || '未知';
}

/**
 * 获取五行的赛博朋克色彩
 */
export function getElementColor(element: string): string {
    const elementColors: { [key: string]: string } = {
        '木': '#00ff41',  // 霓虹绿
        '火': '#ff0040',  // 霓虹红
        '土': '#ffaa00',  // 霓虹橙
        '金': '#ffffff',  // 霓虹白
        '水': '#00ffff'   // 霓虹青
    };
    
    return elementColors[element] || '#ffffff';
}

/**
 * 获取八字柱的完整信息（包含五行）
 */
export function getBaZiPillarInfo(gan: string, zhi: string): {
    text: string;
    ganElement: string;
    zhiElement: string;
    ganColor: string;
    zhiColor: string;
    displayText: string;
} {
    const ganElement = getTianGanElement(gan);
    const zhiElement = getDiZhiElement(zhi);
    
    return {
        text: `${gan}${zhi}`,
        ganElement,
        zhiElement,
        ganColor: getElementColor(ganElement),
        zhiColor: getElementColor(zhiElement),
        displayText: `${gan}${zhi}(${ganElement}${zhiElement})`
    };
}

/**
 * 获取完整的八字显示文本（包含五行）
 */
export function getFullBaZiText(baZi: { year: { gan: string; zhi: string }, month: { gan: string; zhi: string }, day: { gan: string; zhi: string }, hour: { gan: string; zhi: string } }): string {
    const yearInfo = getBaZiPillarInfo(baZi.year.gan, baZi.year.zhi);
    const monthInfo = getBaZiPillarInfo(baZi.month.gan, baZi.month.zhi);
    const dayInfo = getBaZiPillarInfo(baZi.day.gan, baZi.day.zhi);
    const hourInfo = getBaZiPillarInfo(baZi.hour.gan, baZi.hour.zhi);
    
    return `${yearInfo.displayText} ${monthInfo.displayText} ${dayInfo.displayText} ${hourInfo.displayText}`;
} 