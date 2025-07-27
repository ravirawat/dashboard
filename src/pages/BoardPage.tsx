import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Issue, IssueStatus } from '../types/issue';
import { currentUser } from '../data/user';
import IssueColumn from '../components/IssueColumn';
import { fetchIssues } from '../utils/api';
import RecentlyAccessedSidebar from '../components/RecentlyAccessedSidebar';
import IssueFilters from '../components/IssueFilters';


const BoardPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [undoQueue, setUndoQueue] = useState<{ issue: Issue; timeoutId: NodeJS.Timeout }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<number | ''>('');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const location = useLocation();

  useEffect(() => {
    const shouldRefresh = location.state?.refresh || localStorage.getItem('issueUpdated') === 'true';

    fetchIssues().then(data => {
      setIssues(data);
      setLastSyncTime(new Date());
      if (shouldRefresh) {
        localStorage.removeItem('issueUpdated');
      }
    });
  }, [location.state]);


  useEffect(() => {
    const interval = setInterval(() => {
      fetchIssues().then(data => {
        setIssues(data);
        setLastSyncTime(new Date());
        console.log('Issues synced at', new Date().toLocaleTimeString());
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const moveIssue = (id: string, newStatus: IssueStatus) => {
    if (currentUser.role !== 'admin') return;
  
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
  
    const updatedIssue = { ...issue, status: newStatus };
    const updatedIssues = issues.map(i => (i.id === id ? updatedIssue : i));
    setIssues(updatedIssues);
  
    localStorage.setItem('issues', JSON.stringify(updatedIssues));
    localStorage.setItem('issueUpdated', 'true');
  
    const timeoutId = setTimeout(() => {
      console.log('Saved to server:', updatedIssue);
    }, 500);
  
    setUndoQueue(prev => [...prev, { issue, timeoutId }]);
  };
  

  const undoLast = () => {
    setUndoQueue(prev => {
      const last = prev[prev.length - 1];
      if (!last) return prev;

      clearTimeout(last.timeoutId);
      setIssues(issues => issues.map(i => (i.id === last.issue.id ? last.issue : i)));
      return prev.slice(0, -1);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const newStatus = over.id as IssueStatus;
      moveIssue(active.id.toString(), newStatus);
    }
  };

  const getFilteredSortedIssues = (status: IssueStatus) => {
    return issues
      .filter(issue => issue.status === status)
      .filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(issue =>
        assigneeFilter ? issue.assignee.toLowerCase().includes(assigneeFilter.toLowerCase()) : true
      )
      .filter(issue =>
        severityFilter !== '' ? issue.severity === severityFilter : true
      )
      .sort((a, b) => {
        const daysSince = (date: string) => {
          const created = new Date(date);
          const now = new Date();
          return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        };

        const scoreA = a.severity * 10 - daysSince(a.createdAt) + a.userDefinedRank;
        const scoreB = b.severity * 10 - daysSince(b.createdAt) + b.userDefinedRank;

        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const statuses: IssueStatus[] = ['backlog', 'in-progress', 'done'];

  return (
    <div className="board">
      <RecentlyAccessedSidebar />
      <div className="width-full">
        <h2>Kanban-style Issue Board</h2>
        <button onClick={undoLast}>Undo</button>
      
        <IssueFilters
          searchTerm={searchTerm}
          assigneeFilter={assigneeFilter}
          severityFilter={severityFilter}
          onSearchChange={setSearchTerm}
          onAssigneeChange={setAssigneeFilter}
          onSeverityChange={setSeverityFilter}
        />

        <p className="sync-time">
          Last synced: {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'Never'}
        </p>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="columns">
            {statuses.map(status => (
              <IssueColumn
                key={status}
                status={status}
                issues={getFilteredSortedIssues(status)}
                onMove={moveIssue}
                isAdmin={currentUser.role === 'admin'}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardPage;
