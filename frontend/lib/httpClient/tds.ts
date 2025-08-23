import { APIURL } from "@/utils/env";
import { toast } from "sonner";
import { TDSLog, TDSLogsResponse } from "../types/tds";

export class TdsClass {
    // Log new TDS value for the current user
    static async logNewTDS(tdsData: { tdsValue: number }): Promise<TDSLog> {
        try {
            const response = await fetch(`${APIURL}/tds/log`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(tdsData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cannot log new TDS value');
            }

            return result;
        } catch (error) {
            console.error('Error logging new TDS:', error);
            throw error;
        }
    }

    // Get recent TDS logs for current user or admin (with pagination)
    static async getRecentTDSLogs(take: number = 10, skip: number = 0): Promise<TDSLogsResponse> {
        try {
            const response = await fetch(`${APIURL}/tds/recent?take=${take}&skip=${skip}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error('Failed to fetch TDS logs', {
                    description: result.error || 'Cannot retrieve recent TDS logs',
                });
                throw new Error(result.error || 'Cannot retrieve recent TDS logs');
            }

            toast.success('TDS logs retrieved successfully');

            return {
                tdsLogs: result.tdsLogs || result,
                pagination: result.pagination || null,
                message: result.message || null,
            };
        } catch (error) {
            console.error('Error fetching recent TDS logs:', error);
            throw error;
        }
    }

    // Admin: Get TDS logs for a specific user by user ID
    static async getTDSByUserId(userId: string, take: number = 10, skip: number = 0): Promise<TDSLogsResponse> {
        try {
            const response = await fetch(`${APIURL}/tds/recent/${encodeURIComponent(userId)}?take=${take}&skip=${skip}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Cannot fetch TDS logs for user ${userId}`);
            }

            return {
                tdsLogs: result.tdsLogs || result,
                pagination: result.pagination || null,
                message: result.message || null,
            };
        } catch (error) {
            console.error(`Error fetching TDS logs for user ${userId}:`, error);
            throw error;
        }
    }
}
