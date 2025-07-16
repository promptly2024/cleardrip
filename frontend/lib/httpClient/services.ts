import { BookServiceForm, Service, ServicesResponse } from "../types/services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ServicesClass {
    // Book Service by User 
    static async bookService(data: BookServiceForm): Promise<BookServiceForm>{
        try {
            const response = await fetch(`${API_BASE_URL}/services/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    type: data.type,
                    scheduledDate: data.scheduledDate,
                    beforeImageUrl: data.beforeImageUrl || undefined,
                    afterImageUrl: data.afterImageUrl || undefined
                }),
            });

            const result = await response.json();

            if(!response.ok){
                throw new Error(result.error || 'Cannot create Service');
            }

            return result;
        }
        catch(error){
            console.log('Error creating services: ' + error);
            throw error; 
        }
    }

    // GetAllServices 
    static async getAllServices(page: number, skip: number): Promise<ServicesResponse>{
        try {
            const response = await fetch(`${API_BASE_URL}/services?take=${page}&skip=${skip}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const result = await response.json();

            if(!response.ok){
                throw new Error (result.error || 'Cannot fetch all services');
            }

            return {
                services: result.services || result,
                pagination: result.pagination || result,
                message: result.message || result
            }
        }
        catch(error){
            console.log('Error fetching services: ' + error);
            throw error; 
        }
    }

    // GetServicesById
    static async getServicesById(id: string): Promise<Service>{
        try {
            const response = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const result = await response.json();

            if(!response.ok){
                throw new Error (result.error || `Cannot fetch service with id ${id}`);
            }

            return result;
        }
        catch(error){
            console.error('Error fetching service: ', error);
            throw error;
        }
    }

    // UpdateServiceStatus (can only done by admin, superadmin)
    static async updateServiceStatus(id: string, status: string): Promise<Service>{
        try {
            const response = await fetch(`${API_BASE_URL}/services/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status })
            });

            const result = await response.json();

            if(!response.ok){
                throw new Error(result.message || result.error || "Failed to update status");
            }

            return result;
        }
        catch(error){
            console.log('Error updating service status', error);
            throw error;
        }
    }

    // Delete Service
    static async deleteService(id: string): Promise<{ message: string }>{
        try {
            const response = await fetch(`${API_BASE_URL}/services/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || result.error || 'Failed to cancel service');
            }

            return result;
        }
        catch(error){
            console.error('Error deleting service: ', error);
            throw error;
        }
    }
}