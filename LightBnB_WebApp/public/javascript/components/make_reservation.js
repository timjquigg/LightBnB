$(() => {

  const $reservationForm = $(`
  <form id="reservation-form" class="reservation-form">
      <p>Make Reservation</p>
      <div class="reservation-form__field-wrapper">
        <input type="email" name="email" placeholder="Email">
      </div>

      <div class="reservation-form__field-wrapper">
          <input type="password" name="password" placeholder="Password">
        </div>

      <div class="reservation-form__field-wrapper">
          <button>reservation</button>
          <a id="reservation-form__cancel" href="#">Cancel</a>
      </div>
    </form>
  `);

  window.$reservationForm = $reservationForm;

  // $reservationForm.on('submit', function(event) {
  //   event.preventDefault();

  //   const data = $(this).serialize();
  //   logIn(data)
  //     .then(json => {
  //       console.log(json);
  //       if (!json.user) {
  //         views_manager.show('error', 'Failed to login');
  //         return;
  //       }
  //       console.log(json.user);
  //       header.update(json.user);
  //       views_manager.show('listings');
  //     });
  // });

  // $('body').on('click', '#login-form__cancel', function() {
  //   views_manager.show('listings');
  //   return false;
  // });
      
});