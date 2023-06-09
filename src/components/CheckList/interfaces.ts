export interface CheckListItem {
  text: string;
  checked: boolean;
  updatedAt: string;
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
