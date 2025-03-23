// src/interfaces/recipe.ts

export interface BaseModel {
  id: string; // UUID primary key
  created_at?: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

// Recipe Model
export interface Recipe extends BaseModel {
  title: string;
  description: string;
  preparation_time: number;
  cook_time: number | null;
  serves: number;
  is_favorite: boolean;
  ingredients: Ingredient[];
  directions: Direction[];
  conversations: Conversation[];
}

// Ingredient Model
export interface Ingredient extends BaseModel {
  content: string;
  index: number;
}

// Direction Model
export interface Direction extends BaseModel {
  content: string;
  index: number;
}

// Conversation Model
export interface Conversation {
  role: "user" | "ai";
  content: string;
}

// -------------------------------------------------------------------
// 2) OPENAI RESPONSE INTERFACES
// -------------------------------------------------------------------
interface OpenAIMessage {
  role: string;
  content: string;
}

interface OpenAIChoice {
  message: OpenAIMessage;
  finish_reason: string;
  index: number;
}

export interface OpenAIChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: OpenAIChoice[];
}
