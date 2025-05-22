import React from 'react';
import { Person } from '../types/Person';
import { NoMatch } from './Nomatch';

type AutoCompleteProps = {
  suggestions: Person[];
  shouldShowDropdown: boolean;
  selectPersonFromTheList: (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => void;
  inputValue: string;
};

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  suggestions,
  shouldShowDropdown,
  selectPersonFromTheList,
  inputValue,
}) => {
  const hasSuggestions = suggestions.length > 0;
  const hasInputValue = inputValue !== '';
  const shouldShowNoMatch = !hasSuggestions && hasInputValue;

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      {shouldShowDropdown && (
        <div className="dropdown-content">
          {hasSuggestions ? (
            suggestions.map(({ name, slug }) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={slug}
              >
                <p
                  className="has-text-link"
                  onMouseDown={selectPersonFromTheList}
                >
                  {name}
                </p>
              </div>
            ))
          ) : shouldShowNoMatch ? (
            <NoMatch />
          ) : null}
        </div>
      )}
    </div>
  );
};
