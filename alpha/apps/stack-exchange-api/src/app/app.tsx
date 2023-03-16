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

  const [
    details,
    toggleDetails
  ] = useState<boolean>(false);

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

  function displayQandA(q: string, n: number) {
    const backgroundColor = n ? '#0d6efd' : '#b3b3b3';
    const border = n ? '1px solid #0a58ca' : '1px solid #808080';
    return (
      <div style={{
        display: 'inline',
        float: 'left',
        width: '80vw'
      }}>
        <span style={{
          float: 'left',
          margin: '0 1em',
          textAlign: 'right',
          width: '50vw'
        }}>
          {q}
        </span>
        <span style={{
          backgroundColor,
          border,
          borderRadius: '20px',
          color: 'white',
          float: 'left',
          margin: '-0.15em 1em 0',
          minWidth: '80px',
          padding: '0.1em .5em',
          textAlign: 'center',
          width: 'auto'
        }}>
          {n}
        </span>
      </div>
    );
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
      <div className='list-items'>
        <ol>{listItems}</ol>
        <p>{JSON.stringify(_)}</p>
        <span>Total Answers: { _?.length }</span>
      </div>
    );
  }

  function ListItemsMultiple(users: User[]) {
    const _ = getMultipleQuestions() || [];
    const listItems = users.map((user: User) =>
      <li
        style={{
          color: _?.indexOf(user.user_id) === -1 ? '#b3b3b3' : '#0d6efd',
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
        { _?.indexOf(user.user_id) > -1 ? <span style={{ float: 'right' }}>q's: {
            _?.filter(x => x === user.user_id).length + 1
          }</span> : (_?.indexOf(user?.user_id) > -1) }
      </li>
    );

    const sum = users.map((user: User) => {
      const multipleQuestions = _?.filter(x => x === user.user_id).length + 1;
      return multipleQuestions > 1 ? multipleQuestions : 0; 
    });
    console.log(sum);
    return (
      <div className='list-items'>
        <ol>{listItems}</ol>
        <p>{JSON.stringify(_)}</p>
        <span>Total Answers: { sum.reduce((a,v) => a+v, 0) }</span>
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
      <div className='list-items'>
        <ol>{listItems}</ol>
        <p>{JSON.stringify(_)}</p>
        <span>Total Questions: { _?.length }</span>
      </div>
    );
  }

  function toggle() {
    toggleDetails(!details);
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
            : ''
            }
            { askedQuestion?.length && !gotAnswer?.length ?
              <button
                className="btn btn-success"
                data-cy="btn-q2"
                onClick={() => q2()}>
                CONTINUE
              </button>
            : ''
          }
            { askedQuestion?.length && gotAnswer?.length ?
              <button
                className="btn btn-link"
                data-cy="btn-toggle"
                onClick={() => toggle()}
                style={{ textDecoration: 'none' }}>
                { details ? 'Hide' : 'Show' } Details
              </button>
            : ''
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
        <p>
          Of the top 20 users by reputation who joined StackOverflow in the last month ({top20UsersJoinedLessThan30DaysAgo?.length || 0})...
        </p>
        <ol className='questions'>
          <li>
            
            {displayQandA(
              'How many asked a question?',
              [...new Set(askedQuestion || [])].length || 0
            )}
          </li>
          {
            details && askedQuestion?.length ?
            <div className='details'>
              <h5>Top 20 New Users by Reputation (with Join Date and Questions Asked)</h5>
              {ListItemsQuestions(top20UsersJoinedLessThan30DaysAgo || [])}
            </div>
            : '' 
          }
          <li>
            {displayQandA(
              'How many questions have been answered?',
              gotAnswer?.length || 0
            )}
          </li>
          {
            details && gotAnswer?.length ?
            <div className='details'>
              <h5>Top 20 New Users by Reputation (with Join Date and Questions Answered)</h5>
              {ListItemsAnswers(top20UsersJoinedLessThan30DaysAgo || [])}
            </div>
            : '' 
          }
          <li>
            {displayQandA(
              'How many asked multiple questions?',
              numberOfUsersWithMultipleQuestions || 0
            )}
          </li>
          {
            details && gotAnswer?.length && getMultipleQuestions()?.length ?
            <div className='details'>
              <h5>Top 20 New Users by Reputation (with Join Date and Questions Asked)</h5>
              {ListItemsMultiple(top20UsersJoinedLessThan30DaysAgo || [])}
            </div>
            : '' 
          }
        </ol>
      </div>
    </>
  );
};

export default App;
