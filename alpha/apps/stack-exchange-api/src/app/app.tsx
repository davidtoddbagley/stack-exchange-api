import { Message, User } from '@alpha/api-interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

export const App = () => {
  const [
    downloadInProgress,
    setDownloadInProgress
  ] = useState<boolean>(false);

  const [
    numberOfUsersWithMultipleQuestions,
    setNumberOfUsersWithMultipleQuestions
  ] = useState<number>(0);

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

  function getCountUsersWithMultipleQuestions(usersWithQuestions: any[]): void {
    const userIds: any = {};
    const usersWithMoreThanOneQuestion: number[] = [];
    usersWithQuestions.map(userId => {
      const key = `_${userId}`;
      if (!userIds[key]) {
        userIds[key] = 1;
      } else if (usersWithMoreThanOneQuestion.indexOf(userId) === -1) {
        usersWithMoreThanOneQuestion.push(userId)
      }
      return userId;
    });
    setNumberOfUsersWithMultipleQuestions(usersWithMoreThanOneQuestion.length);
  }

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
        <ol>{listItems}</ol>
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
        <ol>{listItems}</ol>
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
    setDownloadInProgress(true);
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
        .then(data => {
          setAskedQuestion(data);
          getCountUsersWithMultipleQuestions(data);
        })
        .catch(function(error) { 
          setDownloadInProgress(false);
          console.log('/api/users/questions', error) 
        });
    })
    .then(() => setTimeout(() => {
      setDownloadInProgress(false);
    }, 1))
    .catch(function(error) { 
      console.log('/api/users/20/days-joined-elt/30 Failed', error) 
    });
  }

  function q2() {
    setDownloadInProgress(true);
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
      .then(() => setTimeout(() => {
        setDownloadInProgress(false);
      }, 1))
      .catch(function(error) { 
        setDownloadInProgress(false);
        console.log('/api/users/answers', error);
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
      <div style={{
        margin: '3vh 0',
        textAlign: 'center'
      }}>
        <h1>stack-exchange-api</h1>
        <span style={{
          color: '#b3b3b3',
          fontSize: '0.5em'
        }}>
          Health Check: {healthCheck.message}
        </span>
        { !downloadInProgress ?
          <p style={{ margin: '3vh 0' }}>
            { !askedQuestion?.length ?
              <button
                className="btn btn-primary"
                data-cy="btn-q1"
                onClick={() => q1()}>
                REQUEST ANSWERS
              </button>
            :
              '' 
            }
            { askedQuestion?.length && !gotAnswer?.length ?
              <button
                className="btn btn-success"
                data-cy="btn-q2"
                onClick={() => q2()}>
                CONTINUE
              </button>
            :
              '' 
            }

          </p>
        :
          <p style={{ margin: '3vh 0' }}>
            <button
              className="btn btn-link"
              data-cy="btn-spin">
              <FontAwesomeIcon icon={faSpinner} spinPulse />
            </button>
          </p>
        }
      </div>
      <div>
        <ol>
          <li style={{ margin: '1.5em 0' }}>
            Of the top 20 users by reputation who joined StackOverflow in the last month ({top20UsersJoinedLessThan30DaysAgo?.length || 0})...
            <p></p>
            How many of those users have asked a question? {[...new Set(askedQuestion || [])].length || 0}
            {
              askedQuestion?.length ?
              <ul style={{ fontSize: '0.5em' }}>
                <li>
                  Top 20 New Users by Reputation
                  {ListItemsQuestions(top20UsersJoinedLessThan30DaysAgo || [])}
                </li>
              </ul>
              : '' 
            }
          </li>
          <li style={{ margin: '1.5em 0' }}>
            How many of those questions have been answered? {gotAnswer?.length || 0}
            {
              gotAnswer?.length ?
              <ul style={{ fontSize: '0.5em' }}>
                <li>
                  Users with Answers
                  {ListItemsAnswers(top20UsersJoinedLessThan30DaysAgo || [])}
                </li>
              </ul>
              : '' 
            }
          </li>
          <li style={{ margin: '1.5em 0' }}>
            Have any of these users asked multiple questions? {numberOfUsersWithMultipleQuestions || 0}
            {
              gotAnswer?.length && getMultipleQuestions()?.length ?
              <ul style={{ fontSize: '0.5em' }}>
                <li>
                  Top 20 New Users by Reputation
                  {ListItemsMultiple(top20UsersJoinedLessThan30DaysAgo || [])}
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
