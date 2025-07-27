import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Issue, IssueStatus } from '../types/issue';
import { Link } from 'react-router-dom';

interface Props {
  issue: Issue;
  onMove: (id: string, newStatus: IssueStatus) => void;
  isAdmin: boolean;
}

const IssueCard: React.FC<Props> = ({ issue, onMove, isAdmin }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: issue.id,
  });

  const nextStatus: Record<IssueStatus, IssueStatus | null> = {
    backlog: 'in-progress',
    'in-progress': 'done',
    done: null,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="issue-card">
      <h4> <Link to={`/issue/${issue.id}`}>{issue.title}</Link></h4>
      <p>{issue.description}</p>
      {isAdmin && nextStatus[issue.status] && (
        <button onClick={() => onMove(issue.id, nextStatus[issue.status]!)}>Move to {nextStatus[issue.status]}</button>
      )}
    </div>
  );
};

export default IssueCard;
