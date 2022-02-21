const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

const server = require('../../../server.js');

const Concert = require('../../../models/concerts.model');


describe('GET/api/concerts', function () {

  this.timeout(5000);

  before(async () => {
    const testConOne = new Concert({ _id: '5d9f1140f10a81216cfd4408', performer: 'Performer1', genre: 'Genre1', price: '20', day: '1', image: '/img/uploads/1fsd324fsdg.jpg' });
    await testConOne.save();

    const testConTwo = new Concert({ _id: '5d9f1159f81ce8d1ef2bee48', performer: 'Performer2', genre: 'Genre2', price: '30', day: '2', image: '/img/uploads/2f342s4fsdg.jpg' });
    await testConTwo.save();

    const testConThree = new Concert({ _id: '5d9f1140f10a81216cfd4400', performer: 'Performer1', genre: 'Genre1', price: '35', day: '1', image: '/img/uploads/hdfh42sd213.jpg' });
    await testConThree.save();

  });

  it('/ should return all concerts', async () => {

    const res = await request(server).get('/api/concerts');
      expect(res.status).to.be.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.equal(3);
  });

	it('/:id should return one concert by :id ', async () => {
		const res = await request(server).get('/api/concerts/5d9f1140f10a81216cfd4408');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.an('object');
		expect(res.body).to.not.be.null;
	});

	it('/performer/:performer should return an array with concerts filtered by performer', async () => {
		const res = await request(server).get('/api/concerts/performer/Performer1');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.an('array');
		expect(res.body.length).to.be.equal(2);
	});

	it('/genre/:genre should return an array with concerts filtered by genre', async () => {
		const res = await request(server).get('/api/concerts/genre/Genre2');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.an('array');
		expect(res.body.length).to.be.equal(1);
	});


	it('/price/:price_min/:price_max should return an array with concerts filtered by price', async () => {
		const res = await request(server).get('/api/concerts/price/10/50');
		expect(res.status).to.be.equal(200);
		expect(res.body).to.be.an('array');
		expect(res.body.length).to.be.equal(3);
	});

  after(async () => {
    await Concert.deleteMany();
  });

});