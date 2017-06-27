import { AirportlogPage } from './app.po';

describe('airportlog App', () => {
  let page: AirportlogPage;

  beforeEach(() => {
    page = new AirportlogPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
