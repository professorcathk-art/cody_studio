export type UserRole = "admin" | "boss";

export type DesignStatus = "待審批" | "已批准" | "打版中" | "生產中";

export const DESIGN_STATUSES: DesignStatus[] = [
  "待審批",
  "已批准",
  "打版中",
  "生產中",
];

export interface User {
  id: string;
  name: string;
  passcode: string;
  role: UserRole;
  created_at: string;
}

export interface Design {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  status: DesignStatus;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  design_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  design_id: string;
  author_name: string;
  role: UserRole;
  content: string;
  created_at: string;
}

export interface SessionUser {
  userId: string;
  name: string;
  role: UserRole;
}

export interface DesignWithFavorite extends Design {
  is_favorited: boolean;
}
