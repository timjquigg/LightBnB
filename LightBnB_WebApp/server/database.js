require('dotenv').config();
const { Pool } = require('pg');

const properties = require('./json/properties.json');
const users = require('./json/users.json');
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB,
};

const pool = new Pool(dbConfig);

pool.connect()
  .then(() => {
    console.log(`Connected to database: ${dbConfig.database} on host: ${dbConfig.host}\n-----------------------------------------------------`);
  }).catch((error) => {
    console.log(`Connection Error: ${error}`);
  });


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) =>{
  const queryString = `
    SELECT *
    FROM users
    WHERE users.email = $1`;
  return pool
    .query(
      queryString, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE users.id = $1`;
  return pool
    .query(
      queryString, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const name = user.name;
  const email = user.email;
  const password = user.password;
  const values = [name, email, password];

  const queryString = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`;
  return pool
    .query(
      queryString, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guest_id, limit = 10) => {
  const queryString = `
    SELECT
      reservations.id,
      properties.*,
      reservations.start_date,
      AVG(property_reviews.rating)
    FROM
      reservations
      JOIN properties on properties.id = reservations.property_id
      JOIN property_reviews on properties.id = property_reviews.id
    WHERE
      reservations.guest_id = $1
    GROUP BY
      reservations.id,
      properties.id
    ORDER BY
      reservations.start_date
    LIMIT
      $2;`;

  return pool
    .query(
      queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};


exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {

  const queryString = `
  SELECT * FROM properties
  LIMIT $1;
  `;
  return pool
    .query(
      queryString, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
