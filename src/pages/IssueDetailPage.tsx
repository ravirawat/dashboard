import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Issue, IssueStatus } from '../types/issue';
import { fetchIssues } from '../utils/api';
import { currentUser } from '../data/user';
import { toast } from 'react-toastify';

const IssueDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues().then(data => {
      const found = data.find(i => i.id === id);
      if (found) {
        setIssue(found);
        updateRecentlyAccessed(found);
      }
      setLoading(false);
    });
  }, [id]);

  const updateRecentlyAccessed = (issue: Issue) => {
    const stored = localStorage.getItem('recentIssues');
    let recent: Issue[] = stored ? JSON.parse(stored) : [];
    recent = [issue, ...recent.filter(i => i.id !== issue.id)].slice(0, 5);
    localStorage.setItem('recentIssues', JSON.stringify(recent));
  };

  const markAsResolved = () => {
    if (!issue || currentUser.role !== 'admin') return;

    const updatedIssue = { ...issue, status: 'done' as IssueStatus };
    setIssue(updatedIssue);

    // Save to localStorage
    const stored = localStorage.getItem('issues');
    let issues: Issue[] = stored ? JSON.parse(stored) : [];
    issues = issues.map(i => (i.id === updatedIssue.id ? updatedIssue : i));
    localStorage.setItem('issues', JSON.stringify(issues));

    toast.success(`Marked "${issue.title}" as resolved`);

    setTimeout(() => {
      navigate('/board', { state: { refresh: true } });
    }, 500);
  };

  if (loading) return <div>Loading issue...</div>;
  if (!issue) return <div>Issue not found.</div>;

  return (
    <div className="issue-detail">
      <h2>{issue.title}</h2>
      <p>{issue.description}</p>
      <p><strong>Assignee:</strong> {issue.assignee}</p>
      <p><strong>Severity:</strong> {issue.severity}</p>
      <p><strong>Status:</strong> {issue.status}</p>

      {currentUser.role === 'admin' && issue.status !== 'done' && (
        <button onClick={markAsResolved}>Mark as Resolved</button>
      )}
    </div>
  );
};

export default IssueDetailPage;
