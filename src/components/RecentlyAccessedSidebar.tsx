import React, { useEffect, useState } from 'react';
import { Issue } from '../types/issue';
import { Link } from 'react-router-dom';

const RecentlyAccessedSidebar: React.FC = () => {
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentIssues');
    if (stored) {
      setRecentIssues(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="sidebar">
      <h3>Recently Accessed</h3>
      <ul>
        {recentIssues.map(issue => (
          <li key={issue.id}>
            <Link to={`/issue/${issue.id}`}>{issue.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyAccessedSidebar;
