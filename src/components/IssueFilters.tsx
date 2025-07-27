import React from 'react';

interface IssueFiltersProps {
  searchTerm: string;
  assigneeFilter: string;
  severityFilter: number | '';
  onSearchChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onSeverityChange: (value: number | '') => void;
}

const IssueFilters: React.FC<IssueFiltersProps> = ({
  searchTerm,
  assigneeFilter,
  severityFilter,
  onSearchChange,
  onAssigneeChange,
  onSeverityChange,
}) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by title or tags..."
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by assignee..."
        value={assigneeFilter}
        onChange={e => onAssigneeChange(e.target.value)}
      />
      <input
        type="number"
        placeholder="Filter by severity..."
        value={severityFilter}
        onChange={e =>
          onSeverityChange(e.target.value === '' ? '' : Number(e.target.value))
        }
      />
    </div>
  );
};

export default IssueFilters;
