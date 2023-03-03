import * as express from 'express';
import * as moment from 'moment';
import * as stackExchange from 'stack-exchange';
import { Message, StackExchangeResponse, User, UserQuestions } from '@alpha/api-interfaces';

const app = express();

app.use(express.json());

app.get('/api/health-check', (req, res) => {
  console.log('get::/api/health-check');
  try {
    const msg: Message = {
      message: `API Server functional as of ${moment().toISOString()}`
    }
    res.send(msg);
  } catch (err) {
    res.send(err);
  }
});

app.get('/api/users/:max([0-9]{2,})/days-joined-elt/:days([0-9]{2,})', async (req, res) => {
  console.log('get::/api/users/:max([0-9]{2,})/days-joined-elt/:days([0-9]{2,})');
  try {
    const { days, max } = req.params;

    const fromdate = days ? moment().subtract(30, 'days').unix() : 0;
    const topUsersByRepJoinedAfterFromDate = await getUsersByReputation(fromdate);
    console.log('usersJoinedSinceFromDate', topUsersByRepJoinedAfterFromDate[0]);
  
    let cnt = 0;
    const topUsers_limitByMax = topUsersByRepJoinedAfterFromDate
      .filter(() => cnt++ < parseInt(max,0));
    console.log('topUsers_limitByMax', topUsers_limitByMax.length);
  
    res.send(topUsers_limitByMax);  
  } catch (err) {
    res.send(err);
  }
});

app.post('/api/users/answers', async (req, res) => {
  console.log('post::/api/users/answers');
  try {
    const { userIds } = req.body;
    console.log({userIds});
  
    const usersWithAnsweredQuestions = [];
    const questions = await getUsersWhoAskedAQuestionByUserIds(userIds);
    questions.map(question => {
      if (!question.is_answered) { return }
      usersWithAnsweredQuestions.push(question.owner.user_id);
    });
    console.log('usersWithAnsweredQuestions', usersWithAnsweredQuestions);
  
    res.send(usersWithAnsweredQuestions);  
  } catch (err) {
    res.send(err);
  }
});

app.post('/api/users/questions', async (req, res) => {
  console.log('post::/api/users/questions');
  try {
    const { userIds } = req.body;
    console.log({userIds});
  
    const usersWhoAskedQuestions = [];
    const questions = await getUsersWhoAskedAQuestionByUserIds(userIds);
    questions.map(question => {
      usersWhoAskedQuestions.push(question.owner.user_id);
    });
    console.log('usersWhoAskedQuestions', usersWhoAskedQuestions);
  
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
    console.log('apiStackExchangeResponse', seResponse);
    throw new Error('Stack Exchange API is DOWN !!!');
  }

  const obj: StackExchangeResponse = JSON.parse(seResponse);
  if (obj?.error_id) {
    console.log('apiStackExchangeResponse', seResponse);
    throw new Error('Stack Exchange API is DOWN !!!');
  }
  const percentage = (obj.quota_remaining/obj.quota_max*100).toFixed(2);
  console.log(`${percentage}% of API Call Capacity Remaining`);
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

(async () => {
  const users = await getUsersByReputation();
  console.log(`test api call yields ${users?.length} users`);
})()
