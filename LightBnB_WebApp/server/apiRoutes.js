module.exports = function(router, database) {

  router.get('/properties', (req, res) => {
    database.getAllProperties(req.query, 20)
      .then(properties => res.send({properties}))
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  router.get('/reservations', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.error("💩");
      return;
    }
    database.getAllReservations(userId)
      .then(reservations => res.send({reservations}))
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  router.post('/properties', (req, res) => {
    const userId = req.session.userId;
    database.addProperty({...req.body, owner_id: userId})
      .then(property => {
        res.send(property);
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  router.get('/makeReservation', (req,res) => {
    database.getProperty(req.query)
      .then(property => {
        res.send({property});
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  router.post('/makeReservation', (req, res) => {
    const reservation = {};
    for (const key in req.body) {
      reservation[key] = req.body[key];
    }
    reservation['guest_id'] = req.session.userId;
    database.addReservation(reservation)
      .then(response =>{
        res.send({response});
      })
      .catch(e => {
        console.error(e);
        res.send(e);
      });
  });

  return router;
};

