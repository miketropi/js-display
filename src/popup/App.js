import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  font-family: Arial,sans-serif;
  color: white;

  h4 {
    margin-bottom: 8px;
  }

  input[type=search] {
    border: none;
    margin-bottom: 8px;
    width: 240px;
    padding: 10px;
    border-radius: 2px;
  }
`;

const ScriptLoopContainer = styled.div``;
const ScriptItemContainer = styled.div`
  border-bottom: solid 1px rgba(255,255,255,.2);
  padding: 5px 0;

  label {
    font-weight: bold;
    display: block;
  }

  small {

  }

  a {
    color: #faad14;
    text-decoration: underline;

    &.__link-css {
      color: #cb7ba7;
    }
  }

  .__tag {
    display: inline-block;
    background: #faad14;
    color: black;
    font-size: 11px;
    border-radius: 3px;
    padding: 2px 2px;

    &.__tag-css {
      background: #cb7ba7;
    }
  }
`;

export const ScriptItem = ({ name, url, tag }) => (<ScriptItemContainer>
  <label><span className={ ['__tag', `__tag-${ tag }`].join(' ') }>{ tag }</span> { name }</label>
  <small><a href={ url } target="_blank" className={ `__link-${ tag }` }>{ url }</a></small>
</ScriptItemContainer>)

export const ScriptLoop = ({ scripts, tag }) => {
  return <ScriptLoopContainer>
    {
      scripts.length > 0 &&
      scripts.map(({name, url}) => {
        return <ScriptItem key={ name } name={ name } url={ url } tag={ tag } />
      })
    }
  </ScriptLoopContainer>
}

export default () => {
  const [search, setSearch] = useState('');
  const [allScriptTags, setAllScriptTags] = useState([]);
  const [allStyleTags, setAllStyleTags] = useState([]);

  useEffect(async () => {
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab?.id;
    }
    
    let tabID = await getCurrentTab();
    chrome.tabs.sendMessage(
      tabID,
      { text: 'report_back' },
      (res) => {
        setAllScriptTags(res.AllScriptTags);
        setAllStyleTags(res.AllStyleTags);
      })
  }, []) 

  return <PopupContainer>
    <h4>{ allScriptTags.length } Scripts / { allStyleTags.length } Stylesheet</h4>
    <input type="search" placeholder="search" onInput={ e => setSearch(e.target.value) } value={ search } />
    {
      allScriptTags.length > 0 &&
      <ScriptLoop scripts={ allScriptTags.filter(s => s.name.includes(search)) } tag="js" />
    }
    {
      allStyleTags.length > 0 &&
      <ScriptLoop scripts={ allStyleTags.filter(s => s.name.includes(search)) } tag="css" />
    }
  </PopupContainer>
} 