export type AuthorResponseDto = {
  id: number;
  name: string;
  email: string;
  authorType: string;
  penName?: string | null;
  createdAt: string;
  updatedAt: string;
};
