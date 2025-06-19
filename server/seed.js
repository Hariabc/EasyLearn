const axios = require('axios');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTI4NDhlM2FlNDE2NWZiYTFhOWFiNSIsImlhdCI6MTc1MDMzNzgxOCwiZXhwIjoxNzUwNDI0MjE4fQ.7FTADKWnOhT3jlpa7uhvA1Np4V5CmjuApJdaIV-rgNQ'; // replace with your test token
const courseId = '682da407424c2c617fbe4ddc'; // Frontend
const languages = {
  css: {
    id: '682da41b424c2c617fbe4de8',
    topics: [
      '682da41c424c2c617fbe4de9', '682da41e424c2c617fbe4dea', '682da420424c2c617fbe4deb',
      '682da422424c2c617fbe4dec', '682da423424c2c617fbe4ded', '682da425424c2c617fbe4dee',
      '682da427424c2c617fbe4def', '682da429424c2c617fbe4df0', '682da42a424c2c617fbe4df1',
      '682da42c424c2c617fbe4df2', '682da42e424c2c617fbe4df3', '682da430424c2c617fbe4df4',
      '682da432424c2c617fbe4df5', '682da434424c2c617fbe4df6'
    ]
  },
  javascript: {
    id: '682da434424c2c617fbe4df7',
    topics: [
      '682da436424c2c617fbe4df8', '682da438424c2c617fbe4df9', '682da43a424c2c617fbe4dfa',
      '682da43c424c2c617fbe4dfb', '682da43e424c2c617fbe4dfc', '682da440424c2c617fbe4dfd',
      '682da441424c2c617fbe4dfe', '682da443424c2c617fbe4dff', '682da445424c2c617fbe4e00',
      '682da447424c2c617fbe4e01', '682da449424c2c617fbe4e02', '682da44a424c2c617fbe4e03',
      '682da44c424c2c617fbe4e04', '682da44e424c2c617fbe4e05', '682da450424c2c617fbe4e06',
      '682da452424c2c617fbe4e07', '682da453424c2c617fbe4e08', '682da455424c2c617fbe4e09',
      '682da457424c2c617fbe4e0a', '682da459424c2c617fbe4e0b', '682da45b424c2c617fbe4e0c',
      '682da45c424c2c617fbe4e0d'
    ]
  },
  react: {
    id: '682da45d424c2c617fbe4e0e',
    topics: [
      '682da45e424c2c617fbe4e0f', '682da460424c2c617fbe4e10', '682da462424c2c617fbe4e11',
      '682da464424c2c617fbe4e12', '682da465424c2c617fbe4e13', '682da467424c2c617fbe4e14',
      '682da469424c2c617fbe4e15', '682da46a424c2c617fbe4e16', '682da46c424c2c617fbe4e17',
      '682da46e424c2c617fbe4e18', '682da470424c2c617fbe4e19', '682da471424c2c617fbe4e1a',
      '682da474424c2c617fbe4e1b', '682da475424c2c617fbe4e1c', '682da477424c2c617fbe4e1d',
      '682da479424c2c617fbe4e1e'
    ]
  },
  tailwind: {
    id: '682da479424c2c617fbe4e1f',
    topics: [
      '682da47a424c2c617fbe4e20', '682da47c424c2c617fbe4e21', '682da47e424c2c617fbe4e22',
      '682da480424c2c617fbe4e23', '682da481424c2c617fbe4e24', '682da483424c2c617fbe4e25',
      '682da485424c2c617fbe4e26', '682da486424c2c617fbe4e27', '682da488424c2c617fbe4e28',
      '682da48a424c2c617fbe4e29', '682da48b424c2c617fbe4e2a', '682da48d424c2c617fbe4e2b',
      '682da48f424c2c617fbe4e2c', '682da490424c2c617fbe4e2d'
    ]
  }
};

async function completeTopicsFor(language) {
  const { id: languageId, topics } = languages[language];
  console.log(`\n📘 Completing ${language.toUpperCase()} (${topics.length} topics):`);

  for (const topicId of topics) {
    try {
      const res = await axios.post('http://localhost:5000/api/users/markComplete', {
        courseId,
        languageId,
        topicId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.newlyEarnedBadges?.length > 0) {
        console.log('🏅 New badge(s):', res.data.newlyEarnedBadges.map(b => b.name));
      } else {
        console.log('✔ Completed:', topicId);
      }
    } catch (e) {
      console.error('❌ Error on topic', topicId, e.response?.data?.message || e.message);
    }
  }
}

async function run() {
  await completeTopicsFor('css');
  await completeTopicsFor('javascript');
  await completeTopicsFor('react');
  await completeTopicsFor('tailwind');
}

run();