import { AcceptResponse } from "@/types/acceptResponse";
import { ProjectState } from "@/types/project";
import { StreamState } from "@/types/streamState";
import getAxiosInstance from "@/utils/axiosInstance";


export const createProject = async (request_email: string): Promise<AcceptResponse> => {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.post('/projects', { request_email });
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
}


export const getProject = async (session_id: string): Promise<ProjectState> => {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.get(`/projects/${session_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project:", error);
        throw error;
    }
}

export const updateProject = async (session_id: string, stream_id: string,  updatedData: StreamState): Promise<ProjectState> => {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.put(`/projects/${session_id}/streams/${stream_id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Error updating project:", error);
        throw error; 
    }
}


export const continueProject = async (session_id: string): Promise<ProjectState> => {
    const axiosInstance = getAxiosInstance();
    try {
        const response = await axiosInstance.post(`/projects/${session_id}/continue`);
        return response.data;
    } catch (error) {
        console.error("Error continuing project:", error);
        throw error;
    }
}