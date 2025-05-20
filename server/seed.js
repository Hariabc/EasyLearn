const mongoose = require('mongoose');
const Course = require('./models/Course');
const Language = require('./models/Language');

// Replace with your DB URI
const MONGO_URI = '';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // 1. Create the course
    const course = await Course.create({
      title: 'Computer Languages',
      category: 'Computer Science',
      description: 'Fundamental programming languages.',
      image: 'comp_lang.png',
      languages: [] // Will fill later
    });

    // 2. Define language names
    const languageNames = ['C', 'C++', 'Java', 'Python'];

    // 3. Create each language and link to course
    const languageDocs = await Promise.all(
      languageNames.map(async (name) => {
        return await Language.create({ name, course: course._id });
      })
    );

    // 4. Update the course with language ObjectIds
    course.languages = languageDocs.map(lang => lang._id);
    await course.save();

    console.log('✅ Seeding successful!');
    console.log('Course ID:', course._id);
    console.log('Languages:', languageDocs.map(l => `${l.name}: ${l._id}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
