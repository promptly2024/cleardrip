export type TDSLog = {
    id: string;
    tdsValue: number;
    createdAt: string;
    [key: string]: any;
};

export type TDSLogsResponse = {
    tdsLogs: TDSLog[];
    pagination?: {
        take: number;
        skip: number;
        total: number;
        hasMore: boolean;
    };
    message?: string;
};