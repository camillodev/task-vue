export interface CheckListItem {
  id: string;
  text: string;
  checked: boolean;
  updatedAt: string;
}

export interface CheckList {
  id: string;
  updatedAt: string;
  checklist: CheckListItem[];
}

export interface Template {
  id: string;
  updatedAt: string;
  value: string;
  items: CheckListItem[];
}
