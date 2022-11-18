$(() => {
  
  $('body').on('click', '.make_reservation',function() {
    // views_manager.show('reservation');
    makeReservation({property_id:this.name});
  });

  window.propertyListing = {};
  
  
  const createListing = (property, isReservation) =>{
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
            ${!isReservation ? `<button name="${property.id}" class="make_reservation">Book Me</button>` : ''}
          </footer>
        </section>
      </article>
    `;
  };


  window.propertyListing.createListing = createListing;

});