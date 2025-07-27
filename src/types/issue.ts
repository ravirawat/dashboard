export type IssueStatus = 'backlog' | 'in-progress' | 'done';

export interface Issue {
  id: string;
  title: string;
  description: string;
  tags: string[];
  severity: number;
  assignee: string;
  createdAt: string;
  userDefinedRank: number;
  status: IssueStatus;
}
