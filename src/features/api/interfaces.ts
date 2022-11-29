export interface IGenericResponse {
  status: string;
  message: string;
  data?: Record<string, any>;
}

export interface IListResponse<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface IUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  profilePhoto: string;
  bio?: string;
  postCount: number;
  verified: boolean;
  savedPosts: string[]; // Array of post IDs
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITag {
  _id: string;
  id: string;
  name: string;
  description: string;
  createdBy: IUser;
  lastUpdatedBy: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  _id: string;
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  author: IUser;
  tags: ITag[];
  viewCount: number;
  likes: string[]; // Array of user IDs
  dislikes: string[]; // Array of user IDs
  savedBy: string[]; // Array of user IDs
  updatedAt: string;
  createdAt: string;
}

export interface IComment {
  _id: string;
  id: string;
  post: string; // Post ID
  author: IUser;
  parent: string | null; // Comment ID
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReport {
  _id: string;
  id: string;
  post: string; // Post ID
  submittedBy: IUser;
  reason: string;
  status: 'unsolved' | 'solved';
  createdAt: Date;
  updatedAt: Date;
}
