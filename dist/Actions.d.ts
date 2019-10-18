export declare class Actions {
    id: string;
    private opts;
    EVstart: string;
    EVmove: string;
    EVend: string;
    canmoveHandle: boolean;
    handle1Elem: HTMLElement;
    handle2Elem: HTMLElement;
    constructor(id: string, params: any);
    private setupOptions;
    private setupEvents;
    private updateValue;
    private calculateHandlePostion;
    private drag;
    private drop;
    private move;
    private moveHandle;
    private limitOppositeHandles;
    private snapHandle;
    private changeHandlePosAndVal;
}
