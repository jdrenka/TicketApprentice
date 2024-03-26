import('chai').then(chai => {
    const { expect } = chai;
    const chaiHttp = require('chai-http');
    import('../Server/app.js').then(app => {
      const fs = require('fs');
      chai.use(chaiHttp);

      describe('Profile Page', () => {
        it('should render profile.ejs with user data', (done) => {
          chai.request(app)
            .get('/profile')
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res).to.have.status(200);
              expect(res).to.be.html;
              expect(res.text).to.include('<title>Profile</title>');
              expect(res.text).to.include('User Data');
  

              const profileEJSContent = fs.readFileSync('./views/profile.ejs', 'utf8');
              expect(res.text).to.include(profileEJSContent);
  
              done(); 
            });
        });
      });
    }).catch(error => {
      console.error('Error importing app.js:', error);
    });
}).catch(error => {
  console.error('Error importing Chai:', error);
});
