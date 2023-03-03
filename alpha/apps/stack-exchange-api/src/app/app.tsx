import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Message, User } from '@alpha/api-interfaces';

export const App = () => {
  const [
    healthCheck,
    setHealthCheck
  ] = useState<Message>({ message: '' });

  const [
    top20UsersJoinedLessThan30DaysAgo,
    setTop20UsersJoinedLessThan30DaysAgo
  ] = useState<User[]>();

  const [
    askedQuestion,
    setAskedQuestion
  ] = useState<number[]>();

  const [
    gotAnswer,
    setGotAnswer
  ] = useState<number[]>();

  function getMultipleQuestions(): number[] {
    return askedQuestion?.filter((val, i) => askedQuestion?.indexOf(val) !== i) || [];
  }

  function ListItemsAnswers(users: User[]) {
    const _ = gotAnswer || [];
    const listItems = users.map((user: User) =>
      <li
        style={{
          color: _?.indexOf(user.user_id) === -1 ? '#b3b3b3' : 'green',
          fontSize: '0.8em',
          maxWidth: '250px'
        }}
        key={user.user_id.toString()}>
        {user.reputation}
        &nbsp;
        <span style={{ fontSize: '0.8em' }}>
          {moment.unix(user.creation_date).format("MMM DD YYYY")}
        </span>
        &nbsp;
        {user.display_name}
        &nbsp;
        &nbsp;
        &nbsp;
        { _?.indexOf(user.user_id) > -1 ? <span style={{ float: 'right' }}>q's: {_?.filter(x => x == user.user_id).length}</span> : (_?.indexOf(user?.user_id) > -1) }
      </li>
    );
    return (
      <div>
        <ul>{listItems}</ul>
        <span>Total Answers: { _?.length }</span>
        <p style={{ fontSize: '0.8em' }}>
          {JSON.stringify(_)}
        </p>
        &nbsp;
      </div>
    );
  }

  function ListItemsMultiple(users: User[]) {
    const _ = getMultipleQuestions() || [];
    const listItems = users.map((user: User) =>
      <li
        style={{
          color: _?.indexOf(user.user_id) === -1 ? '#b3b3b3' : 'blue',
          fontSize: '0.8em',
          maxWidth: '250px'
        }}
        key={user.user_id.toString()}>
        {user.reputation}
        &nbsp;
        <span style={{ fontSize: '0.8em' }}>
          {moment.unix(user.creation_date).format("MMM DD YYYY")}
        </span>
        &nbsp;
        {user.display_name}
        &nbsp;
        &nbsp;
        &nbsp;
        { _?.indexOf(user.user_id) > -1 ? <span style={{ float: 'right' }}>q's: {_?.filter(x => x == user.user_id).length}</span> : (_?.indexOf(user?.user_id) > -1) }
      </li>
    );
    return (
      <div>
        <ul>{listItems}</ul>
        <span>Total Answers: { _?.length }</span>
        <p style={{ fontSize: '0.8em' }}>
          {JSON.stringify(_)}
        </p>
        &nbsp;
      </div>
    );
  }

  function ListItemsQuestions(users: User[]) {
    const _ = askedQuestion || [];
    const listItems = users.map((user: User) =>
      <li
        style={{
          color: _?.indexOf(user.user_id) === -1 ? '#b3b3b3' : 'red',
          fontSize: '0.8em',
          maxWidth: '250px'
        }}
        key={user.user_id.toString()}>
        {user.reputation}
        &nbsp;
        <span style={{ fontSize: '0.8em' }}>
          {moment.unix(user.creation_date).format("MMM DD YYYY")}
        </span>
        &nbsp;
        {user.display_name}
        &nbsp;
        &nbsp;
        &nbsp;
        { (_?.indexOf(user.user_id || 0) || -1) > -1 ? <span style={{ float: 'right' }}>q's: {_?.filter(x => x == user.user_id).length}</span> : ''}
      </li>
    );
    return (
      <div>
        <ul>{listItems}</ul>
        <span>Total Questions: { _?.length }</span>
        <p style={{ fontSize: '0.8em' }}>
          {JSON.stringify(_)}
        </p>
        &nbsp;
      </div>
    );
  }

  function q1() {
    fetch('/api/users/20/days-joined-elt/30')
    .then((r) => r.json())
    .then(users => {
      setTop20UsersJoinedLessThan30DaysAgo(users);
      const userIds = users.map((user: User) => user.user_id);
      fetch('/api/users/questions', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userIds })
        })
        .then((r) => r.json())
        .then(setAskedQuestion)
        .catch(function(error) { 
          console.log('/api/users/questions', error) 
        });
    })
    .catch(function(error) { 
      console.log('/api/users/20/days-joined-elt/30 Failed', error) 
    });
  }

  function q2() {
    const userIds = top20UsersJoinedLessThan30DaysAgo?.map((user: User) => user.user_id) || [];
    fetch('/api/users/answers', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userIds })
      })
      .then((r) => r.json())
      .then(setGotAnswer)
      .catch(function(error) { 
        console.log('/api/users/answers', error) 
      });
  }

  useEffect(() => {
    fetch('/api/health-check')
      .then((r) => r.json())
      .then(setHealthCheck)
      .catch(function(error) { 
        console.log('/api/health-check Failed', error) 
      });
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to stack-exchange-api!</h1>
        <span>Health Check: {healthCheck.message}</span>
        <p>
          <button onClick={() => q1()}>
            Questions 1 & 3
          </button>
          &nbsp;
          <button onClick={() => q2()}>
            Question 2
          </button>
        </p>
      </div>
      <div>
        <ol>
          <li style={{ margin: '1.5em 0' }}>
            Of the top 20 users by reputation who joined StackOverflow in the last month ({top20UsersJoinedLessThan30DaysAgo?.length || 0})...
            <p></p>
            How many of those users have asked a question? {[...new Set(askedQuestion || [])].length || 0}
            {
              askedQuestion?.length ?
              <ul>
                <li>
                  Top 20 New Users by Reputation
                    <ol>{ListItemsQuestions(top20UsersJoinedLessThan30DaysAgo || [])}</ol>
                </li>
              </ul>
              : '' 
            }
          </li>
          <li style={{ margin: '1.5em 0' }}>
            How many of those questions have been answered? {gotAnswer?.length || 0}
            {
              gotAnswer?.length ?
              <ul>
                <li>
                  Users with Answers
                    <ol>{ListItemsAnswers(top20UsersJoinedLessThan30DaysAgo || [])}</ol>
                </li>
              </ul>
              : '' 
            }
          </li>
          <li style={{ margin: '1.5em 0' }}>
            Have any of these users asked multiple questions? { getMultipleQuestions().length }
            {
              getMultipleQuestions()?.length ?
              <ul>
                <li>
                  Top 20 New Users by Reputation
                    <ol>{ListItemsMultiple(top20UsersJoinedLessThan30DaysAgo || [])}</ol>
                </li>
              </ul>
              : '' 
            }
          </li>
        </ol>
      </div>
    </>
  );
};

export default App;
