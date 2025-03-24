export interface Project{
    projectID: number;
    userID: number;
    projectName: string;
    projectColor: string;
    dateCreated: string;
    isDeleted: boolean;
}

export interface AddProject{
    userID: number;
    projectName: string;
    projectColor: string;
}