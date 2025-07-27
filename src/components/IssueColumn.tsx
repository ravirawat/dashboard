import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import IssueCard from './IssueCard';
import { Issue, IssueStatus } from '../types/issue';

interface Props {
  status: IssueStatus;
  issues: Issue[];
  onMove: (id: string, newStatus: IssueStatus) => void;
  isAdmin: boolean;
}

const IssueColumn: React.FC<Props> = ({ status, issues, onMove, isAdmin }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="column" ref={setNodeRef}>
      <h3>{status.toUpperCase()}</h3>
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} onMove={onMove} isAdmin={isAdmin} />
      ))}
    </div>
  );
};

export default IssueColumn;
