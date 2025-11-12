import type { UserResponse } from "../models/user";

export interface UpdateUserComponentProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: UserResponse | null ; 
}