import issuesData from '../data/issues.json';
import { Issue } from '../types/issue';

export const fetchIssues = async (): Promise<Issue[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('issues');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed)) throw new Error('Invalid data format');
          resolve(parsed);
        } else {
          localStorage.setItem('issues', JSON.stringify(issuesData));
          resolve(issuesData as Issue[]);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
        reject(error);
      }
    }, 300);
  });
};

