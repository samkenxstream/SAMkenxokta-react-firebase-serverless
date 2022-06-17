const getGrades = (user, semester) => {

    return {
        name: user.name,
        school: getFakeUniversityName(user.email),
        semester: semester.name,
        year: semester.year,
        grades: grades.filter(r => r.year == semester.year).filter(r => r.semester == semester.name)
      
    }
}

const getFakeUniversityName = (email) => {
    const number = Math.floor(Math.random() * 2);
    const domain = parseDomain(email);

    switch(number)
    {
        case 0: 
            return 'University of ' + domain;
        case 1: 
            return domain + ' State University'
        default:
            return 'University of ' + domain;
    }
}

const parseDomain = (email) => {
    const emailParts = email.split('@');
    const domainParts = emailParts[1].split('.');

    let name = '';

    domainParts.forEach((part, i) => {
        if(i > 0)
        {
            name += ' '; 
        }
        if(i+1 < domainParts.length)
        {
            name += part.charAt(0).toUpperCase() + part.slice(1);
        }
    });

    return name;
}

const grades = [
    {
        course: 'Calculus 1',
        score: 72,
        letterGrade: 'C',
        year: 2021,
        semester: 'Fall'
    },
    {
        course: 'Intro to Ballroom Dance',
        score: 94,
        letterGrade: 'A',
        year: 2021,
        semester: 'Fall'
    },
    {
        course: 'Computer Science 101',
        score: 65,
        letterGrade: 'F',
        year: 2021,
        semester: 'Fall'
    },
    {
        course: 'Intro to Modern Physics',
        score: 88,
        letterGrade: 'B',
        year: 2021,
        semester: 'Fall'
    },

    {
        course: 'Calculus 2',
        score: 84,
        letterGrade: 'C',
        year: 2021,
        semester: 'Spring'
    },
    {
        course: 'Geometry',
        score: 97,
        letterGrade: 'A',
        year: 2021,
        semester: 'Spring'
    },
    {
        course: 'Computer Science 101',
        score: 76,
        letterGrade: 'C',
        year: 2021,
        semester: 'Spring'
    },
    {
        course: 'Physics II',
        score: 88,
        letterGrade: 'B',
        year: 2021,
        semester: 'Spring'
    },

    {
        course: 'Calculus 3',
        score: 84,
        letterGrade: 'C',
        year: 2022,
        semester: 'Fall'
    },
    {
        course: 'Abstract Algebra',
        score: 97,
        letterGrade: 'A',
        year: 2022,
        semester: 'Fall'
    },
    {
        course: 'Computer Science 102',
        score: 76,
        letterGrade: 'C',
        year: 2022,
        semester: 'Fall'
    },
    {
        course: 'Public Speaking',
        score: 88,
        letterGrade: 'B',
        year: 2022,
        semester: 'Fall'
    },

    {
        course: 'Adv Calculus',
        score: 84,
        letterGrade: 'C',
        year: 2022,
        semester: 'Spring'
    },
    {
        course: 'Geometry',
        score: 97,
        letterGrade: 'A',
        year: 2022,
        semester: 'Spring'
    },
    {
        course: 'Javascript in the Modern Web',
        score: 76,
        letterGrade: 'C',
        year: 2022,
        semester: 'Spring'
    },
    {
        course: 'Cryptography',
        score: 88,
        letterGrade: 'B',
        year: 2022,
        semester: 'Spring'
    },
]

module.exports = { getGrades };
