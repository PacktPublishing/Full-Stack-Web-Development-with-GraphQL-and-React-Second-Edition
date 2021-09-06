import React, { useState } from 'react';
import { useUserSearchQuery } from '../../apollo/queries/searchQuery';
import SearchList from './searchList';

const SearchBar = () => {
  const [text, setText] = useState('');
  const { loading, error, data } = useUserSearchQuery(text);

  const changeText = (event) => {
    setText(event.target.value);
  }

  return (
    <div className="search">
      <input type="text" onChange={changeText} value={text}
      />
      {!loading && !error && data && (
        <SearchList data={data}/>
      )}
    </div>
  );
}

export default SearchBar
