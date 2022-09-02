console.log('Sleep logger initialised...')

const log = (date, awake_time, sleep_time, quality, callback ) => {
  console.log('calculating sleep')
  let A = new Date(date)
  let B = new Date(date)
  A.setUTCHours(sleep_time.slice(0,2))
  A.setMinutes(sleep_time.slice(3,5))

  if (Number(sleep_time.slice(0,22))<12) {
    B.setDate(B.getDate())
    B.setUTCHours(awake_time.slice(0,2))
    B.setMinutes(awake_time.slice(3,5))
  }
  else {
    B.setDate(B.getDate()+1);
    B.setUTCHours(awake_time.slice(0,2))
    B.setMinutes(awake_time.slice(3,5))
  }

  let duration = (B - A)/1000/60/60
  console.log(B, '-', A,'=',duration.toFixed(2), 'hrs')

  let grade = 0
  let number = parseInt(quality.slice(0))
  let grade1 = 100*number/5

  if (duration => 8.5) {
    grade = (100+grade1)/2
  }
  else {
    grade = (grade1+(100*(duration/8.5))/2)
  }

  callback(duration.toFixed(2), grade.toFixed(2))
}

module.exports = {
  log
}
