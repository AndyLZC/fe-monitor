export interface BaseReportObj {
    type: MonitorType;
    subType: PerformanceType;
    startTime: number;
}

export enum MonitorType {
    Performance = 'performance',
    Behavior = 'behavior',
    Error = 'error',
}

export enum PerformanceType {
    Pv = 'pv',
    Load = 'load',
    DomcontentLoaded = 'domcontentloaded',
    FirstScreenPaint = 'first-screen-paint',
}