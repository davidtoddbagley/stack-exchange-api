import * as assert from 'assert';
import * as express from 'express';
import * as moment from 'moment';
import * as request from 'supertest';

const app = express();

describe('main', () => {

  describe('/api/health-check', () => {

    beforeEach(() => jest.clearAllMocks());
    
    it('responds with text/html', function() {
        request(app, { http2: true })
            .get('/api/health-check')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200);
    });

    it('returns expected data', function() {
        const mockedTime = '123';
        jest.mock('moment', () => ({
            moment: () => mockedTime
        }));
        request(app, { http2: true })
            .get('/api/health-check')
            .set('Accept', 'application/json')
            .then(response => {
                assert(response.body.message, `API Server functional as of ${moment().toISOString()}`)
            });
        });
    });
});
