export interface CheckListItem {
  id: string;
  text: string;
  checked: boolean;
  updatedAt: Date;
}

export interface CheckList {
  id: string;
  updatedAt: string;
  items: CheckListItem[];
}

export interface Template {
  id: string;
  updatedAt: string;
  value: string;
  items: CheckListItem[];
}
