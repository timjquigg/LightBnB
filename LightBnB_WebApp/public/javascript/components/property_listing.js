$(() => {
  
  $('body').on('click', '.make_reservation', function() {
    propertyListings.clearListings();
    makeReservation({property_id:this.name})
      .then(function(json) {
        propertyListings.addProperties(json, false, true);
        views_manager.show('reservation');
      })
      .catch(error => console.error(error));
  });

  $('body').on('submit', '#reservation-form', function(event) {
    event.preventDefault();
    const data = $(this).serialize();
    submitReservation(data)
      .then(() => {
        $('body').find('header').find('.my_reservations_button').trigger('click');
      });
  });

  window.propertyListing = {};
  
  
  const createListing = (property, isReservation, isBooking) =>{
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number of bedrooms: ${property.number_of_bedrooms}</li>
            <li>number of bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ?
    `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>`
    : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night / 100.0}/night</div>
            ${!isReservation && !isBooking ? `<button name="${property.id}" class="make_reservation">Book Me</button>` : ''}
            ${isBooking ? `<form id="reservation-form" class="reservation-form">
            <p>Make Reservation</p>
            <input name="property_id" value="${property.id}" hidden></input>
            <div class="reservation-form__field-wrapper">
              <input type="date" name="start_date" placeholder="start_date">
            </div>
      
            <div class="reservation-form__field-wrapper">
                <input type="date" name="end_date" placeholder="end_date">
              </div>
      
            <div class="reservation-form__field-wrapper">
                <button>Reserve!</button>
                <a id="reservation-form__cancel" href="#">Cancel</a>
            </div>
          </form>` : ''}
          </footer>
        </section>
      </article>
    `;
  };


  window.propertyListing.createListing = createListing;

});