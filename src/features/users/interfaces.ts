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
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
