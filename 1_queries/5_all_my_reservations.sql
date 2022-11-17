SELECT
  reservations.id,
  properties.title,
  reservations.start_date,
  properties.cost_per_night,
  AVG(property_reviews.rating)
FROM
  reservations
  JOIN properties on properties.id = reservations.property_id
  JOIN property_reviews on properties.id = property_reviews.id
WHERE
  reservations.guest_id = 1
GROUP BY
  reservations.id,
  properties.id
ORDER BY
  reservations.start_date
LIMIT
  10;