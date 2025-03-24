export interface Task{
    taskID: number;
    projectID: number;
    projectName: string;
    taskName: string;
    taskDescription: string;
    startDate: string;
    dueDate: string;
    status: string;
    priorityLevel: string;
    isDeleted: boolean;
}

export interface AddTask{
    
    projectID: number;
    projectName: string;
    taskName: string;
    taskDescription: string;
    startDate: string;
    dueDate: string;
    status: string;
    priorityLevel: string;
    
}

export interface EditTask{
    taskID: number;
    projectID: number;
    projectName: string;
    taskName: string;
    taskDescription: string;
    startDate: string;
    dueDate: string;
    status: string;
    priorityLevel: string;
}