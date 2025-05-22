import React, { useCallback, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { AutoComplete } from './components/Autocomplete';

type AppProps = {
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<AppProps> = ({ delay = 300, onSelected }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const lastSearchQueryRef = useRef('');

  const { name, born, died } = selectedPerson || {
    name: '',
    born: '',
    died: '',
  };

  const titleText = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  const inputRef = useRef<HTMLInputElement>(null);

  const filterPeople = useCallback(() => {
    const inputValue = inputRef.current?.value.toLowerCase().trim() || '';

    if (inputValue === lastSearchQueryRef.current) {
      return;
    }

    lastSearchQueryRef.current = inputValue;

    if (inputValue === '') {
      setSuggestions(peopleFromServer);
    } else {
      const filteredPeople = peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(inputValue),
      );

      setSuggestions(filteredPeople);
    }

    setIsDropdownActive(true);
  }, [setSuggestions, setIsDropdownActive]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFilter = useCallback(debounce(filterPeople, delay), [
    filterPeople,
    delay,
  ]);

  const handleQueryChange = () => {
    if (selectedPerson) {
      setSelectedPerson(null);
      onSelected?.(null);
    }

    setIsDropdownActive(false);

    debounceFilter();
  };

  const handleInputFocus = () => {
    const inputValue = inputRef.current?.value.toLowerCase().trim() || '';

    if (inputValue === '') {
      setSuggestions(peopleFromServer);
      lastSearchQueryRef.current = '';
    }

    setIsDropdownActive(true);
  };

  const handleInputBlur = () => {
    setIsDropdownActive(false);
  };

  const selectPersonFromTheList = (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    const selectedPersonName = event.currentTarget.textContent;

    const person = peopleFromServer.find(
      targetPerson => targetPerson.name === selectedPersonName,
    );

    if (person && inputRef.current) {
      setSelectedPerson(person);
      inputRef.current.value = person.name;
      setIsDropdownActive(false);
      onSelected?.(person);
    }
  };

  const shouldShowDropdown = isDropdownActive && !selectedPerson;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>
        <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              defaultValue=""
              onChange={handleQueryChange}
              data-cy="search-input"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>

          <AutoComplete
            suggestions={suggestions}
            shouldShowDropdown={shouldShowDropdown}
            selectPersonFromTheList={selectPersonFromTheList}
            inputValue={inputRef.current?.value.trim() || ''}
          />
        </div>
      </main>
    </div>
  );
};
