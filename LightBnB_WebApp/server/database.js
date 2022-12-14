require('dotenv').config();
const { Pool, Query } = require('pg');

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
    WHERE users.email = $1;`;
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
const getAllReservations = (guest_id, limit = 30) => {
  const queryString = `
    SELECT
      reservations.id,
      properties.*,
      reservations.start_date,
      reservations.end_date,
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
      reservations.start_date DESC
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
  
  let queryString = `
    SELECT
      properties.*,
      avg(rating) as average_rating
    FROM
      properties
      JOIN property_reviews on property_id = properties.id
    `;
  const queryParams = [];

  if (options.city) {
    queryParams.push(`%${options.city.slice(2)}%`);
    queryString += `
      WHERE city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    queryString += `
      WHERE owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(100 * options.minimum_price_per_night);
    queryString += `
      ${queryParams.length > 0 ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(100 * options.maximum_price_per_night);
    queryString += `
      ${queryParams.length > 0 ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length}`;
  }

  queryString += `
  GROUP BY properties.id`;
  
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
      HAVING avg(rating) >= $${queryParams.length}`;
  }

  
  
  queryParams.push(limit);
  queryString += `
    LIMIT $${queryParams.length};`;
 
  return pool
    .query(
      queryString, queryParams)
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
  
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];
  
  const queryString = `
    INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      number_of_bedrooms,
      number_of_bathrooms,
      parking_spaces
      )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    RETURNING *;`;
  
  return pool
    .query(
      queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });

};
exports.addProperty = addProperty;

/**
 * Get property for Reservation.
 * @param {{}} options An object containing query options.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getProperty = (options) => {
  const queryString = `
    SELECT 
      properties.*, avg(rating) as average_rating
    FROM properties
    JOIN property_reviews on properties.id = property_id
    WHERE properties.id = $1
    GROUP BY properties.id;`;
  return pool
    .query(
      queryString, Object.values(options))
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getProperty = getProperty;

/**
 * Add a reservation to the database
 * @param {{}} options An object containing the property id & start & end dates.
 * @return {Promise<{}>} A promise to the property.
 */
const addReservation = function(options) {
  const queryParams = [
    options.start_date,
    options.end_date,
    options.property_id,
    options.guest_id
  ];
  const queryString = `
    INSERT INTO reservations(
      start_date,
      end_date,
      property_id,
      guest_id
    ) VALUES
    ($1, $2, $3, $4)
    RETURNING *;`;
  return pool
    .query(
      queryString, queryParams)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addReservation = addReservation;