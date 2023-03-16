import { Message, StackExchangeResponse, User, UserQuestions } from '@alpha/api-interfaces';
import * as express from 'express';
import * as moment from 'moment';
import * as stackExchange from 'stack-exchange';
import { environment as env } from './environments/environment.prod';

const app = express();

app.use(express.json());

/**
 * Route: GET Health Check
 */
app.get('/api/health-check', (req, res) => {
  try {
    const msg: Message = {
      message: `API Server functional as of ${moment().toISOString()}`
    }
    res.send(msg);
  } catch (err) {
    res.send(err);
  }
});

/**
 * Route: GET Users (by Reputation)
 * 
 * max = maximum number of records to be returned
 * days = max number of days since joining (elt = "less than or equal to")
 */
app.get('/api/users/:max([0-9]{2,})/days-joined-elt/:days([0-9]{2,})', async (req, res) => {
  try {
    const { days, max } = req.params;

    const fromdate = days ? moment().subtract(30, 'days').unix() : 0;
    const topUsersByRepJoinedAfterFromDate = await getUsersByReputation(fromdate);
  
    let cnt = 0;
    const topUsers_limitByMax = topUsersByRepJoinedAfterFromDate
      .filter(() => cnt++ < parseInt(max,0));
  
    res.send(topUsers_limitByMax);  
  } catch (err) {
    res.send(err);
  }
});

/**
 * Route: POST Users With Answered Questions
 */
app.post('/api/users/answers', async (req, res) => {
  try {
    const { userIds } = req.body;
  
    const usersWithAnsweredQuestions = [];
    const questions = await getUsersWhoAskedAQuestionByUserIds(userIds);
    questions.map(question => {
      if (!question.is_answered) { return }
      usersWithAnsweredQuestions.push(question.owner.user_id);
    });
  
    res.send(usersWithAnsweredQuestions);  
  } catch (err) {
    res.send(err);
  }
});

/**
 * Route: POST Users Who Have Asked Questions
 */
app.post('/api/users/questions', async (req, res) => {
  try {
    const { userIds } = req.body;
  
    const usersWhoAskedQuestions = [];
    const questions = await getUsersWhoAskedAQuestionByUserIds(userIds);
    questions.map(question => {
      usersWhoAskedQuestions.push(question.owner.user_id);
    });
  
    res.send(usersWhoAskedQuestions);
  } catch (err) {
    res.send(err);
  }
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);


// --- overhead ---

const se  = stackExchange({ version : "2.2" });
const seUsers = se.users;
const seOptions = {
  key: "Ijr)ZtMKpCUuuApkMRw2ug(("
}

// --- utilities ---

function apiStackExchangeResponse(seResponse: string): any {
  let isDown = false;
  if (!seResponse) { isDown = true; }
  if (typeof seResponse !== 'string') { isDown = true; }
  if (seResponse[0] !== '{') { isDown = true; }
  if (isDown) {
    if (!env.production) {
      console.log('apiStackExchangeResponse', seResponse);
    }
    throw new Error('Stack Exchange API is DOWN !!!');
  }

  const obj: StackExchangeResponse = JSON.parse(seResponse);
  if (obj?.error_id) {
    if (!env.production) {
      console.log('apiStackExchangeResponse', seResponse);
    }
    throw new Error('Stack Exchange API is DOWN !!!');
  }
  if (!env.production) {
    const percentage = (obj.quota_remaining/obj.quota_max*100).toFixed(2);
    console.log(`${percentage}% of API Call Capacity Remaining`);
  }
  return obj?.items || [];
}

async function getUsersByReputation(fromdate = 0): Promise<User[]> {
  const options = Object.assign(
    {},
    seOptions,
    {
      fromdate,
      order: 'desc',
      sort: 'reputation'
    }
  );
  if (!fromdate) { delete options.fromdate; }
  return new Promise(function (resolve, reject) {
    try {
      seUsers.users(options, seResponse => {
        resolve(apiStackExchangeResponse(seResponse));
      });
    } catch (err) {
      console.error(`ERROR: ${err}`);
      reject(err);
    }
  });
}

async function getUsersWhoAskedAQuestionByUserIds(userIds: number[]): Promise<UserQuestions[]> {
  const options = Object.assign(
    {},
    seOptions
  );
  return new Promise(function (resolve, reject) {
    try {
      seUsers.questions_on_users(userIds.join(';'), options, seResponse => {
        resolve(apiStackExchangeResponse(seResponse));
      });
    } catch (err) {
      console.error(`ERROR: ${err}`);
      reject(err);
    }
  });
}

if (!env.production) {
  (async () => {
    const users = await getUsersByReputation();
    console.log(`test api call yields ${users?.length} users`);
  })();
}
