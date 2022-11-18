$(() => {
  
  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  const addListing = function(listing) {
    $propertyListings.append(listing);
  };
  const clearListings = function() {
    $propertyListings.empty();
  };
  window.propertyListings.clearListings = clearListings;

  const addProperties = function(properties, isReservation = false, isBooking = false) {
    clearListings();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation, isBooking);
      addListing(listing);
    }
  };
  
  window.propertyListings.addProperties = addProperties;

});