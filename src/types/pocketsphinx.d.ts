/**
 * PocketSphinx.js 类型声明
 */

declare module 'pocketsphinx.js' {
    interface PocketSphinxConfig {
        hmm?: string;
        dict?: string;
        lm?: string;
        samprate?: number;
        nfft?: number;
        nfilt?: number;
        beam?: number;
        pbeam?: number;
        wbeam?: number;
        kws_threshold?: number;
    }
    
    class PocketSphinx {
        constructor(config: PocketSphinxConfig);
        
        start(): void;
        stop(): void;
        postMessage(data: any): void;
        addWords(words: string[]): void;
        addKeyword(keyword: string, threshold?: number): void;
        
        onmessage?: (event: any) => void;
        onerror?: (error: any) => void;
    }
    
    export = PocketSphinx;
} 