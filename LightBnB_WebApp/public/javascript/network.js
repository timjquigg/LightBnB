const getMyDetails = function() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
};

const logOut = function() {
  return $.ajax({
    method: "POST",
    url: "/users/logout",
  });
};

const logIn = function(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
    data
  });
};

const reservation = function(data) {
  return $.ajax({
    method: "POST",
    url: "/users/reservation",
    data
  });
};

const signUp = function(data) {
  return $.ajax({
    method: "POST",
    url: "/users",
    data
  });
};

const getAllListings = function(params) {
  let url = "/api/properties";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
};

const getAllReservations = function() {
  let url = "/api/reservations";
  return $.ajax({
    url,
  });
};

const submitProperty = function(data) {
  return $.ajax({
    method: "POST",
    url: "/api/properties",
    data,
  });

};
const makeReservation = function(data) {
  return $.ajax({
    method: "GET",
    url: "/api/makeReservation",
    data
  });
};

const submitReservation = function(data) {
  console.log(`${data} in network.js`);
  return $.ajax({
    method: "POST",
    url: "/api/makeReservation",
    data
  });
};