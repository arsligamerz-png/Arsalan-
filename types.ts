
export enum Role {
    User = 'user',
    Model = 'model',
}

export interface Message {
    id: number | string;
    text: string;
    role: Role;
    timestamp: string;
}

export enum ChatMode {
    Fun = 'fun',
    Focus = 'focus',
}
