
// create test profiel using this json
/*

{  
  "id": 1,
  "name": "A Martinez",
  "description": "Adolph Larrue Martinez III.",
  "mbti": "ISFJ",
  "enneagram": "9w3",
  "variant": "sp/so",
  "tritype": 725,
  "socionics": "SEE",
  "sloan": "RCOEN",
  "psyche": "FEVL",
  "image": "https://soulverse.boo.world/images/1.png",
}

*/

const TestProfile = {
  name: 'A Martinez',
  description: 'Adolph Larrue Martinez III.',
  mbti: 'ISFJ',
  enneagram: '9w3',
  variant: 'sp/so',
  tritype: '725',
  socionics: 'SEE',
  sloan: 'RCOEN',
  psyche: 'FEVL',
}

const User1 = {
  name: 'Elon Musk'
}

const User2 = {
  name: 'Jeff Bezos'
}

const TestVoteByUser1 = {
  title: "A Martinez's profile is good",
  comment: "I like this profile!",
  by: User1.name,
}

const TestVoteByUser2 = {
  title: "Just not an INTJ",
  comment: "I dont't think he is an INTJ based on his profile and the way he talks.",
  by: User2.name,
}


module.exports = {
  TestProfile,
  User1,
  User2,
  TestVoteByUser1,
  TestVoteByUser2,
}
