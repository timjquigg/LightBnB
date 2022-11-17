SELECT
  properties.id,
  title,
  cost_per_night,
  avg(rating) as average_rating
FROM
  properties
  JOIN property_reviews on property_id = properties.id
WHERE
  city LIKE '%ancouver'
GROUP BY
  properties.id
HAVING
  avg(rating) >= 4
ORDER BY
  average_rating
LIMIT
  10;