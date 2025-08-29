// chat.model.ts
export interface ResponseSource {
    label: string;
    url: string;
}
export interface followUpQuestions {
    question: string;
}
export interface ChatResponse {
    question: string; 
    answer: any;
    sources?: ResponseSource[];
    loading?: boolean;
}
export interface ResponseMessage {
    sender: 'bot' | 'user';
    text: any;
    sources?: ResponseSource[];
    follow_up?: string[];
    loading?: boolean;
    timestamp?: Date;
    liked?: boolean;
    disliked?: boolean;
    attachment?: {
        name: string;
        size: string;
        type: string;
    };
    code?: {
        language: string;
        content: string;
    };
}
export interface AnswerSource {
    fileName: string;
    pageNumber: string;
    url: string;
}
export interface ChatMessage {
    sender: 'bot' | 'user';
    text: any;
    sources?: AnswerSource[];
    loading?: boolean;
}
export interface ChatHistory {
    question: string;
    sessionId: string;
    createdAt?: Date;
}
export interface SavedChats {
    question: string;
    sessionId: string;
}
export interface promptsLibrarylist {
    prompt: string;
}


