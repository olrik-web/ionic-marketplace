export function showTabBar() {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "flex";
  }
}

export function hideTabBar() {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "none";
  }
}

export function timeConverter(timestamp, preciseDate) {
  let unix_timestamp = timestamp.seconds;
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  const date = new Date(unix_timestamp * 1000);
  const dateNow = new Date();

  // Check if the two dates are the same day, month or year
  if (
    date.getUTCMinutes() === dateNow.getUTCMinutes() &&
    date.getUTCHours() === dateNow.getUTCHours() &&
    date.getUTCDate() === dateNow.getUTCDate() &&
    date.getUTCMonth() === dateNow.getUTCMonth() &&
    date.getUTCFullYear() === dateNow.getUTCFullYear()
  ) {
    // The message was sent this minute
    return { time: "", message: "A few seconds ago..." };
  } else if (
    date.getUTCHours() === dateNow.getUTCHours() &&
    date.getUTCDate() === dateNow.getUTCDate() &&
    date.getUTCMonth() === dateNow.getUTCMonth() &&
    date.getUTCFullYear() === dateNow.getUTCFullYear()
  ) {
    // The two dates are the same hour, day, month and year so we'll return the difference in minutes
    return preciseDate
      ? { time: `${date.getUTCHours()}:${date.getUTCMinutes()}` }
      : { time: dateNow.getUTCMinutes() - date.getUTCMinutes(), message: "minute(s) ago..." };
  } else if (
    date.getUTCDate() === dateNow.getUTCDate() &&
    date.getUTCMonth() === dateNow.getUTCMonth() &&
    date.getUTCFullYear() === dateNow.getUTCFullYear()
  ) {
    // The two dates are the same day, month and year so we'll return the difference in hours
    return preciseDate
      ? { time: `${date.getUTCHours()}:${date.getUTCMinutes()}` }
      : { time: dateNow.getUTCHours() - date.getUTCHours(), message: "hour(s) ago..." };
  } else if (date.getUTCMonth() === dateNow.getUTCMonth() && date.getUTCFullYear() === dateNow.getUTCFullYear()) {
    // The two dates are the same month and year but NOT day so we'll return the difference in days
    return preciseDate
      ? { time: `${date.getUTCDate()}/${date.getUTCMonth()} ${date.getUTCHours()}:${date.getUTCMinutes()}` }
      : { time: dateNow.getUTCDate() - date.getUTCDate(), message: "day(s) ago..." };
  } else if (date.getUTCFullYear() === dateNow.getUTCFullYear()) {
    // The two dates are the same year but NOT day and month so we'll return the difference in months
    return preciseDate
      ? { time: `${date.getUTCDate()}/${date.getUTCMonth()} ${date.getUTCHours()}:${date.getUTCMinutes()}` }
      : { time: dateNow.getUTCMonth() - date.getUTCMonth(), message: "month(s) ago..." };
  } else {
    // The two dates are NOT the same year, day and month so we'll return the difference in years
    return preciseDate
      ? {
          time: `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}`,
        }
      : { time: dateNow.getUTCFullYear() - date.getUTCFullYear(), message: "year(s) ago..." };
  }
}
